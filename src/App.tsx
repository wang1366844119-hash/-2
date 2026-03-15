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
const Page5 = ({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) => {
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
      <div className="w-full px-12 flex flex-col items-center mt-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-[1800px]">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 80 }}
              animate={{ 
                opacity: 1, 
                y: [0, -25, 0],
                rotateZ: [0, 1, -1, 0],
              }}
              transition={{ 
                opacity: { duration: 1.2, delay: idx * 0.4 },
                y: { 
                  duration: 5 + idx * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                rotateZ: {
                  duration: 7 + idx,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              }}
              className="flex flex-col items-center"
            >
              <div className={`relative aspect-square w-full overflow-hidden shadow-2xl ${idx === 2 ? 'bg-black' : ''}`}>
                <FallbackImage 
                  src={img.src} 
                  alt={img.alt} 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              {/* Reflection */}
              <div 
                className="mt-1 w-full opacity-25 pointer-events-none select-none" 
                style={{ 
                  transform: 'scaleY(-1)',
                  maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%)'
                }}
              >
                <div className="relative aspect-square w-full overflow-hidden">
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

// --- Page 6 Component ---
const Page6 = ({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) => {
  return (
    <motion.div 
      key="page6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="relative z-10 w-full h-full overflow-hidden bg-[#1a0b2e]"
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
              世界模型到底是什么？
            </motion.h1>
            
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
              className="text-[3.5rem] md:text-[5rem] lg:text-[6rem] font-bold tracking-tight text-white leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              他会是通往AGI的终极密码吗
            </motion.h2>
          </div>
        </div>
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

// --- Page 7 Component ---
const Page7 = ({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) => {
  return (
    <motion.div 
      key="page7"
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
            什么是世界模型
          </motion.h1>
          
          <motion.h2 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-[3rem] md:text-[4.5rem] lg:text-[6rem] font-bold leading-none tracking-tight text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            他有何不同
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

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-8 z-40">
        <button
          onClick={onPrev}
          className="text-white/50 hover:text-white transition-colors flex items-center gap-2 text-sm uppercase tracking-widest cursor-pointer"
        >
          ← 上一页
        </button>
      </div>
    </motion.div>
  );
};

// --- Page 8 Component ---
const Page8 = ({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) => {
  return (
    <motion.div 
      key="page8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="relative z-10 w-full h-full overflow-hidden bg-[#1a0b2e]"
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
              世界模型的通俗定义
            </motion.h1>
            
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.6 }}
              className="text-[3.5rem] md:text-[5rem] lg:text-[6rem] font-bold tracking-tight text-white leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              让模型认识这个世界
            </motion.h2>
          </div>
        </div>
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

// --- Page 9 Component ---
const Page9 = ({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) => {
  return (
    <motion.div 
      key="page9"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="relative z-10 w-full h-full flex flex-col items-center justify-center px-8"
    >
      {/* Top Text */}
      <motion.h2 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-12 tracking-wide"
      >
        杨立昆先生对于模型有个简单的说法：
      </motion.h2>

      {/* Comic with Tech Border */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring" }}
        className="relative w-full max-w-5xl aspect-[2/1] bg-black/40 backdrop-blur-md border border-[#00E599]/30 rounded-xl p-4 md:p-8 shadow-[0_0_50px_rgba(0,229,153,0.15)] flex items-center justify-center overflow-hidden group"
      >
        {/* Tech Border Accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#00E599] rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#00E599] rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#00E599] rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#00E599] rounded-br-xl" />
        
        {/* Scanning line effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00E599]/10 to-transparent h-[200%] animate-[scan_4s_linear_infinite] pointer-events-none" />

        {/* SVG Comic */}
        <svg viewBox="0 0 800 400" className="w-full h-full drop-shadow-2xl relative z-10">
          {/* Table edge */}
          <path d="M 150 120 L 350 120 L 350 130 L 150 130 Z" fill="#ffffff" opacity="0.8" />
          <path d="M 150 120 L 330 120" stroke="#ffffff" strokeWidth="2" />
          
          {/* Falling Cup */}
          <motion.g 
            initial={{ x: 330, y: 30, rotate: 30, opacity: 0 }}
            animate={{ x: 330, y: 80, rotate: 30, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <path d="M-20,-30 L20,-30 L15,30 L-15,30 Z" fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="2" />
            <ellipse cx="0" cy="-30" rx="20" ry="6" fill="rgba(255,255,255,0.2)" stroke="white" strokeWidth="2" />
            <ellipse cx="0" cy="30" rx="15" ry="4" fill="none" stroke="white" strokeWidth="2" />
          </motion.g>

          {/* Left Arrow (Glass) */}
          <motion.g 
            initial={{ opacity: 0, x: 340, y: 150 }}
            animate={{ opacity: 1, x: 330, y: 150 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <path d="M-10,10 L-80,90 L-60,90 L-100,140 L-90,80 L-70,80 Z" fill="#ff4d4f" stroke="#cf1322" strokeWidth="2" strokeLinejoin="round" />
            <text x="-120" y="60" fill="white" fontSize="20" fontFamily="sans-serif" fontWeight="bold">玻璃 → 碎</text>
          </motion.g>

          {/* Right Arrow (Plastic) */}
          <motion.g 
            initial={{ opacity: 0, x: 360, y: 150 }}
            animate={{ opacity: 1, x: 370, y: 150 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <path d="M10,10 L80,90 L60,90 L100,140 L90,80 L70,80 Z" fill="#1890ff" stroke="#096dd9" strokeWidth="2" strokeLinejoin="round" />
            <text x="60" y="60" fill="white" fontSize="20" fontFamily="sans-serif" fontWeight="bold">塑料 → 弹</text>
          </motion.g>

          {/* Glass Shattering */}
          <g transform="translate(230, 320)">
            {/* Floor */}
            <line x1="-80" y1="20" x2="80" y2="20" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
            {/* Shards */}
            <motion.path d="M-30,15 L-10,-10 L10,10 Z" fill="rgba(255,77,79,0.2)" stroke="#ff4d4f" strokeWidth="2" 
              initial={{ x: 20, y: -10, scale: 0, opacity: 0 }} animate={{ x: 0, y: 0, scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.8, type: "spring" }} />
            <motion.path d="M15,15 L30,-5 L45,10 Z" fill="rgba(255,77,79,0.2)" stroke="#ff4d4f" strokeWidth="2" 
              initial={{ x: -20, y: -10, scale: 0, opacity: 0 }} animate={{ x: 0, y: 0, scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.8, type: "spring" }} />
            <motion.path d="M-50,15 L-40,0 L-25,10 Z" fill="rgba(255,77,79,0.2)" stroke="#ff4d4f" strokeWidth="2" 
              initial={{ x: 30, y: -10, scale: 0, opacity: 0 }} animate={{ x: 0, y: 0, scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.8, type: "spring" }} />
            <motion.path d="M-15,5 L0,-25 L15,-5 Z" fill="rgba(255,77,79,0.2)" stroke="#ff4d4f" strokeWidth="2" 
              initial={{ x: 0, y: 20, scale: 0, opacity: 0 }} animate={{ x: 0, y: 0, scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.8, type: "spring" }} />
            <motion.path d="M-5,15 L10,0 L25,15 Z" fill="rgba(255,77,79,0.2)" stroke="#ff4d4f" strokeWidth="2" 
              initial={{ x: -10, y: -10, scale: 0, opacity: 0 }} animate={{ x: 0, y: 0, scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.8, type: "spring" }} />
            {/* Impact lines */}
            <motion.path d="M-40,-10 L-50,-30 M-10,-30 L-15,-50 M20,-20 L35,-40 M40,-5 L60,-15" stroke="#ff4d4f" strokeWidth="2" strokeLinecap="round" 
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: [0, 1, 0] }} transition={{ duration: 0.6, delay: 0.8 }} />
          </g>

          {/* Plastic Bouncing */}
          <g transform="translate(470, 320)">
            {/* Floor */}
            <line x1="-60" y1="20" x2="120" y2="20" stroke="white" strokeWidth="1" strokeOpacity="0.5" />
            
            {/* Bounce trajectory */}
            <motion.path d="M-40,-40 Q0,40 20,20 Q40,0 80,-50" fill="none" stroke="#1890ff" strokeWidth="3" strokeDasharray="6,6" 
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.8 }} />
            <motion.path d="M-30,-40 Q0,30 20,10 Q40,-10 70,-50" fill="none" stroke="#1890ff" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" 
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.8 }} />
            
            {/* Bounced Cup */}
            <motion.g 
              initial={{ x: -100, y: -150, rotate: 0, scaleY: 1 }}
              animate={{ 
                x: [-100, -10, 80], 
                y: [-150, 10, -60], 
                rotate: [0, 15, 25], 
                scaleY: [1, 0.6, 1] 
              }}
              transition={{ 
                duration: 0.8, 
                delay: 0.8, 
                times: [0, 0.5, 1], 
                ease: ["easeIn", "easeOut"] 
              }}
            >
              <path d="M-20,-30 L20,-30 L15,30 L-15,30 Z" fill="rgba(24,144,255,0.1)" stroke="#1890ff" strokeWidth="2" />
              <ellipse cx="0" cy="-30" rx="20" ry="6" fill="rgba(24,144,255,0.2)" stroke="#1890ff" strokeWidth="2" />
              <ellipse cx="0" cy="30" rx="15" ry="4" fill="none" stroke="#1890ff" strokeWidth="2" />
              {/* Cup ridges */}
              <line x1="-10" y1="-30" x2="-7" y2="30" stroke="#1890ff" strokeWidth="1" opacity="0.5" />
              <line x1="0" y1="-30" x2="0" y2="30" stroke="#1890ff" strokeWidth="1" opacity="0.5" />
              <line x1="10" y1="-30" x2="7" y2="30" stroke="#1890ff" strokeWidth="1" opacity="0.5" />
            </motion.g>
          </g>
        </svg>
      </motion.div>

      {/* Bottom Text */}
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-5xl md:text-6xl lg:text-7xl font-black text-[#FFD700] mt-12 tracking-widest drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]"
      >
        而这就是杯子理论
      </motion.h1>

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

// --- Page 10 Component ---
const Page10 = ({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) => {
  return (
    <motion.div 
      key="page10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="relative z-10 w-full h-full flex flex-col items-center justify-center px-8"
    >
      {/* Top Text */}
      <motion.h2 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-12 tracking-wide"
      >
        杨立昆先生对于模型有个简单的说法：
      </motion.h2>

      {/* Comic with Tech Border */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring" }}
        className="relative w-full max-w-5xl aspect-[2/1] bg-black/40 backdrop-blur-md border border-[#00E599]/30 rounded-xl p-4 md:p-8 shadow-[0_0_50px_rgba(0,229,153,0.15)] flex items-center justify-center overflow-hidden group"
      >
        {/* Tech Border Accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#00E599] rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-[#00E599] rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-[#00E599] rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#00E599] rounded-br-xl" />
        
        {/* Scanning line effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00E599]/10 to-transparent h-[200%] animate-[scan_4s_linear_infinite] pointer-events-none" />

        {/* SVG Comic */}
        <svg viewBox="0 0 900 400" className="w-full h-full drop-shadow-2xl relative z-10">
          <defs>
            {/* Gradients */}
            <linearGradient id="bg-think" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E0F7FA" />
              <stop offset="100%" stopColor="#B2EBF2" />
            </linearGradient>
            <linearGradient id="bg-action" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFF3E0" />
              <stop offset="100%" stopColor="#FFE0B2" />
            </linearGradient>
            <linearGradient id="bg-happy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FCE4EC" />
              <stop offset="100%" stopColor="#F8BBD0" />
            </linearGradient>
            
            {/* Shadows */}
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.15" />
            </filter>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#FFD700" floodOpacity="0.6" />
            </filter>

            {/* Reusable Walnut */}
            <g id="walnut-detailed">
              <path d="M 0,-15 C 10,-15 15,-5 15,0 C 15,10 5,15 0,15 C -5,15 -15,10 -15,0 C -15,-5 -10,-15 0,-15 Z" fill="#8B5A2B" filter="url(#shadow)" />
              <path d="M 0,-15 C 10,-15 15,-5 15,0 C 15,10 5,15 0,15 C -5,15 -15,10 -15,0 C -15,-5 -10,-15 0,-15 Z" fill="none" stroke="#5D4037" strokeWidth="2" />
              {/* Texture lines */}
              <path d="M -8,-5 Q 0,-10 8,-5 M -10,0 Q 0,-5 10,0 M -8,5 Q 0,0 8,5 M -4,10 Q 0,5 4,10" fill="none" stroke="#5D4037" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M -5,-10 Q 0,-12 5,-10" fill="none" stroke="#CD853F" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Reusable Walnut Half */}
            <g id="walnut-half">
              <path d="M -15,0 C -15,-10 -5,-15 0,-15 C 5,-15 15,-10 15,0 Z" fill="#D2B48C" filter="url(#shadow)" />
              <path d="M -15,0 C -15,5 -5,10 0,10 C 5,10 15,5 15,0 Z" fill="#8B5A2B" />
              {/* Nut meat */}
              <path d="M -8,-2 C -8,-8 -2,-10 0,-10 C 2,-10 8,-8 8,-2 C 8,2 2,4 0,4 C -2,4 -8,2 -8,-2 Z" fill="#F4A460" />
              <path d="M -4,-2 Q 0,-6 4,-2 M -4,0 Q 0,-4 4,0" fill="none" stroke="#D2691E" strokeWidth="1" />
            </g>
          </defs>

          {/* Panel 1: Thinking */}
          <g transform="translate(10, 10)">
            <rect x="0" y="0" width="280" height="380" fill="url(#bg-think)" rx="16" />
            {/* Floor */}
            <ellipse cx="140" cy="340" rx="120" ry="20" fill="#000" opacity="0.05" />
            
            {/* Squirrel (Sitting, looking right) */}
            <g transform="translate(80, 280)">
              {/* Tail */}
              <path d="M -10,30 C -80,30 -120,-60 -60,-100 C -20,-120 20,-60 0,-10 Z" fill="#E88D3B" filter="url(#shadow)" />
              <path d="M -10,30 C -80,30 -120,-60 -60,-100 C -40,-110 -10,-70 -10,-30 Z" fill="#C06A22" opacity="0.3" />
              {/* Body */}
              <path d="M -20,-20 C -20,-60 20,-60 20,-20 C 25,20 15,40 -5,40 C -25,40 -25,20 -20,-20 Z" fill="#E88D3B" />
              {/* Belly */}
              <path d="M -5,-10 C -5,-40 15,-40 15,-10 C 18,15 10,35 0,35 C -10,35 -8,15 -5,-10 Z" fill="#FFF4E6" />
              {/* Head */}
              <circle cx="0" cy="-50" r="35" fill="#E88D3B" filter="url(#shadow)" />
              {/* Snout */}
              <ellipse cx="20" cy="-45" rx="18" ry="12" fill="#FFF4E6" />
              <circle cx="35" cy="-48" r="4" fill="#333" />
              {/* Ears */}
              <path d="M -20,-75 L -10,-105 L 5,-80 Z" fill="#E88D3B" />
              <path d="M -15,-75 L -10,-95 L 0,-80 Z" fill="#FFF4E6" />
              <path d="M 10,-80 L 20,-105 L 25,-75 Z" fill="#E88D3B" />
              <path d="M 12,-80 L 18,-95 L 22,-75 Z" fill="#FFF4E6" />
              {/* Eye */}
              <circle cx="10" cy="-60" r="6" fill="#333" />
              <circle cx="12" cy="-62" r="2" fill="#FFF" />
              {/* Arm (Thinking) */}
              <path d="M -5,-10 C 10,-10 20,-20 15,-30" fill="none" stroke="#E88D3B" strokeWidth="8" strokeLinecap="round" />
              {/* Leg */}
              <path d="M -15,20 C -5,20 10,25 10,35" fill="none" stroke="#E88D3B" strokeWidth="10" strokeLinecap="round" />
            </g>

            {/* Walnut on ground */}
            <use href="#walnut-detailed" x="200" y="320" transform="scale(1.2)" />

            {/* Thought Bubble */}
            <motion.g 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5, type: "spring" }}
              style={{ transformOrigin: '100px 200px' }}
            >
              <circle cx="90" cy="180" r="6" fill="#FFF" filter="url(#shadow)" />
              <circle cx="105" cy="150" r="10" fill="#FFF" filter="url(#shadow)" />
              <circle cx="125" cy="110" r="16" fill="#FFF" filter="url(#shadow)" />
              
              <path d="M 140,50 C 140,10 260,10 260,50 C 280,50 280,90 260,100 C 260,140 140,140 140,100 C 120,90 120,50 140,50 Z" fill="#FFF" filter="url(#shadow)" />
              
              {/* Inside thought: Door gap and walnut */}
              <rect x="160" y="30" width="15" height="90" fill="#8B5A2B" rx="2" />
              <rect x="175" y="30" width="8" height="90" fill="#3E2723" />
              <rect x="183" y="30" width="50" height="90" fill="#A0522D" rx="2" />
              <use href="#walnut-detailed" x="179" y="75" transform="scale(0.8)" />
              
              {/* Action lines in thought */}
              <path d="M 150,75 L 165,75 M 195,75 L 210,75 M 165,60 L 175,68 M 195,60 L 185,68 M 165,90 L 175,82 M 195,90 L 185,82" stroke="#FF5722" strokeWidth="2" strokeLinecap="round" />
            </motion.g>
          </g>

          {/* Panel 2: Cracking */}
          <g transform="translate(310, 10)">
            <rect x="0" y="0" width="280" height="380" fill="url(#bg-action)" rx="16" />
            
            {/* Door */}
            <rect x="180" y="0" width="30" height="380" fill="#8B5A2B" />
            <rect x="210" y="0" width="15" height="380" fill="#3E2723" />
            <rect x="225" y="0" width="55" height="380" fill="#A0522D" />
            {/* Door Hinge */}
            <rect x="205" y="80" width="10" height="30" fill="#7F8C8D" rx="2" />
            <rect x="205" y="280" width="10" height="30" fill="#7F8C8D" rx="2" />

            {/* Action Lines Background */}
            <path d="M 0,190 L 280,190 M 0,100 L 280,150 M 0,280 L 280,230" stroke="#FFF" strokeWidth="2" opacity="0.3" />

            {/* Walnut in door gap */}
            <use href="#walnut-detailed" x="217" y="240" transform="scale(1.2)" />
            
            {/* Impact effects */}
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.2, type: "spring" }}
              style={{ transformOrigin: '217px 240px' }}
            >
              <path d="M 180,240 L 150,240 M 250,240 L 280,240 M 190,210 L 170,190 M 240,210 L 260,190 M 190,270 L 170,290 M 240,270 L 260,290" stroke="#FF5722" strokeWidth="4" strokeLinecap="round" />
              <circle cx="217" cy="240" r="25" fill="none" stroke="#FFD700" strokeWidth="3" opacity="0.8" />
            </motion.g>

            {/* Squirrel (Pushing door) */}
            <g transform="translate(130, 260) rotate(15)">
              <motion.g 
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5, delay: 1, type: "spring" }}
              >
                {/* Tail */}
              <path d="M -10,30 C -80,30 -120,-60 -60,-100 C -20,-120 20,-60 0,-10 Z" fill="#E88D3B" filter="url(#shadow)" />
              {/* Body */}
              <path d="M -20,-20 C -20,-60 20,-60 20,-20 C 25,20 15,40 -5,40 C -25,40 -25,20 -20,-20 Z" fill="#E88D3B" />
              <path d="M -5,-10 C -5,-40 15,-40 15,-10 C 18,15 10,35 0,35 C -10,35 -8,15 -5,-10 Z" fill="#FFF4E6" />
              {/* Head */}
              <circle cx="0" cy="-50" r="35" fill="#E88D3B" filter="url(#shadow)" />
              <ellipse cx="20" cy="-45" rx="18" ry="12" fill="#FFF4E6" />
              <circle cx="35" cy="-48" r="4" fill="#333" />
              {/* Ears */}
              <path d="M -20,-75 L -10,-105 L 5,-80 Z" fill="#E88D3B" />
              <path d="M 10,-80 L 20,-105 L 25,-75 Z" fill="#E88D3B" />
              {/* Eyes (Struggling ><) */}
              <path d="M 5,-65 L 12,-60 L 5,-55" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              {/* Sweat drop */}
              <path d="M -10,-65 C -15,-60 -15,-55 -10,-55 C -5,-55 -5,-60 -10,-65 Z" fill="#4FC3F7" />
              {/* Arms (Pushing) */}
              <path d="M 0,-20 L 40,-30" fill="none" stroke="#E88D3B" strokeWidth="8" strokeLinecap="round" />
              <path d="M -5,-5 L 35,-15" fill="none" stroke="#E88D3B" strokeWidth="8" strokeLinecap="round" />
              {/* Legs */}
              <path d="M -15,20 L -30,40" fill="none" stroke="#E88D3B" strokeWidth="10" strokeLinecap="round" />
              <path d="M 5,25 L -10,45" fill="none" stroke="#E88D3B" strokeWidth="10" strokeLinecap="round" />
              </motion.g>
            </g>
          </g>

          {/* Panel 3: Eating */}
          <g transform="translate(610, 10)">
            <rect x="0" y="0" width="280" height="380" fill="url(#bg-happy)" rx="16" />
            {/* Floor */}
            <ellipse cx="140" cy="340" rx="100" ry="20" fill="#000" opacity="0.05" />

            {/* Sparkles / Hearts */}
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 2, type: "spring" }}
            >
              <path d="M 60,100 A 10 10 0 0 1 80,100 A 10 10 0 0 1 100,100 Q 100,120 80,130 Q 60,120 60,100 Z" fill="#FF5252" transform="rotate(-15 80 115)" />
              <path d="M 180,80 A 8 8 0 0 1 196,80 A 8 8 0 0 1 212,80 Q 212,96 196,104 Q 180,96 180,80 Z" fill="#FF5252" transform="rotate(15 196 92)" />
              <circle cx="100" cy="60" r="4" fill="#FFD700" filter="url(#glow)" />
              <circle cx="220" cy="140" r="5" fill="#FFD700" filter="url(#glow)" />
              <circle cx="50" cy="180" r="3" fill="#FFD700" filter="url(#glow)" />
            </motion.g>

            {/* Squirrel (Happy, eating) */}
            <g transform="translate(140, 280)">
              <motion.g 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.8 }}
              >
                {/* Tail */}
              <path d="M -10,30 C -80,30 -120,-60 -60,-100 C -20,-120 20,-60 0,-10 Z" fill="#E88D3B" filter="url(#shadow)" />
              {/* Body */}
              <path d="M -25,-20 C -25,-60 25,-60 25,-20 C 30,20 20,40 -5,40 C -30,40 -30,20 -25,-20 Z" fill="#E88D3B" />
              {/* Belly */}
              <path d="M -10,-10 C -10,-40 20,-40 20,-10 C 23,15 15,35 0,35 C -15,35 -13,15 -10,-10 Z" fill="#FFF4E6" />
              {/* Head */}
              <circle cx="0" cy="-50" r="35" fill="#E88D3B" filter="url(#shadow)" />
              {/* Snout */}
              <ellipse cx="0" cy="-40" rx="18" ry="12" fill="#FFF4E6" />
              <circle cx="0" cy="-45" r="4" fill="#333" />
              {/* Ears */}
              <path d="M -20,-75 L -30,-105 L -5,-80 Z" fill="#E88D3B" />
              <path d="M 20,-75 L 30,-105 L 5,-80 Z" fill="#E88D3B" />
              {/* Happy Eyes (^^) */}
              <path d="M -15,-55 Q -10,-62 -5,-55" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
              <path d="M 5,-55 Q 10,-62 15,-55" fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
              {/* Cheeks */}
              <circle cx="-18" cy="-45" r="6" fill="#FF8A65" opacity="0.6" />
              <circle cx="18" cy="-45" r="6" fill="#FF8A65" opacity="0.6" />
              {/* Mouth (Chewing) */}
              <path d="M -5,-35 Q 0,-30 5,-35" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
              
              {/* Arms holding nut */}
              <path d="M -15,-10 C -5,-10 0,-20 0,-25" fill="none" stroke="#E88D3B" strokeWidth="8" strokeLinecap="round" />
              <path d="M 15,-10 C 5,-10 0,-20 0,-25" fill="none" stroke="#E88D3B" strokeWidth="8" strokeLinecap="round" />
              
              {/* Walnut Half */}
              <use href="#walnut-half" x="0" y="-25" transform="scale(1.2)" />
              
              {/* Legs */}
              <path d="M -20,20 C -10,20 0,25 0,35" fill="none" stroke="#E88D3B" strokeWidth="10" strokeLinecap="round" />
              <path d="M 20,20 C 10,20 0,25 0,35" fill="none" stroke="#E88D3B" strokeWidth="10" strokeLinecap="round" />
              </motion.g>
            </g>

            {/* Broken shell pieces on ground */}
            <motion.g
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.5, type: "spring" }}
            >
              <path d="M 80,330 C 90,320 100,330 90,340 Z" fill="#8B5A2B" filter="url(#shadow)" />
              <path d="M 190,325 C 200,315 210,320 200,335 Z" fill="#8B5A2B" filter="url(#shadow)" />
              <path d="M 110,345 C 115,340 120,345 115,350 Z" fill="#8B5A2B" />
              <path d="M 160,340 C 165,335 170,340 165,345 Z" fill="#8B5A2B" />
            </motion.g>
          </g>
        </svg>
      </motion.div>

      {/* Bottom Text */}
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold mt-12 tracking-wider flex items-center gap-4"
      >
        <span className="text-white">从</span>
        <span className="text-[#FFD700]">If I did this,</span>
        <span className="text-[#00E599]">what would happen?</span>
      </motion.h1>

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

// --- Page 11 Component ---
const Page11 = ({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) => {
  return (
    <motion.div 
      key="page11"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="relative z-10 w-full h-full flex items-center justify-center px-8 md:px-24"
    >
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="flex flex-col space-y-16">
          <motion.p 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-300 leading-relaxed font-medium"
          >
            <span className="text-white font-bold">1943 年，Kenneth Craik 在其著作《解释的本质》中就提出：</span>
            人在对现实作出反应之前，会先在大脑中构建一个“小规模的世界模型”，用它来模拟可能发生的过程，再据此选择行动。
          </motion.p>

          <motion.h2 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#82e0aa] leading-tight"
            style={{ textShadow: '0 0 20px rgba(130, 224, 170, 0.3)' }}
          >
            也就是说，我们每个人脑子里，都有一个看不见的<br/>“小世界”
          </motion.h2>
        </div>

        {/* Right Content - Book Cover */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center items-center"
        >
          {/* Book Cover Container */}
          <div className="relative w-[340px] h-[520px] bg-[#a89f4b] p-6 shadow-2xl flex flex-col items-center border-l-8 border-[#8a823d]">
            {/* Inner Red Box */}
            <div className="w-full bg-[#b24a42] border-2 border-white/80 p-8 flex flex-col items-center justify-center mb-8 shadow-inner">
              <h1 className="font-serif text-white text-center leading-tight">
                <span className="block text-4xl mb-2">The</span>
                <span className="block text-5xl mb-2">Nature of</span>
                <span className="block text-5xl">Psychology</span>
              </h1>
            </div>

            {/* Subtitle & Author */}
            <div className="flex flex-col items-center text-center space-y-6 w-full px-4">
              <p className="font-serif italic text-[#8b3a33] text-lg leading-snug">
                A Selection of Papers, Essays and<br/>Other Writings by
              </p>
              
              <h2 className="font-serif italic text-white text-2xl tracking-wider">
                KENNETH J. W. CRAIK
              </h2>
              
              <p className="font-serif italic text-[#8b3a33] text-lg">
                Edited by Stephen L. Sherwood
              </p>
            </div>

            {/* Publisher */}
            <div className="absolute bottom-8 w-full text-center">
              <p className="font-serif text-white/90 text-lg tracking-wide">
                Cambridge University Press
              </p>
            </div>
            
            {/* Book spine effect */}
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/10" />
            <div className="absolute left-2 top-0 bottom-0 w-px bg-white/20" />
          </div>
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 right-8 flex gap-4 z-50">
        <button 
          onClick={onPrev}
          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-[#00E599] hover:bg-[#00E599]/10 transition-all"
        >
          ←
        </button>
        <button 
          onClick={onNext}
          className="w-12 h-12 rounded-full border border-[#00E599]/50 flex items-center justify-center text-[#00E599] hover:bg-[#00E599] hover:text-black transition-all shadow-[0_0_15px_rgba(0,229,153,0.3)]"
        >
          →
        </button>
      </div>
    </motion.div>
  );
};

// --- Page 12 Component ---
const Page12 = ({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3,
      }
    }
  };

  const charVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <motion.div 
      key="page12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="relative z-10 w-full h-full flex items-center justify-center px-4"
    >
      <div className="text-center flex flex-col items-center justify-center w-full max-w-[95vw]">
        <motion.h1 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="text-3xl sm:text-4xl md:text-6xl lg:text-[4.5rem] font-black leading-tight flex flex-col items-center gap-6 tracking-wide"
        >
          <div className="text-[#00E599] flex justify-center whitespace-nowrap" style={{ textShadow: '0 4px 20px rgba(0,229,153,0.2)' }}>
            {"我们该如何去搭建属于ai自己的".split("").map((char, index) => (
              <motion.span key={`l1-${index}`} variants={charVariants} className="inline-block">
                {char}
              </motion.span>
            ))}
          </div>
          <div className="flex items-center whitespace-nowrap">
            <span className="bg-gradient-to-b from-[#FFF080] to-[#E5A000] bg-clip-text text-transparent drop-shadow-lg" style={{ filter: 'drop-shadow(0 4px 15px rgba(229,160,0,0.3))' }}>
              {"” 内部世界 “".split("").map((char, index) => (
                <motion.span key={`l2a-${index}`} variants={charVariants} className="inline-block whitespace-pre">
                  {char}
                </motion.span>
              ))}
            </span>
            <span className="text-[#00E599]" style={{ textShadow: '0 4px 20px rgba(0,229,153,0.2)' }}>
              {"呢?".split("").map((char, index) => (
                <motion.span key={`l2b-${index}`} variants={charVariants} className="inline-block">
                  {char}
                </motion.span>
              ))}
            </span>
          </div>
        </motion.h1>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 right-8 flex gap-4 z-50">
        <button 
          onClick={onPrev}
          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-[#00E599] hover:bg-[#00E599]/10 transition-all"
        >
          ←
        </button>
        <button 
          onClick={onNext}
          className="w-12 h-12 rounded-full border border-[#00E599]/50 flex items-center justify-center text-[#00E599] hover:bg-[#00E599] hover:text-black transition-all shadow-[0_0_15px_rgba(0,229,153,0.3)]"
        >
          →
        </button>
      </div>
    </motion.div>
  );
};

// --- Page 13 Component ---
const Page13 = ({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) => {
  return (
    <motion.div 
      key="page13"
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
            className="text-[4rem] md:text-[5.5rem] lg:text-[7rem] font-black leading-none tracking-tight text-[#00E599] mb-4 drop-shadow-[0_0_30px_rgba(0,229,153,0.3)]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            走向世界模型的道路
          </motion.h1>
          
          <motion.h2 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-[3rem] md:text-[4rem] lg:text-[5rem] font-bold leading-none tracking-tight text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            踏上取经路
          </motion.h2>
        </div>
      </div>

      <div className="absolute bottom-12 right-8 md:bottom-24 md:right-24 flex items-center gap-6">
        <motion.button 
          onClick={onPrev}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:border-[#00E599] transition-all z-50 shadow-2xl"
        >
          <span className="text-2xl">←</span>
        </motion.button>
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

// --- Page 14 Components ---
const Apple = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 100" className={className} style={style}>
    <defs>
      <radialGradient id="appleGrad" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ff6b6b" />
        <stop offset="80%" stopColor="#cc0000" />
        <stop offset="100%" stopColor="#880000" />
      </radialGradient>
    </defs>
    <path d="M50,90 C20,90 10,60 15,35 C20,10 40,15 50,25 C60,15 80,10 85,35 C90,60 80,90 50,90 Z" fill="url(#appleGrad)" />
    <path d="M50,25 Q45,10 55,5" fill="none" stroke="#5c4033" strokeWidth="3" strokeLinecap="round" />
    <path d="M55,15 Q70,5 80,15 Q70,25 55,15 Z" fill="#4ade80" />
    <path d="M25,40 Q30,25 45,30" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
  </svg>
);

const Robot = ({ pose = 'front', className, style }: { pose?: 'front' | 'back' | 'side' | 'flying', className?: string, style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 120" className={className} style={style}>
    <rect x="25" y="10" width="50" height="40" rx="15" fill="#f0f0f0" stroke="#ccc" strokeWidth="2" />
    <circle cx="20" cy="30" r="6" fill="#00E599" />
    <circle cx="80" cy="30" r="6" fill="#00E599" />
    {pose === 'front' && (
      <>
        <rect x="35" y="20" width="30" height="15" rx="5" fill="#1e3a8a" />
        <circle cx="42" cy="27" r="3" fill="#60a5fa" />
        <circle cx="58" cy="27" r="3" fill="#60a5fa" />
      </>
    )}
    {pose === 'back' && (
      <>
        <line x1="35" y1="25" x2="65" y2="25" stroke="#ccc" strokeWidth="2" />
        <line x1="35" y1="35" x2="65" y2="35" stroke="#ccc" strokeWidth="2" />
      </>
    )}
    {pose === 'side' && (
      <>
        <rect x="45" y="20" width="20" height="15" rx="5" fill="#1e3a8a" />
        <circle cx="55" cy="27" r="3" fill="#60a5fa" />
      </>
    )}
    <rect x="45" y="50" width="10" height="10" fill="#9ca3af" />
    <rect x="30" y="60" width="40" height="40" rx="10" fill="#f0f0f0" stroke="#ccc" strokeWidth="2" />
    {pose === 'front' || pose === 'back' ? (
      <>
        <rect x="15" y="65" width="10" height="30" rx="5" fill="#e5e7eb" />
        <rect x="75" y="65" width="10" height="30" rx="5" fill="#e5e7eb" />
      </>
    ) : (
      <rect x="45" y="65" width="10" height="30" rx="5" fill="#e5e7eb" transform="rotate(-30 50 65)" />
    )}
    {pose !== 'flying' && (
      <>
        <rect x="35" y="100" width="10" height="20" rx="3" fill="#9ca3af" />
        <rect x="55" y="100" width="10" height="20" rx="3" fill="#9ca3af" />
      </>
    )}
    {pose === 'flying' && (
      <>
        <rect x="35" y="100" width="10" height="15" rx="3" fill="#9ca3af" transform="rotate(20 40 100)" />
        <rect x="55" y="100" width="10" height="15" rx="3" fill="#9ca3af" transform="rotate(-20 60 100)" />
        <path d="M35,115 L45,115 L40,125 Z" fill="#fbbf24" />
        <path d="M55,115 L65,115 L60,125 Z" fill="#fbbf24" />
      </>
    )}
  </svg>
);

const HologramScreen = ({ text, children, className }: { text: string, children?: React.ReactNode, className?: string }) => (
  <div className={`absolute border border-cyan-400 bg-cyan-900/40 backdrop-blur-sm rounded-md flex flex-col items-center justify-center p-2 shadow-[0_0_15px_rgba(34,211,238,0.5)] ${className}`}>
    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-300"></div>
    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-300"></div>
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-300"></div>
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-300"></div>
    {children}
    <div className="text-white text-xs font-bold mt-1 tracking-wider">{text}</div>
  </div>
);

const Page14 = ({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) => {
  return (
    <motion.div 
      key="page14"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="relative z-10 w-full h-full flex flex-col items-center justify-center px-8"
    >
      {/* Top Text */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 flex items-center gap-4"
      >
        <span className="text-white">道路一：</span>
        <span className="text-[#FFE566]">用3D数据的思维重塑ai世界观</span>
      </motion.div>

      {/* Comic Container */}
      <div className="relative w-full max-w-4xl">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="bg-white p-4 md:p-6 rounded-lg shadow-2xl relative z-10"
        >
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-black text-xl md:text-2xl font-bold">AI 学习视角关系</h3>
          </div>
          
          <div className="grid grid-cols-4 gap-2 h-48 md:h-64 lg:h-80">
            {/* Panel 1: Front */}
            <div className="border-2 border-black bg-gradient-to-b from-[#87CEEB] to-[#E0F6FF] relative overflow-hidden flex flex-col items-center justify-end pb-4">
              <Robot pose="side" className="w-20 h-28 md:w-24 md:h-32 absolute bottom-0 left-[-10px]" />
              <Apple className="w-16 h-16 md:w-20 md:h-20 absolute bottom-4 right-2" />
              <HologramScreen text="正面视角" className="top-4 right-2 w-16 h-16 md:w-20 md:h-20">
                <Apple className="w-8 h-8 md:w-12 md:h-12" />
              </HologramScreen>
            </div>
            
            {/* Panel 2: Side */}
            <div className="border-2 border-black bg-gradient-to-b from-[#87CEEB] to-[#E0F6FF] relative overflow-hidden flex flex-col items-center justify-end pb-4">
              <Apple className="w-20 h-20 md:w-24 md:h-24 absolute bottom-2 left-[-10px]" />
              <Robot pose="flying" className="w-16 h-24 md:w-20 md:h-28 absolute top-8 right-2 transform -scale-x-100" />
              <HologramScreen text="侧面视角" className="top-16 left-2 w-16 h-16 md:w-20 md:h-20">
                <Apple className="w-8 h-8 md:w-10 md:h-10 transform -rotate-12" />
              </HologramScreen>
            </div>
            
            {/* Panel 3: Top */}
            <div className="border-2 border-black bg-gradient-to-b from-[#87CEEB] to-[#E0F6FF] relative overflow-hidden flex flex-col items-center justify-end pb-4">
              <Robot pose="back" className="w-16 h-24 md:w-20 md:h-28 absolute bottom-4" />
              <HologramScreen text="俯视视角" className="top-4 w-16 h-16 md:w-20 md:h-20">
                <svg viewBox="0 0 100 100" className="w-8 h-8 md:w-12 md:h-12">
                  <circle cx="50" cy="50" r="40" fill="#ff6b6b" />
                  <circle cx="50" cy="50" r="10" fill="#fef08a" />
                  <circle cx="85" cy="40" r="15" fill="#87CEEB" />
                  <circle cx="80" cy="60" r="12" fill="#87CEEB" />
                </svg>
              </HologramScreen>
            </div>
            
            {/* Panel 4: Complete */}
            <div className="border-2 border-black bg-gradient-to-b from-[#87CEEB] to-[#E0F6FF] relative overflow-hidden flex flex-col items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(12)].map((_, i) => (
                  <Apple 
                    key={i} 
                    className="absolute w-6 h-6 md:w-10 md:h-10" 
                    style={{ transform: `rotate(${i * 30}deg) translateY(-50px) rotate(-${i * 30}deg)` }} 
                  />
                ))}
                {[...Array(8)].map((_, i) => (
                  <Apple 
                    key={`inner-${i}`} 
                    className="absolute w-4 h-4 md:w-8 md:h-8 opacity-70" 
                    style={{ transform: `rotate(${i * 45 + 15}deg) translateY(-25px) rotate(-${i * 45 + 15}deg)` }} 
                  />
                ))}
              </div>
              <Robot pose="front" className="w-20 h-28 md:w-24 md:h-32 relative z-10" />
              <HologramScreen text="学习完成" className="bottom-4 w-20 h-8 md:w-24 md:h-10 z-10 bg-blue-900/80" />
            </div>
          </div>
          
          <div className="text-right mt-4 text-black font-bold text-sm md:text-base">
            从大量视觉资料中掌握视角关系
          </div>
        </motion.div>
        
        {/* Reflection */}
        <div 
          className="absolute top-full left-0 w-full h-32 bg-white/20 rounded-lg transform scale-y-[-1] blur-sm pointer-events-none"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)'
          }}
        >
        </div>
      </div>

      {/* Bottom Text */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 md:mt-16 flex flex-col items-center gap-2 md:gap-4 text-center z-20"
      >
        <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
          这也是Genie 3、Luma等为代表走的路
        </div>
        <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#00E599] drop-shadow-[0_0_15px_rgba(0,229,153,0.3)]">
          也是目前国内大厂的主要策略
        </div>
      </motion.div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 right-8 flex gap-4 z-50">
        <button 
          onClick={onPrev}
          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-[#00E599] hover:bg-[#00E599]/10 transition-all"
        >
          ←
        </button>
        <button 
          onClick={onNext}
          className="w-12 h-12 rounded-full border border-[#00E599]/50 flex items-center justify-center text-[#00E599] hover:bg-[#00E599] hover:text-black transition-all shadow-[0_0_15px_rgba(0,229,153,0.3)]"
        >
          →
        </button>
      </div>
    </motion.div>
  );
};

// --- Page 15 Components ---
const GaussianSplattingDiagram = ({ className }: { className?: string }) => (
  <div className={`bg-white p-4 md:p-8 rounded-lg shadow-2xl relative z-10 w-full max-w-5xl ${className}`}>
    <svg viewBox="0 0 1100 350" className="w-full h-full font-sans">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
        </marker>
        <marker id="arrowhead-blue" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#60a5fa" />
        </marker>
        <filter id="blur">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* SfM Points */}
      <g transform="translate(80, 180)">
        <circle cx="0" cy="0" r="3" fill="#333" />
        <circle cx="15" cy="-15" r="3" fill="#333" />
        <circle cx="25" cy="10" r="3" fill="#333" />
        <circle cx="10" cy="20" r="3" fill="#333" />
        <circle cx="35" cy="-5" r="3" fill="#333" />
        <circle cx="40" cy="15" r="3" fill="#333" />
        <text x="20" y="50" textAnchor="middle" className="text-base fill-gray-700">SfM Points</text>
      </g>

      {/* Arrow 1 */}
      <line x1="140" y1="180" x2="190" y2="180" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />

      {/* Initialization */}
      <g transform="translate(200, 140)">
        <rect width="120" height="80" fill="#f9fafb" stroke="#6b7280" strokeWidth="2" />
        <text x="60" y="45" textAnchor="middle" className="text-base fill-gray-800">Initialization</text>
      </g>

      {/* Arrow 2 */}
      <line x1="330" y1="180" x2="380" y2="180" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />

      {/* Camera */}
      <g transform="translate(370, 60)">
        <rect width="90" height="40" fill="#ffffff" stroke="#6b7280" strokeWidth="2" />
        <text x="45" y="25" textAnchor="middle" className="text-base fill-gray-800">Camera</text>
      </g>

      {/* Arrow Camera to Projection */}
      <line x1="470" y1="80" x2="530" y2="80" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />

      {/* 3D Gaussians */}
      <g transform="translate(430, 180)">
        <ellipse cx="-10" cy="-10" rx="25" ry="15" fill="#22c55e" filter="url(#blur)" opacity="0.8" transform="rotate(30)" />
        <ellipse cx="10" cy="5" rx="20" ry="30" fill="#16a34a" filter="url(#blur)" opacity="0.8" transform="rotate(-20)" />
        <ellipse cx="-5" cy="15" rx="30" ry="20" fill="#15803d" filter="url(#blur)" opacity="0.8" transform="rotate(10)" />
        <ellipse cx="15" cy="-15" rx="22" ry="15" fill="#4ade80" filter="url(#blur)" opacity="0.8" transform="rotate(-45)" />
        <text x="0" y="65" textAnchor="middle" className="text-base font-bold fill-gray-800">3D Gaussians</text>
      </g>

      {/* Projection */}
      <g transform="translate(540, 70)">
        <rect width="140" height="70" fill="#f9fafb" stroke="#6b7280" strokeWidth="2" />
        <text x="70" y="40" textAnchor="middle" className="text-base fill-gray-800">Projection</text>
      </g>

      {/* Adaptive Density Control */}
      <g transform="translate(540, 200)">
        <rect width="140" height="70" fill="#f9fafb" stroke="#6b7280" strokeWidth="2" />
        <text x="70" y="30" textAnchor="middle" className="text-base fill-gray-800">Adaptive</text>
        <text x="70" y="50" textAnchor="middle" className="text-base fill-gray-800">Density Control</text>
      </g>

      {/* Differentiable Tile Rasterizer */}
      <g transform="translate(750, 130)">
        <rect width="140" height="80" fill="#f9fafb" stroke="#6b7280" strokeWidth="2" />
        <text x="70" y="35" textAnchor="middle" className="text-base fill-gray-800">Differentiable</text>
        <text x="70" y="55" textAnchor="middle" className="text-base fill-gray-800">Tile Rasterizer</text>
      </g>

      {/* Image */}
      <g transform="translate(950, 140)">
        <rect width="90" height="60" fill="#ffffff" stroke="#6b7280" strokeWidth="2" />
        <text x="45" y="35" textAnchor="middle" className="text-base fill-gray-800">Image</text>
      </g>

      {/* Arrows between Gaussians and Projection/Density Control */}
      <line x1="470" y1="150" x2="530" y2="110" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <line x1="530" y1="130" x2="470" y2="170" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowhead-blue)" />

      <line x1="470" y1="210" x2="530" y2="240" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowhead-blue)" />
      <line x1="530" y1="220" x2="470" y2="190" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />

      {/* Arrows between Projection/Density Control and Rasterizer */}
      <line x1="690" y1="110" x2="740" y2="150" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <line x1="740" y1="170" x2="690" y2="130" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowhead-blue)" />

      <line x1="740" y1="200" x2="690" y2="240" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowhead-blue)" />

      {/* Arrows between Rasterizer and Image */}
      <line x1="900" y1="160" x2="940" y2="160" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <line x1="940" y1="180" x2="900" y2="180" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowhead-blue)" />

      {/* Legend */}
      <g transform="translate(740, 240)">
        <rect width="300" height="40" fill="#ffffff" stroke="#6b7280" strokeWidth="1" />
        <line x1="10" y1="20" x2="40" y2="20" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <text x="50" y="25" className="text-sm fill-gray-800">Operation Flow</text>
        
        <line x1="160" y1="20" x2="190" y2="20" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowhead-blue)" />
        <text x="200" y="25" className="text-sm fill-gray-800">Gradient Flow</text>
      </g>
    </svg>
  </div>
);

const Page15 = ({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) => {
  return (
    <motion.div 
      key="page15"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="relative z-10 w-full h-full flex flex-col items-center justify-center px-8"
    >
      {/* Top Text */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-12 flex items-center gap-4"
      >
        <span className="text-white">道路二：</span>
        <span className="text-[#FFE566]">直接构造属于ai的3d世界</span>
      </motion.div>

      {/* Diagram Container */}
      <div className="relative w-full max-w-5xl">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <GaussianSplattingDiagram />
        </motion.div>
        
        {/* Reflection */}
        <div 
          className="absolute top-full left-0 w-full h-40 bg-white/5 rounded-lg transform scale-y-[-1] blur-[2px] pointer-events-none"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 80%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 80%)'
          }}
        >
          <GaussianSplattingDiagram className="opacity-40" />
        </div>
      </div>

      {/* Bottom Text */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-20 md:mt-24 flex flex-col items-center gap-2 md:gap-4 text-center z-20"
      >
        <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
          用直接<span className="text-[#00E599]">Gaussian Splatting</span>做渲染
        </div>
        <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
          类似之前的“<span className="text-[#00E599]">元宇宙</span>”概念
        </div>
      </motion.div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 right-8 flex gap-4 z-50">
        <button 
          onClick={onPrev}
          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-[#00E599] hover:bg-[#00E599]/10 transition-all"
        >
          ←
        </button>
        <button 
          onClick={onNext}
          className="w-12 h-12 rounded-full border border-[#00E599]/50 flex items-center justify-center text-[#00E599] hover:bg-[#00E599] hover:text-black transition-all shadow-[0_0_15px_rgba(0,229,153,0.3)]"
        >
          →
        </button>
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
            <Page5 onPrev={handlePrevPage} onNext={handleNextPage} />
          )}
          {currentPage === 6 && (
            <Page6 onPrev={handlePrevPage} onNext={handleNextPage} />
          )}
          {currentPage === 7 && (
            <Page7 onPrev={handlePrevPage} onNext={handleNextPage} />
          )}
          {currentPage === 8 && (
            <Page8 onPrev={handlePrevPage} onNext={handleNextPage} />
          )}
          {currentPage === 9 && (
            <Page9 onPrev={handlePrevPage} onNext={handleNextPage} />
          )}
          {currentPage === 10 && (
            <Page10 onPrev={handlePrevPage} onNext={handleNextPage} />
          )}
          {currentPage === 11 && (
            <Page11 onPrev={handlePrevPage} onNext={handleNextPage} />
          )}
          {currentPage === 12 && (
            <Page12 onPrev={handlePrevPage} onNext={handleNextPage} />
          )}
          {currentPage === 13 && (
            <Page13 onPrev={handlePrevPage} onNext={handleNextPage} />
          )}
          {currentPage === 14 && (
            <Page14 onPrev={handlePrevPage} onNext={handleNextPage} />
          )}
          {currentPage === 15 && (
            <Page15 onPrev={handlePrevPage} onNext={handleNextPage} />
          )}
          {currentPage > 15 && (
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
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className="group relative flex items-center justify-end"
          >
            <span className={`mr-4 text-[10px] font-mono tracking-tighter transition-all duration-300 ${currentPage === pageNum ? 'text-[#00E599] opacity-100' : 'text-white/20 opacity-0 group-hover:opacity-100'}`}>
              {pageNum < 10 ? `0${pageNum}` : pageNum}
            </span>
            <div className={`w-2 h-2 rounded-full border transition-all duration-500 ${currentPage === pageNum ? 'bg-[#00E599] border-[#00E599] scale-125 shadow-[0_0_10px_#00E599]' : 'bg-transparent border-white/30 hover:border-[#00E599]'}`} />
          </button>
        ))}
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .mask-reflection {
          mask-image: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 70%);
          -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 70%);
        }
      `}</style>
    </div>
  );
}
