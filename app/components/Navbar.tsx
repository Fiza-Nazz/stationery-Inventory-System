'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Bell, User, LogOut, Settings, Sun, Moon, Sparkles } from 'lucide-react';

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notificationCount] = useState(3);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  // Ultra-Enhanced 3D Canvas Animation: Fixed negative radius by clamping sizes to positive values
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      colorIndex: number;
      trail: Array<{ x: number; y: number; z: number; life: number }>;
      clusterId?: number;
    }> = [];

    // Extreme vibrant theme colors with dynamic shifts
    const themeColors = [
      { h: 0, s: 100, l: 55 },      // Fiery Red
      { h: 50, s: 100, l: 65 },     // Radiant Gold
      { h: 120, s: 100, l: 45 }     // Lush Emerald
    ];

    // Generate clustered particles for unique organic flow
    for (let cluster = 0; cluster < 6; cluster++) {
      const cx = Math.random() * canvas.width;
      const cy = Math.random() * canvas.height;
      for (let i = 0; i < 20; i++) { // 120 total particles, clustered
        particles.push({
          x: cx + (Math.random() - 0.5) * 100,
          y: cy + (Math.random() - 0.5) * 100,
          z: Math.random() * 3000,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          vz: Math.random() * 4 + 2,
          colorIndex: Math.floor(Math.random() * 3),
          trail: [],
          clusterId: cluster
        });
      }
    }

    let frameCount = 0; // For time-based effects

    // Define animate as a regular function inside useEffect (no hook violation)
    const animate = () => {
      // Dynamic background with subtle gradient overlay
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, isDark ? 'rgba(15, 5, 5, 0.2)' : 'rgba(255, 245, 230, 0.1)');
      gradient.addColorStop(1, isDark ? 'rgba(10, 0, 0, 0.2)' : 'rgba(255, 200, 150, 0.05)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        // Enhanced trail with exponential decay
        p.trail.push({ x: p.x, y: p.y, z: p.z, life: 1 });
        if (p.trail.length > 15) p.trail.shift();
        p.trail = p.trail.filter(t => (t.life -= 0.08) > 0);

        // Mouse magnetic attraction for interactivity
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 0) {
          const force = (200 - dist) / 200 * 0.5;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Cluster cohesion for unique grouping effect
        if (p.clusterId !== undefined) {
          const clusterAvg = { x: 0, y: 0, count: 0 };
          particles.forEach(p2 => {
            if (p2.clusterId === p.clusterId && p2 !== p) {
              clusterAvg.x += p2.x;
              clusterAvg.y += p2.y;
              clusterAvg.count++;
            }
          });
          if (clusterAvg.count > 0) {
            const avgX = clusterAvg.x / clusterAvg.count;
            const avgY = clusterAvg.y / clusterAvg.count;
            p.vx += (avgX - p.x) * 0.01;
            p.vy += (avgY - p.y) * 0.01;
          }
        }

        p.x += p.vx;
        p.y += p.vy;
        p.z -= p.vz;

        // Spiral reset with time-based chaos
        if (p.z < 1) {
          const time = Date.now() * 0.001;
          p.z = 3000;
          p.x = canvas.width / 2 + Math.cos(time + i * 0.1) * 300;
          p.y = canvas.height / 2 + Math.sin(time + i * 0.1) * 300;
          p.vx *= 0.9; // Damping for smoothness
          p.vy *= 0.9;
        }

        const scale = 3000 / (3000 + p.z);
        const x2d = (p.x - canvas.width / 2) * scale + canvas.width / 2;
        const y2d = (p.y - canvas.height / 2) * scale + canvas.height / 2;
        // Clamp size to positive minimum to prevent negative radius error
        const size = Math.max(0.5, scale * 5 + Math.sin(Date.now() * 0.005 + i) * 3);

        // Draw trails with glow and color shift
        p.trail.forEach((t, ti) => {
          const trailScale = 3000 / (3000 + t.z);
          const tx2d = (t.x - canvas.width / 2) * trailScale + canvas.width / 2;
          const ty2d = (t.y - canvas.height / 2) * trailScale + canvas.height / 2;
          // Clamp trailSize to positive
          const trailSize = Math.max(0.1, trailScale * 3 * t.life);
          const color = themeColors[p.colorIndex];
          const hueShift = t.life * 20; // Subtle color shift in trail
          ctx.shadowColor = `hsla(${(color.h + hueShift) % 360}, ${color.s}%, ${color.l}%, ${trailScale * t.life})`;
          ctx.shadowBlur = trailSize * 8;
          ctx.fillStyle = `hsla(${(color.h + hueShift) % 360}, ${color.s}%, ${color.l}%, ${trailScale * t.life * 0.6})`;
          ctx.beginPath();
          ctx.arc(tx2d, ty2d, trailSize, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // Main particle with advanced glow and rotation simulation
        const color = themeColors[p.colorIndex];
        ctx.shadowColor = `hsla(${color.h}, ${color.s}%, ${color.l}%, 1)`;
        ctx.shadowBlur = size * 15;
        ctx.fillStyle = `hsla(${color.h}, ${color.s}%, ${color.l}%, ${scale})`;
        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        ctx.fill();

        // Inner sparkle for extreme polish - clamp sparkle size too
        if (Math.random() > 0.7) {
          const sparkleSize = Math.max(0.1, size * 0.3);
          ctx.fillStyle = 'hsla(0, 0%, 100%, 0.8)';
          ctx.beginPath();
          ctx.arc(x2d + Math.cos(Date.now() * 0.01 + i) * size / 2, y2d + Math.sin(Date.now() * 0.01 + i) * size / 2, sparkleSize, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;

        // Advanced connections: Proximity-based with thickness and color blending
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const scale2 = 3000 / (3000 + p2.z);
          const x2d2 = (p2.x - canvas.width / 2) * scale2 + canvas.width / 2;
          const y2d2 = (p2.y - canvas.height / 2) * scale2 + canvas.height / 2;
          const dx = x2d - x2d2;
          const dy = y2d - y2d2;
          const dist = Math.sqrt(dx * dx + dy * dy) * (1 + (p.z + p2.z) / 6000);

          if (dist < 150 && Math.random() > 0.3) { // Probabilistic for performance
            const opacity = (1 - dist / 150) * 0.5 * scale * scale2;
            const avgHue = (color.h + themeColors[p2.colorIndex].h) / 2;
            const avgSat = (color.s + themeColors[p2.colorIndex].s) / 2;
            ctx.shadowColor = `hsla(${avgHue}, ${avgSat}%, 60%, ${opacity})`;
            ctx.shadowBlur = 5;
            ctx.strokeStyle = `hsla(${avgHue}, ${avgSat}%, 60%, ${opacity})`;
            ctx.lineWidth = 1.5 + opacity * 3;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(x2d, y2d);
            ctx.lineTo(x2d2, y2d2);
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }
      });

      frameCount++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDark]); // Dependency array fixed

  // Unique layout: Asymmetric navbar with floating elements and extreme micro-interactions
  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-stone-950 via-stone-900 to-black' 
        : 'bg-gradient-to-br from-amber-50 via-red-20 to-green-50'
    } transition-all duration-1000 ease-out`}>
      {/* Ultra-Enhanced 3D Background with mouse interaction */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
      />

      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -z-5" />

      {/* Extreme Professional Navbar: Slim, Asymmetric, Floating Design */}
      <nav className={`fixed top-2 left-4 right-4 z-50 rounded-3xl ${
        isDark 
          ? 'bg-stone-950/98 border-stone-700/30' 
          : 'bg-white/98 border-amber-100/30'
      } backdrop-blur-3xl border transition-all duration-1000 ease-out shadow-2xl hover:shadow-3xl group`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-12 lg:h-14 py-1"> {/* Ultra-slim height */}
            {/* Asymmetric Left: Logo with advanced hover ecosystem */}
            <div className="flex items-center space-x-3 group/logo cursor-pointer relative overflow-hidden">
              <div className="relative">
                {/* Dynamic aura with particle-like sparks */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/70 via-amber-500/70 to-green-600/70 rounded-2xl blur-3xl opacity-40 group-hover/logo:opacity-80 transition-all duration-1000 animate-pulse-slow"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 via-amber-500/30 to-green-600/30 rounded-2xl blur-xl opacity-0 group-hover/logo:opacity-100 transition-all duration-700"></div>
                <div className="relative w-9 h-9 lg:w-11 lg:h-11 rounded-2xl overflow-hidden shadow-2xl transform group-hover/logo:scale-110 group-hover/logo:rotate-3 transition-all duration-700 ring-2 ring-amber-400/20 group-hover/logo:ring-amber-400/50">
                  <img 
                    src="/logo.png" 
                    alt="Dukaan Logo" 
                    className="w-full h-full object-cover filter brightness-120 saturate-150 transition-transform duration-700 group-hover/logo:scale-110"
                  />
                  {/* Inner sparkle icon for premium feel */}
                  <Sparkles className="absolute top-1 right-1 w-3 h-3 text-amber-300 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500 animate-ping-slow" />
                </div>
              </div>
              <div className="hidden lg:block">
                <h1 className={`text-lg lg:text-xl font-black bg-gradient-to-r from-red-800 via-amber-600 to-green-800 bg-clip-text text-transparent tracking-wider letter-spacing-[-0.025em]`}>
                  دکان
                </h1>
                <p className={`text-[10px] lg:text-xs ${isDark ? 'text-amber-400' : 'text-red-700'} font-semibold tracking-widest uppercase opacity-80`}>
                  حبیب
                </p>
              </div>
            </div>

            {/* Asymmetric Right: Ultra-minimal actions with orbital hovers */}
            <div className="flex items-center space-x-1.5 lg:space-x-2 relative">
              {/* Theme Switcher: Orbital animation on hover */}
              <button
                onClick={() => setIsDark(!isDark)}
                className={`relative w-9 h-4.5 lg:w-10 lg:h-5 rounded-full transition-all duration-1000 ease-out/cubic-bezier(0.25, 0.46, 0.45, 0.94) ${
                  isDark ? 'bg-gradient-to-r from-amber-600/90 to-orange-700/90' : 'bg-gradient-to-r from-red-600/90 to-rose-700/90'
                } shadow-lg hover:shadow-xl transform hover:scale-105 ring-1.5 ${isDark ? 'ring-amber-500/30' : 'ring-red-500/30'} group/toggle`}
                aria-label="Toggle theme"
              >
                <div className={`absolute top-0.5 lg:top-0.5 ${isDark ? 'right-0.5 lg:right-0.5' : 'left-0.5 lg:left-0.5'} w-3.5 h-3.5 lg:w-4 lg:h-4 bg-gradient-to-br from-white/90 to-gray-100 rounded-full shadow-md transition-all duration-1000 ease-out flex items-center justify-center transform group-hover/toggle:rotate-180 ${
                  isDark ? 'translate-x-4.5 lg:translate-x-5' : ''
                }`}>
                  {isDark ? <Moon className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-amber-700" /> : <Sun className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-red-700" />}
                </div>
                {/* Orbital ring effect */}
                <div className="absolute inset-0 rounded-full border border-amber-400/20 opacity-0 group-hover/toggle:opacity-100 transition-opacity duration-500 animate-spin-slow"></div>
              </button>

              {/* Notifications: With subtle expansion on hover */}
              <button
                className={`relative p-1.5 lg:p-2 rounded-xl ${
                  isDark ? 'bg-stone-900/60 hover:bg-stone-800/80' : 'bg-amber-50/80 hover:bg-amber-100/90'
                } transition-all duration-700 ease-out hover:scale-110 shadow-lg group/notif backdrop-blur-xl`}
                aria-label="Notifications"
              >
                <Bell className={`w-3.5 h-3.5 lg:w-4 lg:h-4 ${isDark ? 'text-amber-400' : 'text-red-700'} transition-all duration-500 group-hover/notif:rotate-12 group-hover/notif:scale-110`} />
                {notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 lg:w-4 lg:h-4 bg-gradient-to-r from-red-600 to-rose-700 text-white text-[8px] lg:text-[10px] rounded-full flex items-center justify-center font-black animate-bounce-slow shadow-lg ring-1 ring-white/90 group-hover/notif:scale-125 transition-transform duration-300">
                    {notificationCount}
                  </span>
                )}
                {/* Hover expansion */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-600/20 to-rose-700/20 opacity-0 group-hover/notif:opacity-100 transition-opacity duration-500 blur-sm"></div>
              </button>

              {/* Profile: Extreme dropdown with glassmorphism */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center space-x-1 p-1.5 lg:p-2 rounded-xl ${
                    isDark ? 'bg-stone-900/60 hover:bg-stone-800/80' : 'bg-amber-50/80 hover:bg-amber-100/90'
                  } transition-all duration-700 ease-out hover:scale-110 shadow-lg backdrop-blur-xl group/profile`}
                  aria-label="User profile"
                >
                  <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-xl bg-gradient-to-br from-red-600 via-amber-600 to-green-700 flex items-center justify-center shadow-xl ring-1 ring-amber-400/20 group-hover/profile:ring-amber-400/50 transition-all duration-500">
                    <User className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white group-hover/profile:rotate-12 transition-transform duration-500" />
                  </div>
                </button>

                {isProfileOpen && (
                  <div className={`absolute right-0 mt-2 lg:mt-3 w-48 lg:w-56 rounded-2xl shadow-2xl border ${
                    isDark ? 'bg-stone-900/98 border-stone-700/30' : 'bg-white/98 border-amber-100/30'
                  } overflow-hidden animate-in slide-in-from-top-2 duration-700 backdrop-blur-3xl group/dropdown`}>
                    <div className={`p-3 lg:p-4 border-b ${isDark ? 'border-stone-700/30 bg-gradient-to-r from-red-900/15 to-amber-900/15' : 'border-amber-100/30 bg-gradient-to-r from-red-50/60 to-amber-50/60'}`}>
                      <p className={`font-black text-sm lg:text-base ${isDark ? 'text-amber-300' : 'text-red-800'} tracking-wide`}>Admin User</p>
                      <p className={`text-[10px] lg:text-xs ${isDark ? 'text-amber-500' : 'text-stone-600'} font-mono`}>admin@dukaan.com</p>
                    </div>
                    <div className="p-1 lg:p-2">
                      <button className={`w-full flex items-center space-x-2.5 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl ${
                        isDark ? 'hover:bg-stone-800/70 text-amber-300' : 'hover:bg-amber-50/80 text-stone-700'
                      } transition-all duration-400 font-semibold text-xs lg:text-sm backdrop-blur-xl group/item`}>
                        <Settings className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0 group-hover/item:rotate-90 transition-transform duration-400" />
                        <span>Settings</span>
                        <div className="ml-auto w-1 h-1 bg-amber-400 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-400"></div>
                      </button>
                      <button className={`w-full flex items-center space-x-2.5 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl mt-1 ${
                        isDark ? 'hover:bg-red-900/40 text-red-400' : 'hover:bg-red-50/80 text-red-700'
                      } transition-all duration-400 font-semibold text-xs lg:text-sm backdrop-blur-xl`}>
                        <LogOut className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
                        <span>Logout</span>
                      </button>
                    </div>
                    {/* Dropdown tail for uniqueness */}
                    <div className={`absolute top-0 -right-3 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-stone-900/98 border-t-[12px] border-t-transparent ${isDark ? '' : 'border-r-white/98'}`} />
                  </div>
                )}
              </div>

              {/* Mobile Menu: Collapsible with slide */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-1.5 rounded-xl ${
                  isDark ? 'bg-stone-900/60 hover:bg-stone-800/80' : 'bg-amber-50/80 hover:bg-amber-100/90'
                } transition-all duration-700 ease-out hover:scale-110 shadow-lg backdrop-blur-xl`}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className={`w-4 h-4 ${isDark ? 'text-amber-300' : 'text-red-700'}`} />
                ) : (
                  <Menu className={`w-4 h-4 ${isDark ? 'text-amber-300' : 'text-red-700'}`} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu: Extreme slide-in with glass */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-700 backdrop-blur-3xl">
              <div className={`py-3 space-y-1 ${isDark ? 'bg-stone-900/80' : 'bg-white/90'} border ${isDark ? 'border-stone-700/30' : 'border-amber-100/30'}`}>
                {/* Placeholder for future mobile nav items, keeping slim */}
                <p className={`px-4 text-xs ${isDark ? 'text-amber-400' : 'text-red-700'} font-medium`}>Menu Coming Soon</p>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Floating accent for unique layout */}
      <div className="fixed bottom-4 right-4 w-20 h-20 bg-gradient-to-br from-red-600/10 via-amber-500/10 to-green-600/10 rounded-full blur-xl opacity-50 animate-pulse-slow -z-5" />
    </div>
  );
};

export default Navbar;