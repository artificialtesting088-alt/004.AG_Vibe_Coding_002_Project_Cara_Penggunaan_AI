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
  initSpotlightCards();
  initCommandPalette();
  initKeyboardNavigation();
  initPromptStudio();
  initContextVisualizer();
  initTemperatureSimulator();
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

  // Multi-page: Automatically set active class based on current page file
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const allNavLinks = navbar.querySelectorAll('.nav-link');
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

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
    const icon = card.querySelector('.expand-icon');
    if (icon) icon.textContent = '+';
    const body = getCardBody(card);
    if (body) {
      body.style.maxHeight = '0px';
    }
  };

  const expandCard = (card) => {
    card.classList.add('expanded');
    card.setAttribute('aria-expanded', 'true');
    const icon = card.querySelector('.expand-icon');
    if (icon) icon.textContent = '−';
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
  const PARTICLE_COUNT = 65;
  const MAX_CONNECT_DISTANCE = 160;
  const particles = [];
  const mouse = { x: -1000, y: -1000, active: false };

  heroSection.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  heroSection.addEventListener('mouseleave', () => {
    mouse.active = false;
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Particle Class Definition
  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.radius = Math.random() * 2 + 1.8; // 1.8px to 3.8px
      this.speedY = -(Math.random() * 0.5 + 0.3); // Floating upward slowly
      this.speedX = (Math.random() - 0.5) * 0.4; // Subtle horizontal drift
      this.opacity = Math.random() * 0.45 + 0.35; // 0.35 to 0.8 opacity
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
          const lineAlpha = (1 - dist / MAX_CONNECT_DISTANCE) * 0.35;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 0, 255, ${lineAlpha})`;
          ctx.lineWidth = 1.1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Connect particles to interactive mouse cursor
    if (mouse.active) {
      for (let i = 0; i < particles.length; i++) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 180) {
          const mouseAlpha = (1 - dist / 180) * 0.45;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 0, 255, ${mouseAlpha})`;
          ctx.lineWidth = 1.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
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


/* ====================================================================
 * 14. SPOTLIGHT HOVER EFFECT (Linear / Stripe Card Glow)
 * Tracks cursor position on cards and projects an ambient royal blue glow
 * ==================================================================== */
function initSpotlightCards() {
  const cards = document.querySelectorAll('.module-card, .race-card, .skill-card, .connector-card, .param-card, .studio-card, .bento-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ====================================================================
 * 15. GLOBAL COMMAND PALETTE (Cmd + K / Ctrl + K)
 * Fast keyboard-first search modal for instant navigation across all topics
 * ==================================================================== */
const SEARCH_DATABASE = [
  // Modules
  { title: "Bab 01: RACE Framework", cat: "Modul Pembelajaran", desc: "Formula 4 pilar Role, Action, Context, Expectation", url: "race-framework.html", icon: "🎯" },
  { title: "Bab 02: Context Engineering", cat: "Modul Pembelajaran", desc: "Anatomi 7 komponen Context Window & Visual RAM Stack", url: "context-engineering.html", icon: "🧠" },
  { title: "Bab 03: Teknik Prompting Lanjutan", cat: "Modul Pembelajaran", desc: "Chain of Thought (CoT), Few-Shot vs Zero-Shot, System Prompt", url: "teknik-lanjutan.html", icon: "🔗" },
  { title: "Bab 04: AI Skills & Workflows", cat: "Modul Pembelajaran", desc: "Tools vs Skills, 8 Kategori, Autonomous Chaining Workflow", url: "ai-skills.html", icon: "⚡" },
  { title: "Bab 05: Connectors & MCP", cat: "Modul Pembelajaran", desc: "Model Context Protocol Anthropic, Database & API Integration", url: "connectors.html", icon: "🔌" },
  { title: "Bab 06: Parameter Tuning", cat: "Modul Pembelajaran", desc: "Temperature, Top-P Nucleus Sampling, Penalties", url: "parameter.html", icon: "🎛️" },
  // Topics & Deep Dives
  { title: "Role (RACE)", cat: "Framework & Pilar", desc: "Kondisikan persona, domain prior, & senioritas model AI", url: "race-framework.html", icon: "👤" },
  { title: "Action (RACE)", cat: "Framework & Pilar", desc: "Kata kerja operasional terukur dan instruksi decisive", url: "race-framework.html", icon: "⚡" },
  { title: "Context (RACE)", cat: "Framework & Pilar", desc: "Grounding lingkungan teknis, target audience & data input", url: "race-framework.html", icon: "🌐" },
  { title: "Expectation (RACE)", cat: "Framework & Pilar", desc: "Output schema, format baku, dan batasan negatif", url: "race-framework.html", icon: "📋" },
  { title: "Interactive RACE Prompt Studio", cat: "Fitur Interaktif", desc: "Live studio untuk merancang & menyalin prompt RACE secara instan", url: "race-framework.html#prompt-studio", icon: "🛠️" },
  { title: "Anatomi 7 Komponen Context Window", cat: "Context Engineering", desc: "System Prompt, Skills, RAG Docs, Memory, Scratchpad, Tool Buffer, User Prompt", url: "context-engineering.html", icon: "📦" },
  { title: "Simulator Alokasi Token & RAM Window", cat: "Fitur Interaktif", desc: "Visualisasi interaktif pembagian memori token 128k - 1M", url: "context-engineering.html#context-visualizer", icon: "📊" },
  { title: "Prompt Engineering vs Context Engineering", cat: "Konsep Kunci", desc: "Tabel komparasi mendalam perbedaan paradigma PE vs CE", url: "context-engineering.html", icon: "⚖️" },
  { title: "Chain of Thought (CoT & ReAct)", cat: "Teknik Lanjutan", desc: "Penalaran langkah demi langkah (Step-by-step reasoning)", url: "teknik-lanjutan.html", icon: "🔗" },
  { title: "Few-Shot vs Zero-Shot Learning", cat: "Teknik Lanjutan", desc: "Kapan menggunakan contoh input-output vs instruksi langsung", url: "teknik-lanjutan.html", icon: "🎯" },
  { title: "Blueprint System Prompt Production-Ready", cat: "Teknik Lanjutan", desc: "Arsitektur 6 bagian system prompt kelas industri", url: "teknik-lanjutan.html", icon: "⚙️" },
  { title: "Model Context Protocol (MCP) Deep Dive", cat: "Integrasi & Tools", desc: "Standar protokol industri Anthropic: Resources, Tools, Prompts", url: "connectors.html", icon: "🔌" },
  { title: "Contoh Konfigurasi mcp_config.json", cat: "Kode & Config", desc: "Template JSON untuk GitHub, Postgres, dan Filesystem", url: "connectors.html", icon: "📝" },
  { title: "Simulator Interaktif Temperature", cat: "Fitur Interaktif", desc: "Slider interaktif untuk menguji respon deterministik vs kreatif", url: "parameter.html#temp-simulator", icon: "🌡️" },
  { title: "Top-P (Nucleus Sampling) & Penalties", cat: "Parameter AI", desc: "Mengatur keragaman kata dan mencegah pengulangan token", url: "parameter.html", icon: "🎚️" }
];

function initCommandPalette() {
  if (!document.getElementById('command-modal')) {
    const modalHTML = `
      <div id="command-modal" class="command-modal" aria-hidden="true">
        <div class="command-backdrop"></div>
        <div class="command-dialog">
          <div class="command-header">
            <span class="command-search-icon">🔍</span>
            <input type="text" id="command-input" class="command-input" placeholder="Cari materi, teknik, contoh prompt, atau modul... (Esc untuk menutup)" autocomplete="off">
            <button id="command-close" class="command-close-btn" aria-label="Tutup pencarian">Esc</button>
          </div>
          <div class="command-results" id="command-results"></div>
          <div class="command-footer">
            <div class="footer-hint"><span><kbd>↑</kbd> <kbd>↓</kbd> Pilih</span><span><kbd>↵</kbd> Buka</span><span><kbd>Esc</kbd> Tutup</span></div>
            <div class="footer-count" id="command-count">21 topik tersedia</div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  const modal = document.getElementById('command-modal');
  const input = document.getElementById('command-input');
  const resultsContainer = document.getElementById('command-results');
  const countEl = document.getElementById('command-count');
  const searchTriggers = document.querySelectorAll('.nav-search-btn, #search-trigger');
  const backdrop = modal.querySelector('.command-backdrop');
  const closeBtn = document.getElementById('command-close');

  let activeIndex = 0;
  let currentResults = [];

  const openModal = () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    input.value = '';
    renderResults('');
    setTimeout(() => input.focus(), 50);
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const renderResults = (query) => {
    const q = query.trim().toLowerCase();
    currentResults = q === '' 
      ? SEARCH_DATABASE 
      : SEARCH_DATABASE.filter(item => 
          item.title.toLowerCase().includes(q) || 
          item.desc.toLowerCase().includes(q) ||
          item.cat.toLowerCase().includes(q)
        );

    activeIndex = 0;
    countEl.textContent = `${currentResults.length} hasil ditemukan`;

    if (currentResults.length === 0) {
      resultsContainer.innerHTML = `
        <div class="command-empty">
          <span class="empty-icon">🔎</span>
          <p>Tidak ada hasil untuk "<strong>${escapeHTML(query)}</strong>"</p>
          <span class="empty-sub">Coba cari "RACE", "Context", "CoT", "MCP", atau "Temperature"</span>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = currentResults.map((item, idx) => `
      <a href="${item.url}" class="command-item ${idx === 0 ? 'selected' : ''}" data-index="${idx}">
        <span class="item-icon">${item.icon}</span>
        <div class="item-text">
          <div class="item-title">${highlightText(item.title, q)}</div>
          <div class="item-desc">${highlightText(item.desc, q)}</div>
        </div>
        <span class="item-cat">${item.cat}</span>
      </a>
    `).join('');

    resultsContainer.querySelectorAll('.command-item').forEach(el => {
      el.addEventListener('mouseenter', () => {
        resultsContainer.querySelectorAll('.command-item').forEach(i => i.classList.remove('selected'));
        el.classList.add('selected');
        activeIndex = parseInt(el.getAttribute('data-index'), 10);
      });
      el.addEventListener('click', () => closeModal());
    });
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="highlight">$1</mark>');
  };

  const escapeHTML = (str) => {
    const p = document.createElement('p');
    p.textContent = str;
    return p.innerHTML;
  };

  input.addEventListener('input', (e) => {
    renderResults(e.target.value);
  });

  input.addEventListener('keydown', (e) => {
    const items = resultsContainer.querySelectorAll('.command-item');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % items.length;
      updateSelected(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + items.length) % items.length;
      updateSelected(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[activeIndex]) {
        items[activeIndex].click();
        window.location.href = items[activeIndex].getAttribute('href');
      }
    } else if (e.key === 'Escape') {
      closeModal();
    }
  });

  const updateSelected = (items) => {
    items.forEach((item, idx) => {
      if (idx === activeIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        item.classList.remove('selected');
      }
    });
  };

  searchTriggers.forEach(btn => btn.addEventListener('click', openModal));
  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modal.classList.contains('active')) {
        closeModal();
      } else {
        openModal();
      }
    }
  });
}

/* ====================================================================
 * 16. KEYBOARD NAVIGATION BETWEEN CHAPTERS
 * Press Left Arrow or [ to go to previous chapter
 * Press Right Arrow or ] to go to next chapter
 * ==================================================================== */
function initKeyboardNavigation() {
  const prevBtn = document.querySelector('.chapter-btn:not(.next)');
  const nextBtn = document.querySelector('.chapter-btn.next');

  if (!prevBtn && !nextBtn) return;

  if (!document.getElementById('keyboard-hint')) {
    const hint = document.createElement('div');
    hint.id = 'keyboard-hint';
    hint.className = 'keyboard-hint';
    hint.innerHTML = '<span><kbd>←</kbd> <kbd>→</kbd> Navigasi Bab</span><span><kbd>⌘K</kbd> Cari</span>';
    document.body.appendChild(hint);
  }

  document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    const modal = document.getElementById('command-modal');
    if (modal && modal.classList.contains('active')) return;

    if (e.key === 'ArrowLeft' || e.key === '[') {
      if (prevBtn) {
        e.preventDefault();
        window.location.href = prevBtn.getAttribute('href');
      }
    } else if (e.key === 'ArrowRight' || e.key === ']') {
      if (nextBtn) {
        e.preventDefault();
        window.location.href = nextBtn.getAttribute('href');
      }
    }
  });
}

/* ====================================================================
 * 17. INTERACTIVE RACE PROMPT STUDIO (on race-framework.html)
 * Live interactive prompt builder with presets and real-time preview
 * ==================================================================== */
function initPromptStudio() {
  const studio = document.getElementById('prompt-studio');
  if (!studio) return;

  const roleInput = document.getElementById('studio-role');
  const actionInput = document.getElementById('studio-action');
  const contextInput = document.getElementById('studio-context');
  const expectationInput = document.getElementById('studio-expectation');
  const previewBox = document.getElementById('studio-preview');
  const copyBtn = document.getElementById('studio-copy');
  const presetBtns = studio.querySelectorAll('.preset-chip');

  const PRESETS = {
    backend: {
      role: "Principal Backend Engineer & Clean Architecture Specialist dengan 10+ tahun pengalaman.",
      action: "Refactor modul pembayaran berikut menjadi pola Clean Architecture / Ports and Adapters.",
      context: "Framework: Node.js/TypeScript dengan PostgreSQL. Sistem melayani 200 req/detik dan membutuhkan zero downtime.",
      expectation: "Berikan: (1) Arsitektur folder, (2) Kode implementasi interface & repository, (3) Unit test Jest komprehensif, (4) Analisis perbandingan sebelum & sesudah."
    },
    copywriter: {
      role: "Head of Growth & B2B SaaS Conversion Copywriter kelas dunia.",
      action: "Tuliskan landing page copy lengkap dengan framework PAS (Problem-Agitate-Solution).",
      context: "Produk: AI Code Review Tool untuk tim engineering enterprise yang ingin memangkas PR review time hingga 60%.",
      expectation: "Output: (1) Hero H1 + subheadline, (2) 3 value proposition bullets, (3) Social proof callout, (4) CTA primer & sekunder dengan microcopy meyakinkan."
    },
    datascience: {
      role: "Lead Data Scientist & Customer Retention Strategist.",
      action: "Analisis dataset churn cohort ini dan rekomendasikan 3 intervensi algoritmik.",
      context: "SaaS B2B dengan 15.000 pelanggan aktif. Churn meningkat dari 2.1% menjadi 4.8% pada cohort bulan ke-3 pasca onboarding.",
      expectation: "Format: Tabel feature importance, metrik korelasi, model prediksi rekomendasi (XGBoost vs Logistic), dan action plan prioritas tinggi."
    },
    designer: {
      role: "Staff Product Designer & Accessibility (WCAG 2.1 AAA) Specialist.",
      action: "Audit alur checkout 3-langkah berikut dan rancang optimasi frictionless checkout.",
      context: "Aplikasi e-commerce mobile-first dengan cart abandonment rate 42% pada langkah pengisian alamat dan metode pembayaran.",
      expectation: "Daftar rekomendasi UX visual: (1) Wireframe ASCII layout per langkah, (2) Micro-interaction copy, (3) Aturan kontras & touch target min 48x48px."
    }
  };

  const updatePreview = () => {
    const r = roleInput.value.trim() || "Tentukan role...";
    const a = actionInput.value.trim() || "Tentukan action...";
    const c = contextInput.value.trim() || "Tentukan context...";
    const e = expectationInput.value.trim() || "Tentukan expectation...";

    previewBox.innerHTML = `
<span class="prompt-tag tag-role">[ROLE]</span>
${escapeStudioHTML(r)}

<span class="prompt-tag tag-action">[ACTION]</span>
${escapeStudioHTML(a)}

<span class="prompt-tag tag-context">[CONTEXT]</span>
${escapeStudioHTML(c)}

<span class="prompt-tag tag-expectation">[EXPECTATION]</span>
${escapeStudioHTML(e)}
    `.trim();
  };

  const escapeStudioHTML = (str) => {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  [roleInput, actionInput, contextInput, expectationInput].forEach(inp => {
    if (inp) inp.addEventListener('input', updatePreview);
  });

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const pKey = btn.getAttribute('data-preset');
      const data = PRESETS[pKey];
      if (data) {
        roleInput.value = data.role;
        actionInput.value = data.action;
        contextInput.value = data.context;
        expectationInput.value = data.expectation;
        updatePreview();
      }
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const fullPrompt = `[ROLE]
${roleInput.value.trim()}

[ACTION]
${actionInput.value.trim()}

[CONTEXT]
${contextInput.value.trim()}

[EXPECTATION]
${expectationInput.value.trim()}`;
      navigator.clipboard.writeText(fullPrompt).then(() => {
        const origText = copyBtn.innerHTML;
        copyBtn.innerHTML = '✓ Prompt Berhasil Disalin!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.innerHTML = origText;
          copyBtn.classList.remove('copied');
        }, 2000);
      });
    });
  }

  // Initial render with default preset
  if (presetBtns[0]) presetBtns[0].click();
}

/* ====================================================================
 * 18. INTERACTIVE CONTEXT WINDOW RAM BUFFER SIMULATOR (on context-engineering.html)
 * Interactive token allocation breakdown across 7 ingredients
 * ==================================================================== */
function initContextVisualizer() {
  const container = document.getElementById('context-visualizer');
  if (!container) return;

  const presetBtns = container.querySelectorAll('.scenario-btn');
  const barSystem = document.getElementById('seg-system');
  const barTools = document.getElementById('seg-tools');
  const barDocs = document.getElementById('seg-docs');
  const barMemory = document.getElementById('seg-memory');
  const barScratch = document.getElementById('seg-scratch');
  const barLive = document.getElementById('seg-live');
  const barPrompt = document.getElementById('seg-prompt');
  const totalTokensEl = document.getElementById('vis-total-tokens');
  const windowLimitEl = document.getElementById('vis-window-limit');

  const CONFIGS = {
    coding: {
      limit: '128,000 Tokens (Claude 3.5 Sonnet / GPT-4o)',
      total: '84,500 Tokens Terpakai (66% Kapasitas)',
      shares: { system: 4, tools: 14, docs: 35, memory: 20, scratch: 8, live: 14, prompt: 5 }
    },
    rag: {
      limit: '200,000 Tokens (Claude 3.5 Sonnet Enterprise)',
      total: '162,000 Tokens Terpakai (81% Kapasitas)',
      shares: { system: 3, tools: 5, docs: 60, memory: 15, scratch: 5, live: 7, prompt: 5 }
    },
    agent: {
      limit: '1,000,000 Tokens (Gemini 1.5 Pro / Flash)',
      total: '430,000 Tokens Terpakai (43% Kapasitas)',
      shares: { system: 2, tools: 18, docs: 28, memory: 22, scratch: 12, live: 14, prompt: 4 }
    }
  };

  const applyConfig = (key) => {
    const cfg = CONFIGS[key];
    if (!cfg) return;

    if (totalTokensEl) totalTokensEl.textContent = cfg.total;
    if (windowLimitEl) windowLimitEl.textContent = cfg.limit;

    if (barSystem) { barSystem.style.width = `${cfg.shares.system}%`; barSystem.title = `System Prompts: ${cfg.shares.system}%`; }
    if (barTools) { barTools.style.width = `${cfg.shares.tools}%`; barTools.title = `Tools Schema: ${cfg.shares.tools}%`; }
    if (barDocs) { barDocs.style.width = `${cfg.shares.docs}%`; barDocs.title = `RAG Documents: ${cfg.shares.docs}%`; }
    if (barMemory) { barMemory.style.width = `${cfg.shares.memory}%`; barMemory.title = `Memory: ${cfg.shares.memory}%`; }
    if (barScratch) { barScratch.style.width = `${cfg.shares.scratch}%`; barScratch.title = `Scratchpad: ${cfg.shares.scratch}%`; }
    if (barLive) { barLive.style.width = `${cfg.shares.live}%`; barLive.title = `Tool Output: ${cfg.shares.live}%`; }
    if (barPrompt) { barPrompt.style.width = `${cfg.shares.prompt}%`; barPrompt.title = `User Prompt: ${cfg.shares.prompt}%`; }
  };

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyConfig(btn.getAttribute('data-scenario'));
    });
  });

  applyConfig('coding');
}

/* ====================================================================
 * 19. INTERACTIVE TEMPERATURE & MODEL CONTROL SIMULATOR (on parameter.html)
 * Live temperature slider updating behavior mode and response simulation
 * ==================================================================== */
function initTemperatureSimulator() {
  const container = document.getElementById('temp-simulator');
  if (!container) return;

  const slider = document.getElementById('temp-slider');
  const valDisplay = document.getElementById('temp-value-display');
  const modeBadge = document.getElementById('temp-mode-badge');
  const outputBox = document.getElementById('temp-sim-output');
  const gaugeFill = document.getElementById('temp-gauge-fill');

  const SAMPLES = {
    deterministic: {
      mode: "🔒 Mode Deterministik (0.0 - 0.2)",
      badgeClass: "mode-deterministic",
      text: `// Output Deterministik & Presisi Tinggi (Temperature 0.0)
function calculateCacheKey(namespace: string, id: string): string {
  if (!namespace || !id) {
    throw new InvalidArgumentException("Namespace and ID must be non-empty strings");
  }
  return \`cache:\${namespace.toLowerCase()}:\${id.trim()}\`;
}
// Karakteristik: Nol halusinasi, deterministik 100%, jawaban identik setiap kali dieksekusi.`
    },
    balanced: {
      mode: "⚖️ Mode Seimbang & Alami (0.3 - 0.7)",
      badgeClass: "mode-balanced",
      text: `Dalam arsitektur backend, caching adalah mekanisme penyimpanan sementara data di media berkecepatan tinggi (seperti RAM Redis atau Memcached).

Tujuan utamanya:
1. Memangkas latency respons (dari ~80ms query SQL menjadi <2ms cache hit).
2. Menghindari database bottleneck pada traffic puncak.

Strategi populer mencakup Cache-Aside (Lazy Loading) dan Write-Through.`
    },
    creative: {
      mode: "💡 Mode Kreatif & Ideasi (0.8 - 1.2)",
      badgeClass: "mode-creative",
      text: `Bayangkan caching seperti barista langganan yang sudah hafal racikan kopi espresso Anda tanpa Anda perlu membaca ulang seluruh daftar menu setiap pagi.

Dalam dunia sistem terdistribusi, caching adalah 'ingatan kilat' yang mencegah CPU lelah mengulang pertanyaan yang sama berulang kali ke rak gudang database yang jauh.`
    },
    wild: {
      mode: "🌪️ Mode Eksperimental & Acak (1.3 - 1.5)",
      badgeClass: "mode-wild",
      text: `Caching adalah teleportasi quantum informasi melintasi jurang keterlambatan clock cycle! Sebuah prisma cahaya di mana probabilitas bit dipadatkan menjadi kristal kecepatan murni sebelum waktu sempat merambat di kabel tembaga!`
    }
  };

  const updateSimulation = (tempVal) => {
    const val = parseFloat(tempVal);
    valDisplay.textContent = val.toFixed(1);

    const pct = (val / 1.5) * 100;
    gaugeFill.style.width = `${pct}%`;

    let data;
    if (val <= 0.2) {
      data = SAMPLES.deterministic;
      gaugeFill.style.background = '#0000FF';
    } else if (val <= 0.7) {
      data = SAMPLES.balanced;
      gaugeFill.style.background = 'linear-gradient(90deg, #0000FF, #0088FF)';
    } else if (val <= 1.2) {
      data = SAMPLES.creative;
      gaugeFill.style.background = 'linear-gradient(90deg, #0088FF, #FF6600)';
    } else {
      data = SAMPLES.wild;
      gaugeFill.style.background = 'linear-gradient(90deg, #FF6600, #FF0055)';
    }

    modeBadge.textContent = data.mode;
    modeBadge.className = `temp-mode-badge ${data.badgeClass}`;
    outputBox.textContent = data.text;
  };

  slider.addEventListener('input', (e) => updateSimulation(e.target.value));
  updateSimulation(slider.value);
}
