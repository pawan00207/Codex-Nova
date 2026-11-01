import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Play, Sparkles, Terminal, Cpu, Shield, Globe, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface ThreeHeroProps {
  onLaunchIDE: () => void;
  onOpenArchitecture: () => void;
}

export const ThreeHero: React.FC<ThreeHeroProps> = ({ onLaunchIDE, onOpenArchitecture }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hudCollapsed, setHudCollapsed] = useState(false);
  const [activeSpeed, setActiveSpeed] = useState<number>(1);
  const [activeMode, setActiveMode] = useState<'compiler' | 'quantum'>('compiler');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software-WebGL Detection
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // 2. Scene & Camera Setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 580;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 6.2);
    camera.lookAt(0, -0.2, 0);

    // 3. Renderer with PBR Configuration
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 4. Studio Environment via RoomEnvironment
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch (e) {
      console.warn('RoomEnvironment fallback', e);
    }

    // 5. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.5);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x020617, 1.2);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 3.5);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xa855f7, 4.0, 12);
    rimLight.position.set(-3, 2, -3);
    scene.add(rimLight);

    // 6. Ground Shadow Contact Plane
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x020617,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.65;
    scene.add(shadowPlane);

    // 7. Composite Procedural 3D Compiler Core (7 distinct parts)
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, -0.25, 0);
    scene.add(coreGroup);

    // Part 1: Outer Hexagonal Casing (Brushed dark metal)
    const casingGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.35, 6);
    const casingMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.85,
      roughness: 0.2,
      wireframe: false,
    });
    const casingMesh = new THREE.Mesh(casingGeo, casingMat);
    coreGroup.add(casingMesh);

    // Part 2: Inner Quantum Crystal Core (Icosahedron)
    const crystalGeo = new THREE.IcosahedronGeometry(0.65, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
      metalness: 0.1,
      roughness: 0.1,
      transmission: isSoftwareGl ? 0 : 0.85,
      transparent: true,
      opacity: 0.9,
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    coreGroup.add(crystalMesh);

    // Part 3: Inner Orbital Ring (Torus)
    const ring1Geo = new THREE.TorusGeometry(1.5, 0.03, 16, 64);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0x0284c7,
      emissiveIntensity: 0.3,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    // Part 4: Outer Orthogonal Ring (Torus)
    const ring2Geo = new THREE.TorusGeometry(1.8, 0.025, 16, 64);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.25,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    coreGroup.add(ring2);

    // Part 5: Emitter Nodes (4 satellite spheres on the ring)
    const nodeGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.8,
      metalness: 0.5,
      roughness: 0.1,
    });
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5 * 0.5, Math.sin(angle) * 0.8);
      coreGroup.add(node);
    }

    // Part 6: Floating Code Particles / Bits
    const particleCount = isSoftwareGl ? 120 : 350;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0x38bdf8); // Cyan
    const c2 = new THREE.Color(0x818cf8); // Indigo
    const c3 = new THREE.Color(0x34d399); // Emerald

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.0 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.8;

      positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(phi) + 0.2;
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const chosenColor = i % 3 === 0 ? c1 : i % 3 === 1 ? c2 : c3;
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 8. Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.4;
      targetY = y * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 580;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 10. Frame Loop with Software WebGL Guard (afterDraw)
    let frameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime() * activeSpeed;

      // Smooth mouse interpolation
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      coreGroup.rotation.y = elapsed * 0.3 + mouseX;
      coreGroup.rotation.x = Math.sin(elapsed * 0.2) * 0.15 + mouseY;
      crystalMesh.rotation.y = -elapsed * 0.6;
      crystalMesh.rotation.z = Math.sin(elapsed * 0.4) * 0.2;

      ring1.rotation.z = elapsed * 0.4;
      ring2.rotation.x = -elapsed * 0.3;

      particles.rotation.y = elapsed * 0.08;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      renderer.dispose();
      casingGeo.dispose();
      casingMat.dispose();
      crystalGeo.dispose();
      crystalMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeSpeed, activeMode]);

  return (
    <div className="relative w-full min-h-[640px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden flex items-center justify-center select-none py-8 px-4 sm:px-8">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Column: Editorial Value Proposition & Actions */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-cyan-400">
            <Terminal className="w-3.5 h-3.5" />
            <span>PHASE 1 MVP ARCHITECTURE · KERNEL ISOLATION</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-['Space_Grotesk'] leading-[1.1]">
            Next-Gen Online Compiler & <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">AI Learning IDE</span>
          </h1>

          <p className="text-base text-slate-300 max-w-xl font-normal leading-relaxed">
            Zero cold-start execution for 10+ languages with gVisor sandboxing, native Monaco editing, real-time stdin, and intelligent error fixing powered by Google Gemini (strictly NO GPT).
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onLaunchIDE}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold rounded-lg shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Launch Compiler</span>
            </button>

            <button
              onClick={onOpenArchitecture}
              className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium rounded-lg transition-all hover:border-slate-700 cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Inspect Architecture</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Feature Badges - Zero Pills Rule */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Kernel Sandboxing</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5 text-cyan-400" /> Interactive Stdin/Stdout</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Hinglish Concepts</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-blue-400" /> Offline/Export Ready</span>
          </div>
        </div>

        {/* Right Column: 100% Unobstructed 3D Scene Viewport with Collapsible Dock */}
        <div className="lg:col-span-6 relative h-[480px] sm:h-[540px] rounded-2xl bg-slate-950/60 border border-slate-800/60 overflow-hidden flex flex-col justify-between">
          {/* Dedicated 3D Canvas Container */}
          <div ref={mountRef} className="absolute inset-0 w-full h-full" />

          {/* Minimal Title Badge in 3D Viewport */}
          <div className="relative z-10 p-3 pointer-events-none flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="text-cyan-400/90 font-medium">3D COMPILER CORE · HARDWARE ACCELERATED</span>
            <span>THREE.JS R160+ PBR</span>
          </div>

          {/* Ergonomic Collapsible Bottom Control Dock */}
          <div className={`relative z-20 pb-3 px-3 transition-all duration-300 ${hudCollapsed ? 'translate-y-8 opacity-80' : 'translate-y-0'}`}>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center justify-between gap-3 shadow-2xl backdrop-blur-md max-w-md mx-auto">
              <button
                onClick={() => setHudCollapsed(!hudCollapsed)}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title="Toggle HUD"
              >
                {hudCollapsed ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>{hudCollapsed ? 'Show HUD' : 'Collapse'}</span>
              </button>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span>Speed:</span>
                {[0.5, 1, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setActiveSpeed(speed)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                      activeSpeed === speed ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'hover:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <button
                  onClick={() => setActiveMode('compiler')}
                  className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-semibold cursor-pointer"
                >
                  Core Matrix
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
