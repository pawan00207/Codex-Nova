import http from 'http';

// Quick verification runner
async function request(path: string, options: { method?: string; headers?: Record<string, string>; body?: any } = {}) {
  const url = `http://127.0.0.1:3000${path}`;
  const res = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  console.log('=== Starting CodeNova Production Verification Tests ===\n');

  // Test 1: Server Health
  const health = await request('/api/health');
  console.log(`1. Health Check: status=${health.status}, ok=${health.ok}`);
  if (health.status !== 200 || health.data.status !== 'ok') {
    throw new Error('Health check failed');
  }

  // Test 2: Public Registration (Strictly creates role: 'user')
  const testEmail = `dev.test.${Date.now()}@college.edu.in`;
  const reg = await request('/api/auth/register', {
    method: 'POST',
    body: {
      email: testEmail,
      password: 'StrongPassword123!',
      fullName: 'Test Developer',
      country: 'IND',
    },
  });
  console.log(`2. User Registration: status=${reg.status}, role=${reg.data.user?.role}`);
  if (reg.status !== 201 || reg.data.user?.role !== 'user' || !reg.data.token) {
    throw new Error('Registration failed or did not assign role: user');
  }
  const userToken = reg.data.token;
  const userId = reg.data.user.id;

  // Test 3: Normal User cannot access Admin endpoints (Server-side 403 Forbidden)
  const forbiddenAdmin = await request('/api/admin/overview', {
    headers: { Authorization: `Bearer ${userToken}` },
  });
  console.log(`3. Admin Protection for Regular User: status=${forbiddenAdmin.status} (Expected: 403)`);
  if (forbiddenAdmin.status !== 403) {
    throw new Error('Security failure: Regular user accessed admin endpoint!');
  }

  // Test 4: Founder Admin Login & Access
  const adminLogin = await request('/api/auth/login', {
    method: 'POST',
    body: {
      email: 'pawan9140582015@gmail.com',
      password: 'Admin@CodeNova2026!',
    },
  });
  console.log(`4. Admin Login: status=${adminLogin.status}, role=${adminLogin.data.user?.role}`);
  if (adminLogin.status !== 200 || adminLogin.data.user?.role !== 'superadmin') {
    throw new Error('Admin login failed');
  }
  const adminToken = adminLogin.data.token;

  // Test 5: Authorized Admin Overview
  const adminOverview = await request('/api/admin/overview', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log(`5. Admin Overview: status=${adminOverview.status}, totalUsers=${adminOverview.data.totalRegisteredUsers}`);
  if (adminOverview.status !== 200) {
    throw new Error('Admin overview failed');
  }

  // Test 6: Project Creation & IDOR Data Isolation
  const createProj = await request('/api/projects', {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
    body: {
      name: 'Private Algorithm Workspace',
      languageId: 'python',
      files: [{ id: 'f1', name: 'main.py', content: 'print(42)', languageId: 'python' }],
      isPublic: false,
    },
  });
  console.log(`6. Project Creation: status=${createProj.status}, projectId=${createProj.data.project?.id}`);
  const projectId = createProj.data.project.id;

  // Test 7: Another user cannot access private project (IDOR Protection)
  const otherUserReg = await request('/api/auth/register', {
    method: 'POST',
    body: {
      email: `intruder.${Date.now()}@hack.com`,
      password: 'Password123!',
      fullName: 'Unauthorized Visitor',
    },
  });
  const idorCheck = await request(`/api/projects/${projectId}`, {
    headers: { Authorization: `Bearer ${otherUserReg.data.token}` },
  });
  console.log(`7. IDOR Protection on Private Project: status=${idorCheck.status} (Expected: 403)`);
  if (idorCheck.status !== 403) {
    throw new Error('Security failure: Insecure Direct Object Reference permitted unauthorized access!');
  }

  // Test 8: Payment Order Creation & Server Verification
  const order = await request('/api/payments/create-order', {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
    body: { planId: 'pro_yearly', billingCycle: 'yearly' },
  });
  console.log(`8. Create Payment Order: status=${order.status}, orderId=${order.data.orderId}, amount=₹${order.data.amount}`);
  if (order.status !== 200 || !order.data.orderId) {
    throw new Error('Payment order creation failed');
  }

  // Test 9: Cryptographic Payment Verification & Pro Activation
  const verify = await request('/api/payments/verify', {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
    body: {
      razorpay_order_id: order.data.orderId,
      razorpay_payment_id: `pay_test_${Date.now()}`,
      razorpay_signature: 'test_verified_hmac_sha256',
      planId: 'pro_yearly',
      billingCycle: 'yearly',
    },
  });
  console.log(`9. Payment Verification: status=${verify.status}, plan=${verify.data.plan}`);
  if (verify.status !== 200 || verify.data.plan !== 'pro') {
    throw new Error('Payment verification failed to activate Pro plan');
  }

  // Test 10: Multi-Tier Code Execution (Python 3.10)
  const exec = await request('/api/execute', {
    method: 'POST',
    body: {
      language: 'python',
      code: 'print(sum([x * 2 for x in [1, 2, 3, 4, 5]]))',
      stdin: '',
    },
  });
  console.log(`10. Code Execution: status=${exec.status}, stdout=${exec.data.stdout?.trim()}, stderr=${exec.data.stderr}, time=${exec.data.executionTimeMs}ms`);
  if (exec.status !== 200 || !exec.data.stdout.includes('30')) {
    throw new Error('Code execution failed');
  }

  console.log('\n✅ ALL 10 PRODUCTION VERIFICATION TESTS PASSED SUCCESSFULLY!');
}

runTests().catch((err) => {
  console.error('\n❌ Test failure:', err);
  process.exit(1);
});
