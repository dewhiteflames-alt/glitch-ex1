document.addEventListener('DOMContentLoaded', () => {

  // ===================================================
  // NAVBAR SCROLL EFFECT
  // ===================================================
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ===================================================
  // ACTIVE NAV LINKS ON SCROLL
  // ===================================================
  const navItems = document.querySelectorAll('.nav__item');
  const sections = document.querySelectorAll('section[id]');
  
  if (navItems.length && sections.length) {
    const navIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navItems.forEach(a => a.classList.remove('active'));
          const activeLink = document.querySelector(`.nav__item[href="#${e.target.id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    }, { threshold: 0.2 });
    
    sections.forEach(s => navIO.observe(s));
  }

  // ===================================================
  // SCROLL REVEAL ANIMATIONS (Intersection Observer)
  // ===================================================
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Stagger children if needed
          const staggerItems = entry.target.querySelectorAll('.project-featured, .stack-item');
          staggerItems.forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.05}s`;
            child.classList.add('visible');
          });
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
    
    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });
  }

  // Fallback for elements already in viewport
  setTimeout(() => {
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) heroContent.classList.add('visible');
  }, 100);

  // ===================================================
  // CUSTOM MOUSE CURSOR PHYSICS
  // ===================================================
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');
  
  if (cursor && cursorRing) {
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let cursorVisible = false;
    
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Make cursor visible on first move
      if (!cursorVisible) {
        cursor.style.opacity = '1';
        cursorRing.style.opacity = '1';
        cursorVisible = true;
      }
      
      // Target dot positions instantly
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });
    
    // Physics loop using requestAnimationFrame (Linear Interpolation)
    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;
    
    const animateCursorRing = () => {
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);
      
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      
      requestAnimationFrame(animateCursorRing);
    };
    animateCursorRing();
    
    // Hide default cursor when leaving the window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursorRing.style.opacity = '0';
      cursorVisible = false;
    });

    // Custom Cursor expansion on hover over interactive elements
    const updateHovers = () => {
      const hoverElements = document.querySelectorAll(
        'a, button, input, textarea, .tilt-card, .stack-pill, .nav__brand, .project-featured, .contact-links a'
      );
      
      hoverElements.forEach(el => {
        // Avoid duplicate event listeners
        if (el.dataset.hasCursorHover) return;
        el.dataset.hasCursorHover = 'true';
        
        el.addEventListener('mouseenter', () => {
          document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
          document.body.classList.remove('cursor-hover');
        });
      });
    };
    updateHovers();
    
    // Watch for new DOM elements
    const observer = new MutationObserver(updateHovers);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // ===================================================
  // MAGNETIC BUTTON EFFECT
  // ===================================================
  const magneticElements = document.querySelectorAll('.mag-btn');
  
  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      // Mouse position relative to center of element
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Magnetic pull: offset element by 25% of mouse distance from center
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    
    el.addEventListener('mouseleave', () => {
      // Smoothly return back to original position
      el.style.transform = 'translate(0, 0)';
    });
  });

  // ===================================================
  // 3D CARD TILT EFFECT
  // ===================================================
  const tiltCards = document.querySelectorAll('.tilt-card');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      // Mouse position within card
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Normalize from -0.5 to 0.5
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      const dx = (x - xc) / xc;
      const dy = (y - yc) / yc;
      
      // Apply perspective 3D rotation based on mouse coordinates
      // Multiplier limits maximum rotation angle to +/- 8 degrees
      card.style.transform = `perspective(800px) rotateX(${dy * -8}deg) rotateY(${dx * 8}deg) translateZ(8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      // Smoothly reset transformations on leave
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
  });

  // ===================================================
  // COUNTER/COUNT-UP ANIMATION FOR HERO STATS
  // ===================================================
  const counterElements = document.querySelectorAll('.hero__stat-num');
  if (counterElements.length) {
    const startCounterAnimation = (el) => {
      const targetVal = parseInt(el.getAttribute('data-target') || '0', 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1200; // total duration of the count-up in ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Quad easeOut function for a premium, organic slowing-down effect
        const easeOutQuad = progress * (2 - progress);
        const currentCount = Math.floor(easeOutQuad * targetVal);

        el.textContent = currentCount + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          el.textContent = targetVal + suffix;
        }
      };

      requestAnimationFrame(updateCount);
    };

    // Use IntersectionObserver to start counting only when statistics scroll into view
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
          setTimeout(() => {
            startCounterAnimation(entry.target);
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

});
