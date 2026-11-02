/**
 * ====================================================================
 * Modern Vanilla JavaScript for Premium AI Tutorial Website
 * High-performance, accessible, dependency-free interactive engine.
 *
 * TABLE OF CONTENTS:
 *  1. DOMContentLoaded Bootstrapper & Initialization
 *  2. Scroll Progress Bar (#scroll-progress)
 *  3. Scroll Reveal Animations (.reveal, data-reveal, data-stagger)
 *  4. Hero Title Typing Effect (#hero-title)
 *  5. 60fps Smooth Parallax Effect (.parallax-bg)
 *  6. Sticky Navigation & Scroll Spy (#navbar)
 *  7. Dynamic Tab System (.tab-container, .tab-btn, .tab-content)
 *  8. Accordion Expandable Cards (.expandable-card)
 *  9. Clipboard Code Copy System (.code-block, .copy-btn)
 * 10. Eased Numeric Counter Animation (.counter, data-target)
 * 11. Hero Particle Network Canvas (#particles-canvas)
 * 12. Mobile Menu Toggle (#menu-toggle, #navbar)
 * 13. Smooth Offset Anchor Navigation (80px navbar offset)
 * ====================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modular components safely
  initScrollProgress();
  initScrollReveal();
  initTypingEffect();
  initParallax();
  initStickyNavigation();
  initTabSystem();
  initExampleTabs();
  initExpandableCards();
  initCopyCodeButtons();
  initCounters();
  initParticleCanvas();
  initMobileMenu();
  initSmoothScroll();
});

/* ====================================================================
 * 1. SCROLL PROGRESS BAR
 * Displays reading progress via thin blue (#0000FF) bar at the top
 * ==================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  // Ensure base visual styling if not explicitly defined in CSS
  if (!progressBar.style.backgroundColor) {
    progressBar.style.backgroundColor = '#0000FF';
  }

  let isTicking = false;

  const updateProgress = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progressPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    
    // Clamp between 0% and 100%
    const clampedProgress = Math.min(100, Math.max(0, progressPercent));
    progressBar.style.width = `${clampedProgress}%`;
    progressBar.setAttribute('aria-valuenow', Math.round(clampedProgress));

    isTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(updateProgress);
      isTicking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (!isTicking) {
      window.requestAnimationFrame(updateProgress);
      isTicking = true;
    }
  }, { passive: true });

  // Initial calculation
  updateProgress();
}

/* ====================================================================
 * 2. SCROLL REVEAL ANIMATIONS
 * IntersectionObserver triggering .active on .reveal elements at 15% visibility
 * Supports data-reveal (fade-up, fade-left, fade-right, scale-in, fade-down)
 * and data-stagger delay calculations (INDEX * 100ms)
 * ==================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  // Apply stagger transition delays beforehand
  revealElements.forEach(el => {
    const staggerIndex = el.getAttribute('data-stagger');
    if (staggerIndex !== null && !isNaN(parseFloat(staggerIndex))) {
      const delayMs = parseFloat(staggerIndex) * 100;
      el.style.transitionDelay = `${delayMs}ms`;
      el.style.animationDelay = `${delayMs}ms`;
    }
  });

  // Check IntersectionObserver support
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('active'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // Trigger when at least 15% of element is visible
      if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
        entry.target.classList.add('active');
        // Once revealed, unobserve to prevent re-triggering
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -20px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ====================================================================
 * 3. TYPING EFFECT
 * Types text character by character on #hero-title at 50ms speed
 * Keeps blinking cursor during and after typing
 * Initiates once hero section intersects viewport
 * ==================================================================== */
function initTypingEffect() {
  const heroTitle = document.getElementById('hero-title');
  if (!heroTitle) return;

  // Extract source text from data attribute or existing textContent
  const rawText = heroTitle.getAttribute('data-text') || heroTitle.textContent.trim();
  if (!rawText) return;

  // Clear inner content and create dedicated text + blinking cursor spans
  heroTitle.textContent = '';
  const textSpan = document.createElement('span');
  textSpan.className = 'typed-text';

  const cursorSpan = document.createElement('span');
  cursorSpan.className = 'typing-cursor';
  cursorSpan.textContent = '|';
  cursorSpan.setAttribute('aria-hidden', 'true');

  // Inject keyframe style for cursor blinking if not already in document
  if (!document.getElementById('cursor-blink-keyframes')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'cursor-blink-keyframes';
    styleEl.textContent = `
      @keyframes cursorBlink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      .typing-cursor {
        display: inline-block;
        margin-left: 2px;
        color: #0000FF;
        font-weight: 700;
        animation: cursorBlink 0.8s step-end infinite;
        vertical-align: baseline;
      }
    `;
    document.head.appendChild(styleEl);
  }

  heroTitle.appendChild(textSpan);
  heroTitle.appendChild(cursorSpan);

  let hasStarted = false;

  const startTyping = () => {
    if (hasStarted) return;
    hasStarted = true;

    let charIndex = 0;
    const typeInterval = 50; // 50ms per character

    const typeNextChar = () => {
      if (charIndex < rawText.length) {
        textSpan.textContent += rawText.charAt(charIndex);
        charIndex++;
        setTimeout(typeNextChar, typeInterval);
      }
      // Blinking cursor stays active during and indefinitely after typing
    };

    typeNextChar();
  };

  // Find the closest hero section or heroTitle's parent
  const heroSection = heroTitle.closest('#hero, .hero, header, section') || heroTitle.parentElement;

  if (heroSection && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startTyping();
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });

    heroObserver.observe(heroSection);
  } else {
    // Fallback if observer unavailable
    startTyping();
  }
}

/* ====================================================================
 * 4. PARALLAX EFFECT
 * Moves .parallax-bg elements at 50% scroll speed via requestAnimationFrame
 * ==================================================================== */
function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax-bg');
  if (!parallaxElements.length) return;

  let isTicking = false;

  const updateParallax = () => {
    const viewportHeight = window.innerHeight;
    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

    parallaxElements.forEach(el => {
      const parent = el.parentElement || el;
      const rect = parent.getBoundingClientRect();

      // Only calculate if parent element is within or adjacent to viewport
      if (rect.bottom >= 0 && rect.top <= viewportHeight) {
        const elementAbsoluteTop = rect.top + currentScrollY;
        // Background moves at 50% of scroll speed relative to initial placement
        const scrollDelta = (currentScrollY - elementAbsoluteTop) * 0.5;
        el.style.transform = `translate3d(0, ${scrollDelta.toFixed(2)}px, 0)`;
        el.style.willChange = 'transform';
      }
    });

    isTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(updateParallax);
      isTicking = true;
    }
  }, { passive: true });

  // Initial trigger
  updateParallax();
}

/* ====================================================================
 * 5. STICKY NAVIGATION & SCROLL SPY
 * Adds .scrolled to #navbar when past 100px
 * Highlights active nav link based on current viewport section
 * ==================================================================== */
function initStickyNavigation() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const navLinks = navbar.querySelectorAll('a[href^="#"]');
  const sections = [];

  // Collect all valid target sections linked in navbar
  navLinks.forEach(link => {
    const targetId = link.getAttribute('href');
    if (targetId && targetId !== '#') {
      const sectionEl = document.querySelector(targetId);
      if (sectionEl) {
        sections.push({ id: targetId, element: sectionEl, link: link });
      }
    }
  });

  let isTicking = false;

  const handleNavScroll = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Toggle .scrolled when scrolled past 100px
    if (scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Determine current active section
    const navHeight = navbar.offsetHeight || 80;
    const currentPosition = scrollY + navHeight + 50;

    let currentSection = null;

    // Iterate sections from top to bottom
    sections.forEach(item => {
      const top = item.element.offsetTop;
      const height = item.element.offsetHeight;
      if (currentPosition >= top && currentPosition < top + height) {
        currentSection = item;
      }
    });

    // Check if bottom of page reached, highlight last nav item
    const atBottom = (window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 50);
    if (atBottom && sections.length > 0) {
      currentSection = sections[sections.length - 1];
    }

    // Update active class on nav links
    sections.forEach(item => {
      if (currentSection && item.id === currentSection.id) {
        item.link.classList.add('active');
      } else {
        item.link.classList.remove('active');
      }
    });

    isTicking = false;
  };

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(handleNavScroll);
      isTicking = true;
    }
  }, { passive: true });

  handleNavScroll();
}

/* ====================================================================
 * 6. TAB SYSTEM
 * Supports tabs inside .tab-container
 * .tab-btn with data-tab matches .tab-content id
 * Smooth fade transition with .active class
 * ==================================================================== */
function initTabSystem() {
  const tabContainers = document.querySelectorAll('.tab-container');

  // Function to bind a container's tab events
  const setupContainer = (container) => {
    const tabButtons = container.querySelectorAll('.tab-btn');
    const tabContents = container.querySelectorAll('.tab-content');

    if (!tabButtons.length) return;

    tabButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();

        // Get target identifier from data-tab or href
        const targetTabId = (btn.getAttribute('data-tab') || btn.getAttribute('href') || '').replace(/^#/, '');
        if (!targetTabId) return;

        // Check if button is already active
        if (btn.classList.contains('active')) return;

        // Deactivate all buttons within container
        tabButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });

        // Activate clicked button
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Look for content matching the id (inside container or document wide)
        let matchedContent = container.querySelector(`#${targetTabId}`);
        if (!matchedContent) {
          matchedContent = document.getElementById(targetTabId);
        }

        // Deactivate sibling contents
        const allAssociatedContents = tabContents.length > 0 ? tabContents : document.querySelectorAll('.tab-content');
        allAssociatedContents.forEach(content => {
          content.classList.remove('active');
        });

        // Activate matched content with smooth fade
        if (matchedContent) {
          matchedContent.classList.add('active');
        }
      });
    });
  };

  if (tabContainers.length > 0) {
    tabContainers.forEach(container => setupContainer(container));
  } else {
    // Fallback: If no .tab-container wrapper exists, attach globally
    const standaloneButtons = document.querySelectorAll('.tab-btn');
    if (standaloneButtons.length > 0) {
      standaloneButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = (btn.getAttribute('data-tab') || '').replace(/^#/, '');
          if (!targetId) return;

          standaloneButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
          const targetEl = document.getElementById(targetId);
          if (targetEl) targetEl.classList.add('active');
        });
      });
    }
  }
}

/* ====================================================================
 * 6.1. EXAMPLE TABS (RACE PROMPT EXAMPLES)
 * Switches code example panels (.example-content) when clicking .example-tab
 * ==================================================================== */
function initExampleTabs() {
  const exampleTabs = document.querySelectorAll('.example-tab');
  const exampleContents = document.querySelectorAll('.example-content');
  if (!exampleTabs.length) return;

  exampleTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetExample = tab.getAttribute('data-example');
      if (!targetExample) return;

      exampleTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      exampleContents.forEach(content => {
        if (content.id === `example-${targetExample}`) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
        }
      });
    });
  });
}

/* ====================================================================
 * 7. EXPANDABLE CARDS (ACCORDION)
 * Cards with .expandable-card
 * Click toggles .expanded class
 * Only one card expanded at a time within same parent
 * Smooth height transition calculation
 * ==================================================================== */
function initExpandableCards() {
  const cards = document.querySelectorAll('.expandable-card');
  if (!cards.length) return;

  const getCardBody = (card) => {
    return card.querySelector('.race-card-body, .card-body, .expandable-content, .card-content, .card-details') ||
      (card.children.length > 1 ? card.children[1] : null);
  };

  const collapseCard = (card) => {
    card.classList.remove('expanded');
    card.setAttribute('aria-expanded', 'false');
    const body = getCardBody(card);
    if (body) {
      body.style.maxHeight = '0px';
    }
  };

  const expandCard = (card) => {
    card.classList.add('expanded');
    card.setAttribute('aria-expanded', 'true');
    const body = getCardBody(card);
    if (body) {
      body.style.maxHeight = `${body.scrollHeight}px`;
    }
  };

  cards.forEach(card => {
    // Accessibility attributes
    card.setAttribute('role', 'region');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-expanded', card.classList.contains('expanded') ? 'true' : 'false');

    const body = getCardBody(card);
    if (body) {
      body.style.overflow = 'hidden';
      body.style.transition = 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease';
      if (!card.classList.contains('expanded')) {
        body.style.maxHeight = '0px';
      } else {
        body.style.maxHeight = `${body.scrollHeight}px`;
      }
    }

    const toggleHandler = (e) => {
      // Ignore click if triggered inside an interactive child element (button, link, code block)
      if (e.target.closest('button, a, .copy-btn, pre, code')) return;

      const isExpanded = card.classList.contains('expanded');
      const parent = card.parentElement;

      // Close all sibling cards in the same container
      if (parent) {
        const siblings = parent.querySelectorAll('.expandable-card');
        siblings.forEach(sibling => {
          if (sibling !== card && sibling.classList.contains('expanded')) {
            collapseCard(sibling);
          }
        });
      }

      // Toggle current card
      if (isExpanded) {
        collapseCard(card);
      } else {
        expandCard(card);
      }
    };

    card.addEventListener('click', toggleHandler);

    // Keyboard support (Enter or Spacebar)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleHandler(e);
      }
    });
  });
}

/* ====================================================================
 * 8. COPY CODE BUTTON
 * Copies text from .code-block to clipboard
 * Updates button label to '✓ Disalin!' for 2 seconds then reverts to 'Salin'
 * ==================================================================== */
function initCopyCodeButtons() {
  const codeBlocks = document.querySelectorAll('.code-block');

  // Ensure every .code-block has a copy button
  codeBlocks.forEach(block => {
    let btn = block.querySelector('.copy-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type = 'button';
      btn.textContent = 'Salin';
      btn.setAttribute('aria-label', 'Salin kode ke clipboard');
      block.appendChild(btn);
    }
  });

  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(btn => {
    // Store default text if not already stored
    if (!btn.getAttribute('data-original-text')) {
      btn.setAttribute('data-original-text', btn.textContent.trim() || 'Salin');
    }

    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const block = btn.closest('.code-block') || btn.parentElement;
      if (!block) return;

      // Extract text content cleanly without the copy button's own text
      const codeElement = block.querySelector('code, pre');
      let textToCopy = '';

      if (codeElement) {
        textToCopy = codeElement.innerText || codeElement.textContent;
      } else {
        // Clone block to strip out the button
        const clone = block.cloneNode(true);
        const clonedBtn = clone.querySelector('.copy-btn');
        if (clonedBtn) clonedBtn.remove();
        textToCopy = clone.innerText || clone.textContent;
      }

      textToCopy = textToCopy.trim();

      // Clipboard copy helper
      const copyToClipboard = async (text) => {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback for non-HTTPS or legacy environments
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          textArea.style.top = '0';
          textArea.setAttribute('readonly', '');
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
      };

      try {
        await copyToClipboard(textToCopy);

        // Feedback state
        const originalText = btn.getAttribute('data-original-text') || 'Salin';
        btn.textContent = '✓ Disalin!';
        btn.classList.add('copied');

        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Gagal menyalin teks ke clipboard:', err);
      }
    });
  });
}

/* ====================================================================
 * 9. COUNTER ANIMATION
 * Elements with .counter and data-target attribute
 * Counts from 0 to data-target in 2 seconds with ease-out timing
 * Triggers once upon entering viewport
 * ==================================================================== */
function initCounters() {
  const counterElements = document.querySelectorAll('.counter[data-target], .counter');
  if (!counterElements.length) return;

  // Cubic ease-out calculation: 1 - (1 - t)^3
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const startCounter = (el) => {
    if (el.hasAttribute('data-counter-done')) return;
    el.setAttribute('data-counter-done', 'true');

    const rawTarget = el.getAttribute('data-target') || el.textContent.trim();
    const match = rawTarget.match(/[\d.]+/);
    if (!match) return;

    const targetValue = parseFloat(match[0]);
    const numIndex = rawTarget.indexOf(match[0]);
    const prefix = rawTarget.substring(0, numIndex);
    const suffix = rawTarget.substring(numIndex + match[0].length);

    const hasDecimal = match[0].includes('.');
    const decimalPlaces = hasDecimal ? match[0].split('.')[1].length : 0;

    const duration = 2000; // 2 seconds
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      const currentValue = targetValue * easedProgress;

      el.textContent = `${prefix}${currentValue.toFixed(decimalPlaces)}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        // Guarantee final string matches target precisely
        el.textContent = rawTarget;
      }
    };

    window.requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    counterElements.forEach(el => counterObserver.observe(el));
  } else {
    // Fallback if observer unavailable
    counterElements.forEach(el => startCounter(el));
  }
}

/* ====================================================================
 * 10. FLOATING PARTICLES (CANVAS)
 * #particles-canvas in hero section
 * 50 blue (#0000FF) semi-transparent particles floating upward slowly
 * Dynamic connection lines when distance < 150px
 * Pauses when hero is out of view for optimal performance
 * Responsive to window resizing
 * ==================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const heroSection = canvas.closest('#hero, .hero, header, section') || canvas.parentElement || document.body;

  let animationFrameId = null;
  let isHeroVisible = true;
  let width = 0;
  let height = 0;
  const PARTICLE_COUNT = 50;
  const MAX_CONNECT_DISTANCE = 150;
  const particles = [];

  // Particle Class Definition
  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.radius = Math.random() * 2 + 1.5; // 1.5px to 3.5px
      this.speedY = -(Math.random() * 0.5 + 0.3); // Floating upward slowly (-0.3 to -0.8)
      this.speedX = (Math.random() - 0.5) * 0.4; // Subtle horizontal drift
      this.opacity = Math.random() * 0.4 + 0.3; // 0.3 to 0.7 opacity
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap horizontally
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;

      // Reset when particle floats off the top
      if (this.y < -10) {
        this.reset(false);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 0, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Resize Handler with device pixel ratio scaling for crisp rendering
  const resizeCanvas = () => {
    const parentRect = heroSection.getBoundingClientRect();
    width = parentRect.width || window.innerWidth;
    height = parentRect.height || window.innerHeight;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.resetTransform?.();
    ctx.scale(dpr, dpr);
  };

  // Populate particles
  const setupParticles = () => {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  };

  // Connect nearby particles with lines
  const drawConnections = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < MAX_CONNECT_DISTANCE) {
          // Dynamic alpha fades smoothly as distance reaches limit
          const lineAlpha = (1 - dist / MAX_CONNECT_DISTANCE) * 0.22;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 0, 255, ${lineAlpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  };

  // Main Render Loop
  const render = () => {
    ctx.clearRect(0, 0, width, height);

    drawConnections();

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    if (isHeroVisible) {
      animationFrameId = window.requestAnimationFrame(render);
    } else {
      animationFrameId = null;
    }
  };

  // Resize event listener with debounce
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas();
    }, 150);
  }, { passive: true });

  // Initial sizing & particle creation
  resizeCanvas();
  setupParticles();

  // Run in hero section only: IntersectionObserver pauses animation when scrolled away
  if ('IntersectionObserver' in window && heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isHeroVisible = entry.isIntersecting;
        if (isHeroVisible && !animationFrameId) {
          animationFrameId = window.requestAnimationFrame(render);
        } else if (!isHeroVisible && animationFrameId) {
          window.cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      });
    }, { threshold: 0.05 });

    heroObserver.observe(heroSection);
  } else {
    animationFrameId = window.requestAnimationFrame(render);
  }
}

/* ====================================================================
 * 11. MOBILE MENU TOGGLE
 * Element: #menu-toggle
 * Toggles .open class on #navbar
 * Automatically closes menu when nav link is clicked or on Escape key
 * ==================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navbar = document.getElementById('navbar');
  if (!menuToggle || !navbar) return;

  const closeMenu = () => {
    navbar.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    const isOpen = navbar.classList.toggle('open');
    menuToggle.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  };

  menuToggle.addEventListener('click', toggleMenu);

  // Close menu when clicking nav links
  const navLinks = navbar.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navbar.classList.contains('open') && !navbar.contains(e.target) && !menuToggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navbar.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ====================================================================
 * 12. SMOOTH SCROLL WITH NAVBAR OFFSET (80px)
 * Smoothly scrolls to target section offset by 80px for fixed navbar
 * Updates URL history cleanly
 * ==================================================================== */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetHash = this.getAttribute('href');
      if (!targetHash || targetHash === '#') return;

      const targetElement = document.querySelector(targetHash);
      if (!targetElement) return;

      e.preventDefault();

      const NAVBAR_OFFSET = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - NAVBAR_OFFSET;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth'
      });

      // Update URL hash without abrupt jumps
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', targetHash);
      } else {
        window.location.hash = targetHash;
      }
    });
  });
}
