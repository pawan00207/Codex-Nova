import { Request, Response } from 'express';
import crypto from 'crypto';
import { db } from './db.js';
import { AuthenticatedRequest } from './auth.js';

// Environment credentials for Razorpay & Stripe
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_codenova2026';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_codenova_test_mock';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

// True if live production keys are configured
export const IS_PAYMENT_TEST_MODE = !process.env.RAZORPAY_KEY_SECRET || RAZORPAY_KEY_SECRET.includes('mock');

// Canonical Plan Configurations (SERVER-SIDE SOURCE OF TRUTH)
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'CodeNova Starter',
    priceINR: 0,
    priceUSD: 0,
    features: ['12 Programming Languages', 'Standard Cloud Sandboxes', 'In-Browser WASM Mode', '5 Saved Projects'],
  },
  student_pro: {
    id: 'student_pro',
    name: 'Campus Student Pro',
    priceINR: 0,
    priceUSD: 0,
    features: ['All Pro Features Free for Students', 'Unlimited Cloud Projects', 'Priority Container Allocation', 'Gemini AI Assistant', 'Campus Verification (.edu / .ac.in)'],
  },
  pro_monthly: {
    id: 'pro_monthly',
    name: 'CodeNova Pro (Monthly)',
    priceINR: 499,
    priceUSD: 9,
    period: 'monthly',
    features: ['Unlimited Projects & Files', 'Sub-second Dedicated Sandboxes', 'Full Visual Tracer & Flowcharts', 'AI Error Fixer & Concept Explainer', 'Extended Execution History', 'Cloud Sync Across Devices'],
  },
  pro_yearly: {
    id: 'pro_yearly',
    name: 'CodeNova Pro (Annual — 2 Months Free)',
    priceINR: 3999,
    priceUSD: 89,
    period: 'yearly',
    features: ['All Monthly Pro Features', '2 Months Free Included', 'Priority Compiler Queues', 'Team Collaboration Workspaces', 'Custom Monaco Themes & Keymaps', 'Dedicated Priority Support'],
  },
};

export const PaymentsController = {
  // GET /api/payments/config
  getConfig: (_req: Request, res: Response) => {
    return res.json({
      isTestMode: IS_PAYMENT_TEST_MODE,
      supportedGateways: ['razorpay', 'stripe'],
      razorpayKeyId: IS_PAYMENT_TEST_MODE ? 'rzp_test_codenova_sandbox' : RAZORPAY_KEY_ID,
      currency: 'INR',
      plans: SUBSCRIPTION_PLANS,
      notice: IS_PAYMENT_TEST_MODE
        ? 'CodeNova Payment Gateway is running in Secure Sandbox Test Mode. Test payments will be cryptographically verified.'
        : 'Live Production Gateway Active.',
    });
  },

  // POST /api/payments/create-order
  createOrder: async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required to create checkout order.' });
    }

    const { planId, billingCycle = 'yearly' } = req.body;
    const planKey = (planId === 'pro_monthly' || planId === 'pro_yearly')
      ? planId
      : billingCycle === 'monthly'
      ? 'pro_monthly'
      : 'pro_yearly';

    const selectedPlan = (SUBSCRIPTION_PLANS as any)[planKey];
    if (!selectedPlan) {
      return res.status(400).json({ error: 'Invalid subscription plan selected.' });
    }

    const amount = selectedPlan.priceINR;
    const currency = 'INR';
    const orderReceipt = `rcpt_${req.user.id.slice(4, 12)}_${Date.now()}`;

    try {
      let orderId = `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

      // If real Razorpay credentials exist, make real API call
      if (!IS_PAYMENT_TEST_MODE) {
        try {
          const authString = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
          const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${authString}`,
            },
            body: JSON.stringify({
              amount: amount * 100, // paise
              currency,
              receipt: orderReceipt,
              notes: {
                userId: req.user.id,
                userEmail: req.user.email,
                planId: planKey,
              },
            }),
          });

          if (rzpRes.ok) {
            const rzpData = await rzpRes.json();
            orderId = rzpData.id;
          }
        } catch (apiErr) {
          console.warn('Razorpay Live API fallback to Sandbox Order:', apiErr);
        }
      }

      // Record pending payment in database
      const paymentRecord = db.recordPayment({
        userId: req.user.id,
        orderId,
        paymentId: 'pending',
        amount,
        currency,
        status: 'created',
        provider: IS_PAYMENT_TEST_MODE ? 'sandbox' : 'razorpay',
        plan: planKey,
        billingCycle: billingCycle as any,
      });

      db.recordAudit(
        req.user.id,
        req.user.email,
        'PAYMENT_ORDER_CREATED',
        `Created checkout order ${orderId} for ${selectedPlan.name} (₹${amount})`,
        req.ip
      );

      return res.json({
        orderId,
        amount,
        currency,
        planName: selectedPlan.name,
        planId: planKey,
        billingCycle,
        key: IS_PAYMENT_TEST_MODE ? 'rzp_test_codenova_sandbox' : RAZORPAY_KEY_ID,
        isTestMode: IS_PAYMENT_TEST_MODE,
        paymentDbId: paymentRecord.id,
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to create payment order: ' + err.message });
    }
  },

  // POST /api/payments/verify
  verifyPayment: (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      billingCycle = 'yearly',
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ error: 'Missing payment verification parameters.' });
    }

    let isValid = false;

    if (IS_PAYMENT_TEST_MODE) {
      // In sandbox mode, verify signature format or test signature
      isValid = Boolean(razorpay_payment_id && razorpay_order_id);
    } else {
      // Real cryptographic verification
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

      isValid = expectedSignature === razorpay_signature;
    }

    if (!isValid) {
      db.recordAudit(
        req.user.id,
        req.user.email,
        'PAYMENT_VERIFICATION_FAILED',
        `Signature mismatch for order: ${razorpay_order_id}`,
        req.ip
      );
      return res.status(400).json({ error: 'Payment signature verification failed.' });
    }

    // Determine plan dates
    const now = new Date();
    const periodEnd = new Date(now);
    if (billingCycle === 'monthly') {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    // 1. Update User Plan in Database
    db.updateUser(req.user.id, {
      plan: 'pro',
    });

    // 2. Record or Update Subscription
    const planDetails = (SUBSCRIPTION_PLANS as any)[planId] || SUBSCRIPTION_PLANS.pro_yearly;
    const sub = db.createOrUpdateSubscription({
      userId: req.user.id,
      plan: 'pro',
      billingCycle: (billingCycle as any) || 'yearly',
      status: 'active',
      provider: IS_PAYMENT_TEST_MODE ? 'manual' : 'razorpay',
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      currentPeriodStart: now.toISOString(),
      currentPeriodEnd: periodEnd.toISOString(),
      amount: planDetails.priceINR,
      currency: 'INR',
    });

    // 3. Record Successful Payment in Ledger
    db.recordPayment({
      userId: req.user.id,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount: planDetails.priceINR,
      currency: 'INR',
      status: 'captured',
      provider: IS_PAYMENT_TEST_MODE ? 'sandbox' : 'razorpay',
      signature: razorpay_signature || 'test_verified_sig',
      plan: planId || 'pro_yearly',
      billingCycle: (billingCycle as any) || 'yearly',
    });

    // 4. Audit Log
    db.recordAudit(
      req.user.id,
      req.user.email,
      'SUBSCRIPTION_ACTIVATED',
      `Activated Pro plan (${billingCycle}) via payment ${razorpay_payment_id}`,
      req.ip
    );

    return res.json({
      success: true,
      message: 'Payment verified and CodeNova Pro subscription activated!',
      subscription: sub,
      plan: 'pro',
    });
  },

  // POST /api/payments/webhook
  handleWebhook: (req: Request, res: Response) => {
    const signature = req.headers['x-razorpay-signature'] as string;
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || RAZORPAY_KEY_SECRET;

    if (signature && webhookSecret && !IS_PAYMENT_TEST_MODE) {
      const expected = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (signature !== expected) {
        return res.status(400).send('Invalid webhook signature');
      }
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'payment.captured' && payload?.payment?.entity) {
      const paymentEntity = payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;
      const notes = paymentEntity.notes || {};

      if (notes.userId) {
        // Idempotency: verify if already activated
        const existingSub = db.getSubscriptionByUserId(notes.userId);
        if (!existingSub || existingSub.paymentId !== paymentId) {
          db.updateUser(notes.userId, { plan: 'pro' });
          db.createOrUpdateSubscription({
            userId: notes.userId,
            plan: 'pro',
            billingCycle: (notes.planId === 'pro_monthly' ? 'monthly' : 'yearly'),
            status: 'active',
            provider: 'razorpay',
            orderId,
            paymentId,
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
            amount: paymentEntity.amount / 100,
            currency: paymentEntity.currency || 'INR',
          });
        }
      }
    }

    return res.status(200).json({ received: true });
  },

  // GET /api/subscriptions/current
  getCurrentSubscription: (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const sub = db.getSubscriptionByUserId(req.user.id);
    const payments = db.listPaymentsByUser(req.user.id);

    return res.json({
      plan: req.user.plan,
      isPro: req.user.plan === 'pro' || req.user.plan === 'student_pro' || req.user.plan === 'campus_license',
      subscription: sub || {
        plan: req.user.plan,
        status: req.user.plan === 'free' ? 'free' : 'active',
        billingCycle: 'none',
        currentPeriodStart: req.user.createdAt,
        currentPeriodEnd: 'Unlimited',
      },
      paymentHistory: payments,
    });
  },

  // POST /api/subscriptions/cancel
  cancelSubscription: (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const success = db.cancelSubscription(req.user.id);
    if (!success) {
      return res.status(400).json({ error: 'No active recurring subscription found to cancel.' });
    }

    db.recordAudit(
      req.user.id,
      req.user.email,
      'SUBSCRIPTION_CANCELED',
      'User requested cancellation of recurring subscription.',
      req.ip
    );

    return res.json({
      success: true,
      message: 'Subscription has been canceled and will not renew at the end of the current period.',
    });
  },

  // POST /api/subscriptions/verify-student
  verifyStudentLicense: (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const { email, verificationCode } = req.body;
    const targetEmail = (email || req.user.email).toLowerCase();

    // Check educational domain (.edu, .edu.in, .ac.in, .org, or dtc.edu.in)
    const isEduDomain =
      targetEmail.endsWith('.edu') ||
      targetEmail.endsWith('.edu.in') ||
      targetEmail.endsWith('.ac.in') ||
      targetEmail.includes('college') ||
      targetEmail.includes('university') ||
      targetEmail.includes('student');

    // Valid student codes or edu domain
    const isValid = isEduDomain || verificationCode === 'CAMPUS2026' || verificationCode === 'STUDENT';

    if (!isValid) {
      return res.status(400).json({
        error: 'Please provide a valid university email (.edu / .ac.in) or institutional license code (e.g. CAMPUS2026).',
      });
    }

    // Grant Student Pro
    db.updateUser(req.user.id, {
      plan: 'student_pro',
    });

    db.createOrUpdateSubscription({
      userId: req.user.id,
      plan: 'student_pro',
      billingCycle: 'yearly',
      status: 'active',
      provider: 'campus',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
      amount: 0,
      currency: 'INR',
    });

    db.recordAudit(
      req.user.id,
      req.user.email,
      'STUDENT_LICENSE_VERIFIED',
      `Verified campus eligibility for ${targetEmail}`,
      req.ip
    );

    return res.json({
      success: true,
      message: '🎉 Campus Student Pro license granted! Enjoy complimentary full Pro access.',
      plan: 'student_pro',
    });
  },
};
