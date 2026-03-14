import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// --- Dynamic Background Component (World Model Theme) ---
const WorldModelBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      z: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.z = Math.random() * 2 + 0.5;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 153, ${0.3 / this.z})`;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((window.innerWidth * window.innerHeight) / 15000);
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    };

    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            const opacity = 1 - distance / 150;
            ctx!.strokeStyle = `rgba(0, 229, 153, ${opacity * 0.15})`;
            ctx!.lineWidth = 1;
            ctx!.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width
      );
      gradient.addColorStop(0, '#0a1118');
      gradient.addColorStop(1, '#03060a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });
      drawLines();
      
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: '#03060a' }}
    />
  );
};

// --- Custom Star Icon (Page 1) ---
const SparkleStars = () => (
  <div className="absolute -top-12 right-0 md:-top-16 md:-right-8 transform translate-x-1/2 -translate-y-1/2">
    <motion.svg 
      width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
      animate={{ 
        rotate: [0, 5, -5, 0],
        scale: [1, 1.1, 0.9, 1]
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <path d="M26 0C26 14.3594 37.6406 26 52 26C37.6406 26 26 37.6406 26 52C26 37.6406 14.3594 26 0 26C14.3594 26 26 14.3594 26 0Z" fill="white"/>
      <path d="M48 32C48 38.6274 53.3726 44 60 44C53.3726 44 48 49.3726 48 56C48 49.3726 42.6274 44 36 44C42.6274 44 48 38.6274 48 32Z" fill="white"/>
    </motion.svg>
  </div>
);

// --- Page 1 Component ---
const Page1 = ({ onNext }: { onNext: () => void }) => {
  return (
    <motion.div 
      key="page1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="relative z-10 w-full h-full flex flex-col"
    >
      <div className="flex-1 flex flex-col justify-center px-8 md:px-24 lg:px-40">
        <div className="relative inline-block max-w-max">
          <SparkleStars />
          
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-[5rem] md:text-[7rem] lg:text-[9rem] font-black leading-none tracking-tight text-[#00E599] mb-4 drop-shadow-[0_0_30px_rgba(0,229,153,0.3)]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            世界模型
          </motion.h1>
          
          <motion.h2 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-[3rem] md:text-[4.5rem] lg:text-[6rem] font-bold leading-none tracking-tight text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            AI的下一个十年
          </motion.h2>
        </div>
      </div>

      <div className="absolute bottom-12 right-8 md:bottom-24 md:right-24">
        <motion.button
          onClick={onNext}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="group relative overflow-hidden rounded-full bg-white/5 backdrop-blur-md border border-white/10 px-8 py-4 md:px-12 md:py-6 cursor-pointer shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <span className="relative z-10 text-xl md:text-3xl font-medium tracking-widest text-white/90">
            从“看见”到“理解”
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

// --- Fallback Image Component ---
const FallbackImage = ({ src, alt, className }: { src: string, alt: string, className: string }) => {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div className={`flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm ${className}`}>
        <span className="text-[10px] text-white/40 text-center px-2 leading-tight">请上传<br/>{src}</span>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
};

// --- Particle Text Assembly Component (Page 2) ---
const ParticleTextAssembly = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: TextParticle[] = [];
    let frameCount = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    class TextParticle {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      color: string;
      size: number;
      alpha: number;
      delay: number;
      floatSpeed: number;
      floatOffset: number;

      constructor(targetX: number, targetY: number, color: string) {
        this.targetX = targetX;
        this.targetY = targetY;
        this.color = color;
        
        // Start slightly scattered around the center target (not full screen)
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 80; // Slightly larger scatter for larger text
        this.x = targetX + Math.cos(angle) * distance;
        this.y = targetY + Math.sin(angle) * distance;
        
        this.size = Math.random() * 1.5 + 1.2; // Slightly larger particles for better visibility
        this.alpha = 0;
        this.delay = Math.random() * 40; // Random delay up to 40 frames before fading in
        
        // Unique random parameters for subtle floating
        this.floatSpeed = Math.random() * 0.01 + 0.005; // Very slow frequency
        this.floatOffset = Math.random() * Math.PI * 2; // Random phase
      }

      update(assemble: boolean, currentFrame: number) {
        if (currentFrame > this.delay) {
          if (this.alpha < 1) this.alpha += 0.02; // Smooth fade in
        }
        
        if (assemble && currentFrame > this.delay) {
          // Smoothly move to exact target
          this.x += (this.targetX - this.x) * 0.06;
          this.y += (this.targetY - this.y) * 0.06;
        } else if (currentFrame > this.delay) {
          // Subtle, almost imperceptible float before assembly
          this.x += Math.sin(currentFrame * this.floatSpeed + this.floatOffset) * 0.05;
          this.y += Math.cos(currentFrame * this.floatSpeed + this.floatOffset) * 0.05;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.alpha <= 0) return;
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1.0;
      }
    }

    const initTextParticles = () => {
      particles = [];
      const offscreen = document.createElement('canvas');
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
      const octx = offscreen.getContext('2d');
      if (!octx) return;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      
      // Increased font sizes for the particle text
      octx.font = 'bold 130px "Space Grotesk", sans-serif';
      octx.fillStyle = '#00E599';
      octx.fillText('世界模型', centerX, centerY - 80);

      octx.font = 'bold 110px "Space Grotesk", sans-serif';
      const gradient = octx.createLinearGradient(centerX - 250, 0, centerX + 250, 0);
      gradient.addColorStop(0, '#00E599');
      gradient.addColorStop(1, '#A8FF78');
      octx.fillStyle = gradient;
      octx.fillText('World Model', centerX, centerY + 80);

      const imageData = octx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const step = 3; // Even denser particles for clearer text readability
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const index = (y * canvas.width + x) * 4;
          const alpha = data[index + 3];
          if (alpha > 128) {
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const color = `rgb(${r},${g},${b})`;
            particles.push(new TextParticle(x, y, color));
          }
        }
      }
    };

    // Wait a brief moment for fonts to potentially load, then init
    setTimeout(() => {
      initTextParticles();
    }, 300);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;
      
      const assemble = frameCount > 80; // Start assembling after ~1.3 seconds

      particles.forEach(p => {
        p.update(assemble, frameCount);
        p.draw(ctx);
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-20 pointer-events-none"
    />
  );
};

// --- Page 2 Component ---
const Page2 = ({ onPrev, onNext }: { onPrev: () => void, onNext: () => void }) => {
  // Define the icons with local PNG paths
  const icons = [
    { id: 'icon1', delay: 0.2, pos: 'top-[20%] left-[15%]', src: '/icon1.png' },
    { id: 'icon2', delay: 0.4, pos: 'bottom-[25%] left-[10%]', src: '/icon2.png' },
    { id: 'icon3', delay: 0.6, pos: 'bottom-[20%] left-[30%]', src: '/icon3.png' },
    { id: 'icon4', delay: 0.8, pos: 'bottom-[10%] left-[50%] -translate-x-1/2', src: '/icon4.png' },
    { id: 'icon5', delay: 1.0, pos: 'bottom-[25%] right-[25%]', src: '/icon5.png' },
    { id: 'icon6', delay: 1.2, pos: 'bottom-[15%] right-[10%]', src: '/icon6.png' },
    { id: 'icon7', delay: 1.4, pos: 'top-[25%] right-[15%]', src: '/icon7.png' },
  ];

  return (
    <motion.div 
      key="page2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="relative z-10 w-full h-full flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Particle Assembly Canvas - Now permanently displayed */}
      <ParticleTextAssembly />

      {/* Scattered Icons */}
      {icons.map((icon, index) => (
        <motion.div
          key={icon.id}
          className={`absolute z-20 ${icon.pos}`}
          initial={{ y: 100, opacity: 0, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ 
            delay: icon.delay, 
            type: "spring", 
            stiffness: 100, 
            damping: 12 
          }}
        >
          {/* Continuous floating animation after entrance */}
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 4 + (index % 3), 
              ease: "easeInOut",
              delay: icon.delay + 1 
            }}
          >
            <FallbackImage src={icon.src} alt={`Icon ${index + 1}`} className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-2xl" />
          </motion.div>
        </motion.div>
      ))}

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-8 z-40">
        <button
          onClick={onPrev}
          className="text-white/50 hover:text-white transition-colors flex items-center gap-2 text-sm uppercase tracking-widest cursor-pointer"
        >
          ← 上一页
        </button>
      </div>
      <div className="absolute bottom-8 right-8 z-40">
        <button
          onClick={onNext}
          className="text-[#00E599]/70 hover:text-[#00E599] transition-colors flex items-center gap-2 text-sm uppercase tracking-widest cursor-pointer"
        >
          下一页 →
        </button>
      </div>
    </motion.div>
  );
};

// --- Page 3 Component ---
const Page3 = ({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) => {
  return (
    <motion.div 
      key="page3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="relative z-10 w-full h-full overflow-hidden bg-transparent"
    >
      {/* Background Stars (Subtle) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 0.7, 0.2] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center px-8 md:px-24 lg:px-40">
        <div className="relative">
          {/* Sparkle Icon above the text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute -top-16 left-[45%] md:-top-20 md:left-[40%]"
          >
            <svg width="60" height="60" viewBox="0 0 64 64" fill="white">
              <path d="M26 0C26 14.3594 37.6406 26 52 26C37.6406 26 26 37.6406 26 52C26 37.6406 14.3594 26 0 26C14.3594 26 26 14.3594 26 0Z" />
              <path d="M48 32C48 38.6274 53.3726 44 60 44C53.3726 44 48 49.3726 48 56C48 49.3726 42.6274 44 36 44C42.6274 44 48 38.6274 48 32Z" transform="translate(4, 10) scale(0.6)" />
            </svg>
          </motion.div>

          {/* Text Content - Left Aligned as per image */}
          <div className="flex flex-col items-start gap-2">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              className="text-[4.5rem] md:text-[6.5rem] lg:text-[7.5rem] font-black tracking-tight text-[#00E599] leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              多模态的终末路
            </motion.h1>
            
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
              className="text-[3.5rem] md:text-[5rem] lg:text-[6rem] font-bold tracking-tight text-white leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              会彻底重塑AI格局
            </motion.h2>
          </div>
        </div>
      </div>

      {/* Character Images - Positioned at bottom corners */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none flex justify-between items-end">
        {/* Left Person */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.9 }}
          className="w-[30%] md:w-[25%] lg:w-[22%] translate-y-[5%]"
        >
          <FallbackImage 
            src="/person_left.png" 
            alt="Person Left" 
            className="w-full h-auto object-contain" 
          />
        </motion.div>

        {/* Right Person */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="w-[35%] md:w-[30%] lg:w-[28%] translate-y-[5%]"
        >
          <FallbackImage 
            src="/person_right.png" 
            alt="Person Right" 
            className="w-full h-auto object-contain" 
          />
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-8 z-40">
        <button
          onClick={onPrev}
          className="text-white/50 hover:text-white transition-colors flex items-center gap-2 text-sm uppercase tracking-widest cursor-pointer"
        >
          ← 上一页
        </button>
      </div>
      <div className="absolute bottom-8 right-8 z-40">
        <button
          onClick={onNext}
          className="text-[#00E599]/70 hover:text-[#00E599] transition-colors flex items-center gap-2 text-sm uppercase tracking-widest cursor-pointer"
        >
          下一页 →
        </button>
      </div>
    </motion.div>
  );
};

// --- Question Mark Particle Assembly Component (Page 4) ---
const QuestionMarkParticleAssembly = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: QParticle[] = [];
    let frameCount = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    class QParticle {
      x: number;
      y: number;
      baseTargetX: number;
      baseTargetY: number;
      color: string;
      size: number;
      alpha: number;
      delay: number;
      floatSpeed: number;
      floatOffset: number;

      constructor(targetX: number, targetY: number, color: string) {
        this.baseTargetX = targetX;
        this.baseTargetY = targetY;
        this.color = color;
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 150;
        this.x = targetX + Math.cos(angle) * distance;
        this.y = targetY + Math.sin(angle) * distance;
        
        this.size = Math.random() * 2 + 1.5;
        this.alpha = 0;
        this.delay = Math.random() * 50;
        
        this.floatSpeed = Math.random() * 0.02 + 0.01;
        this.floatOffset = Math.random() * Math.PI * 2;
      }

      update(assemble: boolean, currentFrame: number) {
        if (currentFrame > this.delay) {
          if (this.alpha < 1) this.alpha += 0.02;
        }
        
        if (assemble && currentFrame > this.delay) {
          // Floating effect after assembly
          const floatY = Math.sin(currentFrame * 0.03) * 15;
          const targetX = this.baseTargetX;
          const targetY = this.baseTargetY + floatY;

          this.x += (targetX - this.x) * 0.08;
          this.y += (targetY - this.y) * 0.08;
        } else if (currentFrame > this.delay) {
          this.x += Math.sin(currentFrame * this.floatSpeed + this.floatOffset) * 0.1;
          this.y += Math.cos(currentFrame * this.floatSpeed + this.floatOffset) * 0.1;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.alpha <= 0) return;
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1.0;
      }
    }

    const initParticles = () => {
      particles = [];
      const offscreen = document.createElement('canvas');
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
      const octx = offscreen.getContext('2d');
      if (!octx) return;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      octx.font = 'bold 500px "Space Grotesk", sans-serif';
      octx.fillStyle = '#00E599';
      octx.fillText('?', centerX, centerY);

      const imageData = octx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const step = 4;
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const index = (y * canvas.width + x) * 4;
          if (data[index + 3] > 128) {
            particles.push(new QParticle(x, y, '#00E599'));
          }
        }
      }
    };

    setTimeout(initParticles, 300);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;
      const assemble = frameCount > 60;
      particles.forEach(p => {
        p.update(assemble, frameCount);
        p.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('resize', () => {
      resize();
      initParticles();
    });
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none" />;
};

// --- Page 4 Component ---
const Page4 = ({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) => {
  return (
    <motion.div 
      key="page4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="relative z-10 w-full h-full flex flex-col items-center justify-center overflow-hidden bg-transparent"
    >
      <QuestionMarkParticleAssembly />

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-8 z-40">
        <button
          onClick={onPrev}
          className="text-white/50 hover:text-white transition-colors flex items-center gap-2 text-sm uppercase tracking-widest cursor-pointer"
        >
          ← 上一页
        </button>
      </div>
      <div className="absolute bottom-8 right-8 z-40">
        <button
          onClick={onNext}
          className="text-[#00E599]/70 hover:text-[#00E599] transition-colors flex items-center gap-2 text-sm uppercase tracking-widest cursor-pointer"
        >
          下一页 →
        </button>
      </div>
    </motion.div>
  );
};

// --- Tech Border Component ---
const TechBorder = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative group">
      {/* Corner accents */}
      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#00E599] z-20" />
      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#00E599] z-20" />
      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#00E599] z-20" />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#00E599] z-20" />
      
      {/* Scanning line effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <motion.div 
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[1px] bg-[#00E599]/40 shadow-[0_0_8px_#00E599]"
        />
      </div>

      {/* Tech labels around the border */}
      <div className="absolute -top-6 left-0 text-[8px] font-mono text-[#00E599]/60 uppercase tracking-tighter">
        Data_Stream_v2.0 // {Math.random().toString(16).slice(2, 8)}
      </div>
      <div className="absolute -bottom-6 right-0 text-[8px] font-mono text-[#00E599]/60 uppercase tracking-tighter">
        SECURE_LINK_ESTABLISHED
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-[#00E599]/0 group-hover:bg-[#00E599]/5 transition-colors duration-500 z-0" />

      <div className="relative overflow-hidden border border-[#00E599]/20 bg-black/40 backdrop-blur-sm p-1">
        {children}
      </div>
    </div>
  );
};

// --- Page 5 Component ---
const Page5 = ({ onPrev }: { onPrev: () => void }) => {
  const images = [
    {
      src: "/page5_1.png",
      alt: "Tech Asset 1"
    },
    {
      src: "/page5_2.png",
      alt: "Tech Asset 2"
    },
    {
      src: "/page5_3.png",
      alt: "Tech Asset 3"
    }
  ];

  return (
    <motion.div 
      key="page5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="relative z-10 w-full h-full flex flex-col items-center justify-center overflow-hidden bg-[#13091a]"
    >
      <div className="w-full px-12 flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-[1800px]">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1, 
                delay: idx * 0.3,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="flex flex-col items-center"
            >
              <div className="relative aspect-square w-full overflow-hidden shadow-2xl">
                <FallbackImage 
                  src={img.src} 
                  alt={img.alt} 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              {/* Reflection */}
              <div className="mt-0.5 w-full opacity-50 pointer-events-none select-none" style={{ transform: 'scaleY(-1)' }}>
                <div className="relative aspect-square w-full overflow-hidden mask-reflection">
                  <FallbackImage 
                    src={img.src} 
                    alt={img.alt} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App Component ---
export default function App() {
  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = () => setCurrentPage(prev => prev + 1);
  const handlePrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));

  return (
    <div className="min-h-screen bg-[#03060a] text-white overflow-hidden font-sans selection:bg-[#00E599] selection:text-black">
      <WorldModelBackground />
      
      {/* Global Tech Grid Overlay */}
      <div className="fixed inset-0 z-1 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(#00E599 1px, transparent 1px), linear-gradient(90deg, #00E599 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      
      <main className="relative w-full h-screen">
        <AnimatePresence mode="wait">
          {currentPage === 1 && (
            <Page1 onNext={handleNextPage} />
          )}
          {currentPage === 2 && (
            <Page2 onPrev={handlePrevPage} onNext={handleNextPage} />
          )}
          {currentPage === 3 && (
            <Page3 onPrev={handlePrevPage} onNext={handleNextPage} />
          )}
          {currentPage === 4 && (
            <Page4 onPrev={handlePrevPage} onNext={handleNextPage} />
          )}
          {currentPage === 5 && (
            <Page5 onPrev={handlePrevPage} />
          )}
          {currentPage > 5 && (
            <motion.div 
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative z-10 w-full h-full flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-[#00E599] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                <p className="text-2xl text-white/50 font-light tracking-widest">等待下一页视觉输入...</p>
                <button 
                  onClick={handlePrevPage}
                  className="mt-8 text-sm text-[#00E599] hover:underline"
                >
                  返回上一页
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Vertical Navigation Dots */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className="group relative flex items-center justify-end"
          >
            <span className={`mr-4 text-[10px] font-mono tracking-tighter transition-all duration-300 ${currentPage === pageNum ? 'text-[#00E599] opacity-100' : 'text-white/20 opacity-0 group-hover:opacity-100'}`}>
              0{pageNum}
            </span>
            <div className={`w-2 h-2 rounded-full border transition-all duration-500 ${currentPage === pageNum ? 'bg-[#00E599] border-[#00E599] scale-125 shadow-[0_0_10px_#00E599]' : 'bg-transparent border-white/30 hover:border-[#00E599]'}`} />
          </button>
        ))}
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .mask-reflection {
          mask-image: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 70%);
          -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 70%);
        }
      `}</style>
    </div>
  );
}
