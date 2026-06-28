/* SCRIPT.JS - MAYUU's UNIVERSE */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. DOM Elements & State Setup
  // ==========================================================================
  const appContainer = document.getElementById('app-container');
  
  // Screen elements
  const screenOpening = document.getElementById('screen-opening');
  const screenAwakening = document.getElementById('screen-awakening');
  const screenJourney = document.getElementById('screen-journey');
  const screenMoon = document.getElementById('screen-moon');
  const screenEnding = document.getElementById('screen-ending');

  // Interactive buttons & prompts
  const centralStar = document.getElementById('central-star');
  const enterBtn = document.getElementById('enter-btn');
  const revealBtn = document.getElementById('reveal-btn');
  const endingTriggerBtn = document.getElementById('ending-trigger-btn');
  const replayBtn = document.getElementById('replay-btn');
  
  // Moon items
  const glowMoon = document.getElementById('glow-moon');
  const moonRevealedImg = document.getElementById('moon-revealed-img');
  const moonPromptContainer = document.getElementById('moon-prompt-container');
  const finalMessageContainer = document.getElementById('final-message-container');
  const glowingHeartBox = document.getElementById('glowing-heart-container');

  // Journey planet slides
  const slides = document.querySelectorAll('.journey-slide');
  let currentSlideIndex = 0;

  // Photo Gallery State
  const photoUrls = [
    'mayuu1.jpg', 'mayuu2.jpg', 'mayuu3.jpg', 'mayuu4.jpg', 'mayuu5.jpg',
    'mayuu6.jpg', 'mayuu7.jpg', 'mayuu8.jpg', 'mayuu9.jpg', 'mayuu10.jpg'
  ];
  let currentPhotoIndex = 0;

  // Particle Canvas Setup
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let particleMode = 'opening'; // 'opening', 'awakening', 'warp', 'strength', 'kindness', 'smile', 'dreams', 'moon', 'morph-letters', 'morph-heart'
  let warpFactor = 0; // Speed warp multiplier
  let warpActive = false;

  // Touch Ripples
  let ripples = [];

  // ==========================================================================
  // 2. Floating Canvas Particle System (Optimized for performance)
  // ==========================================================================
  
  class Particle {
    constructor(type = 'star', customX, customY) {
      this.type = type; // 'star', 'butterfly', 'flower', 'heart', 'firefly', 'shooting-star', 'glow-dust'
      
      this.x = customX !== undefined ? customX : Math.random() * canvas.width;
      this.y = customY !== undefined ? customY : Math.random() * canvas.height;
      this.size = Math.random() * 2.2 + 0.8;
      
      this.speedX = Math.random() * 0.1 - 0.05;
      this.speedY = -(Math.random() * 0.35 + 0.05); // Float up
      this.alpha = Math.random() * 0.7 + 0.3;
      
      // Swing movement
      this.swingAmount = Math.random() * 0.3 + 0.1;
      this.swingSpeed = Math.random() * 0.02 + 0.005;
      this.swingAngle = Math.random() * Math.PI * 2;
      
      // Rotations
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = Math.random() * 0.02 - 0.01;

      // Special particle configurations
      if (this.type === 'butterfly') {
        this.size = Math.random() * 8 + 5;
        this.speedY = -(Math.random() * 0.6 + 0.3);
        this.flapSpeed = Math.random() * 0.14 + 0.06;
        this.flap = Math.random() * Math.PI;
      } else if (this.type === 'flower') {
        this.size = Math.random() * 7 + 5;
        this.speedY = -(Math.random() * 0.4 + 0.15);
        this.color = ['#ffb3c1', '#ffc6ff', '#e8dbfc', '#ffe5ec'][Math.floor(Math.random() * 4)];
      } else if (this.type === 'firefly') {
        this.size = Math.random() * 3 + 1;
        this.speedY = -(Math.random() * 0.5 + 0.2);
        this.pulseSpeed = Math.random() * 0.05 + 0.01;
        this.pulseAngle = Math.random() * Math.PI;
      } else if (this.type === 'heart') {
        this.size = Math.random() * 10 + 5;
        this.speedY = -(Math.random() * 0.8 + 0.3);
      } else if (this.type === 'glow-dust') {
        this.size = Math.random() * 12 + 8;
        this.speedY = -(Math.random() * 0.2 + 0.05);
        this.alpha = Math.random() * 0.12 + 0.04;
      }

      // Morphing parameters
      this.targetX = null;
      this.targetY = null;
      this.mode = 'float'; // 'float' or 'morph'
    }

    update() {
      if (this.mode === 'morph' && this.targetX !== null && this.targetY !== null) {
        // Snappier easing (0.09) to morph faster
        this.x += (this.targetX - this.x) * 0.09;
        this.y += (this.targetY - this.y) * 0.09;
        this.rotation += this.rotationSpeed * 0.5;
        this.alpha = 0.95;
        return;
      }

      // Warp Hyperdrive
      if (warpActive) {
        const dx = this.x - canvas.width / 2;
        const dy = this.y - canvas.height / 2;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        
        this.x += (dx / dist) * (warpFactor * 0.22);
        this.y += (dy / dist) * (warpFactor * 0.22);
        this.alpha += 0.05;

        if (this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) {
          this.x = canvas.width / 2 + (Math.random() * 40 - 20);
          this.y = canvas.height / 2 + (Math.random() * 40 - 20);
          this.size = Math.random() * 1.5 + 0.5;
          this.alpha = 0.1;
        }
        return;
      }

      // Normal Float
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.swingAngle) * this.swingAmount;
      this.swingAngle += this.swingSpeed;
      this.rotation += this.rotationSpeed;

      if (this.type === 'butterfly') {
        this.flap += this.flapSpeed;
      } else if (this.type === 'firefly') {
        this.pulseAngle += this.pulseSpeed;
        this.alpha = Math.max(0.2, Math.abs(Math.sin(this.pulseAngle)) * 0.8);
      }

      if (this.y < -30 || this.x < -30 || this.x > canvas.width + 30) {
        this.y = canvas.height + 30;
        this.x = Math.random() * canvas.width;
        this.alpha = Math.random() * 0.6 + 0.2;
      }
    }

    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      if (this.type === 'star') {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      } 
      else if (this.type === 'butterfly') {
        ctx.fillStyle = 'rgba(232, 219, 252, 0.85)';
        ctx.beginPath();
        ctx.ellipse(-this.size/2, 0, this.size/2, this.size * (0.7 + 0.3 * Math.sin(this.flap)), Math.PI/6, 0, Math.PI * 2);
        ctx.ellipse(this.size/2, 0, this.size/2, this.size * (0.7 + 0.3 * Math.sin(this.flap)), -Math.PI/6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#2f205c';
        ctx.beginPath();
        ctx.ellipse(0, 0, 1.0, this.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
      } 
      else if (this.type === 'flower') {
        ctx.fillStyle = this.color;
        const r = this.size / 2;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5;
          ctx.arc(Math.cos(angle) * r, Math.sin(angle) * r, r * 0.7, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.fillStyle = '#fff4a3';
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2);
        ctx.fill();
      } 
      else if (this.type === 'firefly') {
        const radialGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, this.size * 2.5);
        radialGrad.addColorStop(0, 'rgba(255, 225, 120, 1)');
        radialGrad.addColorStop(0.3, 'rgba(255, 210, 80, 0.4)');
        radialGrad.addColorStop(1, 'rgba(255, 210, 80, 0)');
        ctx.fillStyle = radialGrad;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
      } 
      else if (this.type === 'heart') {
        ctx.fillStyle = '#ff758c';
        ctx.beginPath();
        const r = this.size / 2;
        ctx.moveTo(0, r * 0.3);
        ctx.bezierCurveTo(0, -r * 0.3, -r * 0.8, -r * 0.3, -r, r * 0.2);
        ctx.bezierCurveTo(-r, r * 0.7, -r * 0.2, r * 1.2, 0, r * 1.6);
        ctx.bezierCurveTo(r * 0.2, r * 1.2, r, r * 0.7, r, r * 0.2);
        ctx.bezierCurveTo(r, -r * 0.3, r * 0.8, -r * 0.3, 0, r * 0.3);
        ctx.fill();
      } 
      else if (this.type === 'glow-dust') {
        const radialGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, this.size);
        let color = 'rgba(0, 210, 255, ';
        if (particleMode === 'kindness') color = 'rgba(255, 117, 140, ';
        else if (particleMode === 'smile') color = 'rgba(245, 175, 25, ';
        else if (particleMode === 'dreams') color = 'rgba(138, 35, 135, ';
        else if (particleMode === 'moon') color = 'rgba(255, 240, 200, ';
        
        radialGrad.addColorStop(0, color + '0.6)');
        radialGrad.addColorStop(1, color + '0)');
        ctx.fillStyle = radialGrad;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Shooting stars
  let shootingStars = [];
  function addShootingStar() {
    shootingStars.push({
      x: Math.random() * (canvas.width * 0.5),
      y: Math.random() * (canvas.height * 0.3),
      speedX: Math.random() * 5 + 4,
      speedY: Math.random() * 2.5 + 2,
      len: Math.random() * 50 + 35,
      alpha: 1.0,
      w: Math.random() * 1.2 + 0.6
    });
  }

  // Constellations links in awakening
  function drawConstellations() {
    if (particleMode !== 'awakening') return;
    ctx.strokeStyle = 'rgba(195, 166, 255, 0.08)';
    ctx.lineWidth = 0.8;
    
    const starCount = Math.min(22, particles.length);
    for (let i = 0; i < starCount; i++) {
      for (let j = i + 1; j < starCount; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        
        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  }

  // Resize canvas & populate base stars (reduced count for smooth mobile performance)
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    if (particles.length === 0) {
      // Lowered from 65 to 25 to reduce GPU overhead
      const pCount = Math.min(25, Math.floor(window.innerWidth / 13));
      for (let i = 0; i < pCount; i++) {
        particles.push(new Particle('star'));
      }
    }
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Screen click ripples
  function drawRipples() {
    ripples.forEach((r) => {
      ctx.save();
      ctx.strokeStyle = `rgba(195, 166, 255, ${r.alpha})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Snappier expansion and fade out
      r.r += 6;
      r.alpha -= 0.025;
    });

    ripples = ripples.filter(r => r.alpha > 0);
  }

  // Canvas Frame loop
  function animateCanvas() {
    if (warpActive) {
      ctx.fillStyle = 'rgba(7, 5, 18, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Spawn Nebulas/Glow Dust in chapters
    if (['strength', 'kindness', 'smile', 'dreams', 'moon'].includes(particleMode)) {
      if (particles.filter(p => p.type === 'glow-dust').length < 5) {
        particles.push(new Particle('glow-dust'));
      }
    }

    // Spawn slide-specific elements (reduced counts)
    if (particleMode === 'kindness') {
      if (particles.filter(p => p.type === 'butterfly').length < 2) {
        particles.push(new Particle('butterfly'));
      }
      if (particles.filter(p => p.type === 'flower').length < 3) {
        particles.push(new Particle('flower'));
      }
    } else if (particleMode === 'smile') {
      if (particles.filter(p => p.type === 'firefly').length < 4) {
        particles.push(new Particle('firefly'));
      }
    } else if (particleMode === 'morph-heart') {
      if (particles.filter(p => p.type === 'heart').length < 4) {
        particles.push(new Particle('heart'));
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    shootingStars.forEach(ss => {
      ctx.save();
      const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.len, ss.y - ss.len * 0.5);
      grad.addColorStop(0, `rgba(255, 255, 255, ${ss.alpha})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.strokeStyle = grad;
      ctx.lineWidth = ss.w;
      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(ss.x - ss.len, ss.y - ss.len * 0.5);
      ctx.stroke();
      ctx.restore();

      ss.x += ss.speedX;
      ss.y += ss.speedY;
      ss.alpha -= 0.035;
    });
    shootingStars = shootingStars.filter(ss => ss.alpha > 0);

    drawConstellations();
    drawRipples();

    if (warpActive) {
      warpFactor += 0.8;
      if (warpFactor > 60) warpFactor = 60;
    } else {
      warpFactor -= 1.5;
      if (warpFactor < 0) warpFactor = 0;
    }

    requestAnimationFrame(animateCanvas);
  }
  requestAnimationFrame(animateCanvas);

  // Trigger shooting stars
  setInterval(() => {
    if (particleMode !== 'opening') {
      addShootingStar();
    }
  }, 10000);

  // ==========================================================================
  // 3. Star Morphing Text & Heart Engines (Optimized Scanner)
  // ==========================================================================

  function getTextMorphCoords(text, size = 36) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    tempCanvas.width = 380;
    tempCanvas.height = 100;
    
    tempCtx.fillStyle = '#000';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    tempCtx.font = `bold ${size}px Playfair Display, serif`;
    tempCtx.fillStyle = '#fff';
    tempCtx.textAlign = 'center';
    tempCtx.textBaseline = 'middle';
    tempCtx.fillText(text, tempCanvas.width / 2, tempCanvas.height / 2);
    
    const data = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
    const coords = [];
    const step = 4; // Increased from 3 to 4 to reduce coordinate calculations

    for (let y = 0; y < tempCanvas.height; y += step) {
      for (let x = 0; x < tempCanvas.width; x += step) {
        const idx = (y * tempCanvas.width + x) * 4;
        if (data[idx] > 128) {
          coords.push({
            x: x - tempCanvas.width / 2,
            y: y - tempCanvas.height / 2
          });
        }
      }
    }
    return coords;
  }

  function getHeartMorphCoords(size = 75) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    tempCanvas.width = 200;
    tempCanvas.height = 200;
    
    tempCtx.fillStyle = '#000';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    const cx = tempCanvas.width / 2;
    const cy = tempCanvas.height / 2 - 10;
    
    tempCtx.beginPath();
    tempCtx.moveTo(cx, cy + size * 0.3);
    tempCtx.bezierCurveTo(cx, cy - size * 0.3, cx - size * 0.8, cy - size * 0.3, cx - size, cy + size * 0.2);
    tempCtx.bezierCurveTo(cx - size, cy + size * 0.7, cx - size * 0.2, cy + size * 1.2, cx, cy + size * 1.6);
    tempCtx.bezierCurveTo(cx + size * 0.2, cy + size * 1.2, cx + size, cy + size * 0.7, cx + size, cy + size * 0.2);
    tempCtx.bezierCurveTo(cx + size, cy - size * 0.3, cx + size * 0.8, cy - size * 0.3, cx, cy + size * 0.3);
    tempCtx.fillStyle = '#fff';
    tempCtx.fill();
    
    const data = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
    const coords = [];
    const step = 4; // Increased from 3 to 4

    for (let y = 0; y < tempCanvas.height; y += step) {
      for (let x = 0; x < tempCanvas.width; x += step) {
        const idx = (y * tempCanvas.width + x) * 4;
        if (data[idx] > 128) {
          coords.push({
            x: x - tempCanvas.width / 2,
            y: y - tempCanvas.height / 2
          });
        }
      }
    }
    return coords;
  }

  function triggerMorph(targetCoords) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 - 40;
    
    shuffleArray(targetCoords);

    const stars = particles.filter(p => p.type === 'star');
    
    let i = 0;
    for (; i < Math.min(stars.length, targetCoords.length); i++) {
      stars[i].targetX = centerX + targetCoords[i].x;
      stars[i].targetY = centerY + targetCoords[i].y;
      stars[i].mode = 'morph';
    }

    if (i < targetCoords.length) {
      for (; i < targetCoords.length; i++) {
        const spawnEdge = Math.floor(Math.random() * 4);
        let sx, sy;
        if (spawnEdge === 0) { sx = -10; sy = Math.random() * canvas.height; }
        else if (spawnEdge === 1) { sx = canvas.width + 10; sy = Math.random() * canvas.height; }
        else if (spawnEdge === 2) { sx = Math.random() * canvas.width; sy = -10; }
        else { sx = Math.random() * canvas.width; sy = canvas.height + 10; }
        
        const p = new Particle('star', sx, sy);
        p.targetX = centerX + targetCoords[i].x;
        p.targetY = centerY + targetCoords[i].y;
        p.mode = 'morph';
        p.alpha = 0;
        particles.push(p);
      }
    } 
    else if (i < stars.length) {
      for (; i < stars.length; i++) {
        stars[i].mode = 'float';
        stars[i].targetX = null;
        stars[i].targetY = null;
      }
    }
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // ==========================================================================
  // 4. Cinematic Transitions & Timing (Accelerated)
  // ==========================================================================
  
  // 1. Opening text reveals
  setTimeout(() => {
    document.getElementById('op-text-1').classList.add('reveal');
    setTimeout(() => {
      document.getElementById('op-text-2').classList.add('reveal');
    }, 700); // Shorter pause
  }, 200);

  // 2. Star click -> Cosmic Awakening
  centralStar.addEventListener('click', () => {
    ripples.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2 - 50,
      r: 0,
      maxR: Math.max(canvas.width, canvas.height) * 0.7,
      alpha: 1
    });

    particleMode = 'awakening';
    screenOpening.classList.remove('active');
    screenAwakening.classList.add('active');

    // Snappier text reveal gaps
    setTimeout(() => {
      document.getElementById('story-line-1').classList.add('reveal');
      setTimeout(() => {
        document.getElementById('story-line-2').classList.add('reveal');
        setTimeout(() => {
          document.getElementById('story-line-3').classList.add('reveal');
          setTimeout(() => {
            enterBtn.classList.add('reveal');
          }, 600); // Faster reveal
        }, 500);
      }, 500);
    }, 300);
  });

  // 3. Enter -> Warp transition
  enterBtn.addEventListener('click', () => {
    warpActive = true;
    particleMode = 'warp';
    
    screenAwakening.style.transform = 'scale(0.7)';
    screenAwakening.style.opacity = '0';
    
    setTimeout(() => {
      warpActive = false;
      screenAwakening.classList.remove('active');
      screenJourney.classList.add('active');
      
      currentSlideIndex = 0;
      loadChapterSlide(0);
    }, 900); // Speed up transition time from 1.8s to 0.9s
  });

  // 4. Slide chapter animator
  function loadChapterSlide(index) {
    const activeSlide = slides[index];
    
    activeSlide.querySelectorAll('.chapter-line').forEach(el => el.classList.remove('reveal'));
    activeSlide.querySelector('.photo-frame').classList.remove('reveal');
    activeSlide.querySelector('.slide-next-btn').classList.remove('reveal');

    const planetTypes = ['strength', 'kindness', 'smile', 'dreams'];
    particleMode = planetTypes[index];

    activeSlide.querySelectorAll('.chapter-line').forEach(line => {
      const delay = parseFloat(line.dataset.delay) * 1000;
      setTimeout(() => {
        line.classList.add('reveal');
        const rect = line.getBoundingClientRect();
        if (rect.top > 0) spawnParticlesAtPos(canvas.width / 2, rect.top + rect.height / 2, 'firefly', 1);
      }, delay);
    });

    const photoFrame = activeSlide.querySelector('.photo-frame');
    const photoDelay = parseFloat(photoFrame.dataset.delay) * 1000;
    setTimeout(() => {
      photoFrame.classList.add('reveal');
      const rect = photoFrame.getBoundingClientRect();
      spawnParticlesAtPos(rect.left + rect.width/2, rect.top + rect.height/2, 'firefly', 3);
    }, photoDelay);

    const nextBtn = activeSlide.querySelector('.slide-next-btn');
    const buttonDelay = parseFloat(nextBtn.dataset.delay) * 1000;
    setTimeout(() => {
      nextBtn.classList.add('reveal');
    }, buttonDelay);
  }

  // Continue triggers
  const nextSlideBtns = document.querySelectorAll('.slide-next-btn');
  nextSlideBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      if (idx === slides.length - 1) {
        transitionToMoon();
      } else {
        const currentSlide = slides[currentSlideIndex];
        currentSlide.classList.add('slide-zoom-out');
        
        setTimeout(() => {
          currentSlide.classList.remove('active', 'slide-zoom-out');
          currentSlideIndex++;
          slides[currentSlideIndex].classList.add('active');
          loadChapterSlide(currentSlideIndex);
        }, 300); // Shorter transition timeout
      }
    });
  });

  function spawnParticlesAtPos(x, y, type = 'star', count = 5) {
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(type, x, y));
    }
  }

  // 5. Slides -> Moon
  function transitionToMoon() {
    screenJourney.style.transform = 'scale(0.85)';
    screenJourney.style.opacity = '0';
    addShootingStar();
    
    setTimeout(() => {
      screenJourney.classList.remove('active');
      screenMoon.classList.add('active');
      particleMode = 'moon';
    }, 400); // Faster screen load (0.4s)
  }

  // 6. Moon Photo Reveal
  revealBtn.addEventListener('click', () => {
    glowMoon.classList.add('zoomed');
    moonPromptContainer.classList.add('fade-out');
    moonRevealedImg.style.opacity = '0.9';

    const rect = glowMoon.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    
    spawnParticlesAtPos(cx, cy, 'firefly', 10);

    setTimeout(() => {
      moonPromptContainer.style.display = 'none';
      finalMessageContainer.classList.remove('hidden');
      
      setTimeout(() => {
        finalMessageContainer.classList.add('reveal');
        revealFinalLines();
      }, 150);
    }, 800); // Fast content display (0.8s instead of 1.2s)
  });

  // Photo gallery cycling
  glowMoon.addEventListener('click', () => {
    if (moonRevealedImg.style.opacity !== '0.9') return;
    
    currentPhotoIndex = (currentPhotoIndex + 1) % photoUrls.length;
    
    moonRevealedImg.style.opacity = '0';
    setTimeout(() => {
      moonRevealedImg.src = photoUrls[currentPhotoIndex];
      moonRevealedImg.style.opacity = '0.9';
      
      const rect = glowMoon.getBoundingClientRect();
      spawnParticlesAtPos(rect.left + rect.width/2, rect.top + rect.height/2, 'firefly', 4);
    }, 200);
  });

  // Reveal final letter lines step-by-step
  function revealFinalLines() {
    const lines = finalMessageContainer.querySelectorAll('.final-line');
    const scrollContainer = document.querySelector('.moon-journey-wrapper');

    lines.forEach(line => {
      const delay = parseFloat(line.dataset.delay) * 1000;
      
      setTimeout(() => {
        line.classList.add('reveal');
        
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        });
        
        const rect = line.getBoundingClientRect();
        if (rect.top > 0) {
          spawnParticlesAtPos(canvas.width / 2, rect.top + rect.height / 2, 'firefly', 1);
        }
      }, delay);
    });

    // Reveal Heart Box
    const heartDelay = 4.2 * 1000; // Snappy (4.2s) matching index.html delays
    setTimeout(() => {
      glowingHeartBox.classList.remove('hidden');
      
      const rect = glowingHeartBox.getBoundingClientRect();
      spawnParticlesAtPos(canvas.width / 2, rect.top + rect.height / 2, 'firefly', 4);
      
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: 'smooth'
      });
      
      setTimeout(() => {
        endingTriggerBtn.classList.remove('hidden');
      }, 400);
    }, heartDelay);
  }

  // 7. Moon -> Ending
  endingTriggerBtn.addEventListener('click', () => {
    screenMoon.style.transform = 'scale(0.85)';
    screenMoon.style.opacity = '0';

    // Hide music control button during video playback
    if (musicToggleBtn) {
      musicToggleBtn.classList.remove('reveal');
    }

    // Fade out background music so the video's audio is clean
    if (bgMusic) {
      let fadeOutInterval = setInterval(() => {
        if (bgMusic.volume > 0.02) {
          bgMusic.volume -= 0.02;
        } else {
          clearInterval(fadeOutInterval);
          bgMusic.pause();
        }
      }, 50);
    }

    // Cinematic Transition: Galaxy Portal expands
    const portal = document.getElementById('cinematic-portal');
    const climaxContainer = document.getElementById('video-climax-container');
    const climaxVideo = document.getElementById('climax-video');

    if (portal && climaxContainer && climaxVideo) {
      portal.classList.remove('fade-out');
      portal.classList.add('active');

      setTimeout(() => {
        screenMoon.classList.remove('active');
        climaxContainer.classList.add('active');
        
        // Auto-play the video climax (try with sound first)
        climaxVideo.muted = false;
        climaxVideo.currentTime = 0;
        climaxVideo.play().catch(err => {
          console.log("Video auto-play with sound blocked, trying muted fallback:", err);
          climaxVideo.muted = true;
          climaxVideo.play().catch(e => console.log(e));
        });

        setTimeout(() => {
          portal.classList.add('fade-out');
        }, 300);

      }, 1000); // trigger mid-way through the portal expansion
    } else {
      transitionFromClimaxToEnding();
    }
  });

  function transitionFromClimaxToEnding() {
    const portal = document.getElementById('cinematic-portal');
    const climaxContainer = document.getElementById('video-climax-container');
    const climaxVideo = document.getElementById('climax-video');

    if (climaxVideo) climaxVideo.pause();
    if (climaxContainer) climaxContainer.classList.remove('active');
    if (portal) portal.classList.remove('active', 'fade-out');

    // Start playing background music softly (trimmed to main lyrics)
    if (bgMusic) {
      bgMusic.volume = 0.15;
      bgMusic.muted = false;
      bgMusic.currentTime = 0;
      bgMusic.play().catch(err => {
        console.log("Audio auto-play blocked or failed:", err);
      });
    }

    // Reveal music button
    if (musicToggleBtn) {
      musicToggleBtn.classList.remove('muted');
      musicToggleBtn.classList.add('reveal');
    }

    // Start floating photos
    startFloatingPhotos();

    // Show ending screen
    screenEnding.classList.add('active');
    
    particleMode = 'morph-letters';
    const textCoords = getTextMorphCoords("MAYUU", 52);
    triggerMorph(textCoords);

    setTimeout(() => {
      document.getElementById('ending-keep-smiling').classList.add('reveal');
      
      setTimeout(() => {
        particleMode = 'morph-heart';
        const heartCoords = getHeartMorphCoords(75);
        triggerMorph(heartCoords);
        
        setTimeout(() => {
          document.getElementById('ending-credits').classList.add('reveal');
        }, 1200);
        
      }, 2200); // Snappier morph transitions

    }, 2000);
  }

  // Hook up climax video event listeners
  const climaxVideoEl = document.getElementById('climax-video');
  const skipClimaxBtn = document.getElementById('skip-climax-btn');
  if (climaxVideoEl) {
    climaxVideoEl.addEventListener('ended', transitionFromClimaxToEnding);
  }
  if (skipClimaxBtn) {
    skipClimaxBtn.addEventListener('click', transitionFromClimaxToEnding);
  }

  // Replay surprise setup
  replayBtn.addEventListener('click', () => {
    currentSlideIndex = 0;
    currentPhotoIndex = 0;
    particleMode = 'opening';
    
    // Reset climax video elements
    const portal = document.getElementById('cinematic-portal');
    const climaxContainer = document.getElementById('video-climax-container');
    const climaxVideo = document.getElementById('climax-video');
    if (climaxVideo) {
      climaxVideo.pause();
      climaxVideo.currentTime = 0;
    }
    if (climaxContainer) climaxContainer.classList.remove('active');
    if (portal) portal.classList.remove('active', 'fade-out');

    // Stop floating photos
    stopFloatingPhotos();

    // Hide music control and fade out music
    if (musicToggleBtn) {
      musicToggleBtn.classList.remove('reveal');
      musicToggleBtn.classList.remove('muted');
    }
    if (bgMusic) {
      let fadeInterval = setInterval(() => {
        if (bgMusic.volume > 0.02) {
          bgMusic.volume -= 0.02;
        } else {
          clearInterval(fadeInterval);
          bgMusic.pause();
          bgMusic.currentTime = 0;
          bgMusic.volume = 0.15;
          bgMusic.muted = false;
        }
      }, 50);
    }

    particles.forEach(p => {
      p.mode = 'float';
      p.targetX = null;
      p.targetY = null;
      p.type = 'star';
    });
    
    moonRevealedImg.src = 'mayuu1.jpg';
    moonRevealedImg.style.opacity = '0';
    glowMoon.classList.remove('zoomed');
    
    moonPromptContainer.style.display = 'block';
    moonPromptContainer.classList.remove('fade-out');
    finalMessageContainer.classList.add('hidden');
    finalMessageContainer.classList.remove('reveal');
    glowingHeartBox.classList.add('hidden');
    endingTriggerBtn.classList.add('hidden');
    
    document.querySelectorAll('.final-line').forEach(el => el.classList.remove('reveal'));
    
    slides.forEach(slide => slide.classList.remove('active', 'slide-zoom-out'));
    slides[0].classList.add('active');

    document.getElementById('ending-keep-smiling').classList.remove('reveal');
    document.getElementById('ending-credits').classList.remove('reveal');

    screenJourney.style.transform = 'scale(1)';
    screenJourney.style.opacity = '1';
    screenMoon.style.transform = 'scale(1)';
    screenMoon.style.opacity = '1';

    screenEnding.classList.remove('active');
    screenOpening.classList.add('active');
  });

  // ==========================================================================
  // 5. Background Music & Floating Polaroid Photos System
  // ==========================================================================
  const bgMusic = document.getElementById('bg-music');
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  let floatInterval = null;

  function startFloatingPhotos() {
    const container = document.getElementById('floating-photos-container');
    if (!container) return;
    container.innerHTML = '';
    
    const photos = [
      'mayuu1.jpg', 'mayuu2.jpg', 'mayuu3.jpg', 'mayuu4.jpg', 'mayuu5.jpg',
      'mayuu6.jpg', 'mayuu7.jpg', 'mayuu8.jpg', 'mayuu9.jpg', 'mayuu10.jpg'
    ];
    
    function spawn() {
      const frame = document.createElement('div');
      frame.className = 'floating-photo-frame';
      
      const img = document.createElement('img');
      // Pick a random photo from the pool of 10 photos to cycle infinitely and organically
      const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
      img.src = randomPhoto;
      frame.appendChild(img);
      
      // Randomize properties with 3D Depth
      const left = Math.random() * 80 + 10; // 10% to 90%
      const depth = Math.random(); // 0 (background) to 1 (foreground)
      
      const width = 100 + depth * 40; // 100px to 140px
      const duration = 24 - depth * 11; // 24s (slow background) to 13s (fast foreground)
      const zIndex = Math.floor(5 + depth * 10); // z-index 5 to 15
      const blurVal = (1 - depth) * 1.5; // background is slightly blurry
      const opacityVal = 0.35 + depth * 0.55; // background is translucent
      
      const rotStart = Math.random() * 20 - 10; // -10deg to 10deg
      const rotMid = Math.random() * 30 - 15; // -15deg to 15deg
      const rotEnd = Math.random() * 20 - 10;
      const sway = Math.random() * 60 - 30; // -30px to 30px horizontal drift
      
      frame.style.left = `${left}%`;
      frame.style.width = `${width}px`;
      frame.style.zIndex = zIndex;
      frame.style.opacity = opacityVal;
      if (blurVal > 0.4) {
        frame.style.filter = `blur(${blurVal}px)`;
      }
      
      frame.style.setProperty('--duration', `${duration}s`);
      frame.style.setProperty('--rot-start', `${rotStart}deg`);
      frame.style.setProperty('--rot-mid', `${rotMid}deg`);
      frame.style.setProperty('--rot-end', `${rotEnd}deg`);
      frame.style.setProperty('--sway', `${sway}px`);
      
      container.appendChild(frame);
      
      // Remove element after animation completes to avoid memory leak
      setTimeout(() => {
        frame.remove();
      }, duration * 1000);
    }
    
    // Spawn initial set
    for (let i = 0; i < 6; i++) {
      setTimeout(spawn, i * 1200);
    }
    
    // Continuously spawn faster for a denser, never-ending visual flow
    floatInterval = setInterval(spawn, 2200);
  }

  function stopFloatingPhotos() {
    if (floatInterval) {
      clearInterval(floatInterval);
      floatInterval = null;
    }
    const container = document.getElementById('floating-photos-container');
    if (container) container.innerHTML = '';
  }

  // Music toggle button listener
  if (musicToggleBtn && bgMusic) {
    musicToggleBtn.addEventListener('click', () => {
      bgMusic.muted = !bgMusic.muted;
      if (bgMusic.muted) {
        musicToggleBtn.classList.add('muted');
      } else {
        musicToggleBtn.classList.remove('muted');
        if (bgMusic.paused) {
          bgMusic.play().catch(e => console.log(e));
        }
      }
    });
  }

});
