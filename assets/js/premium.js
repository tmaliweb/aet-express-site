/* ============================================
   PREMIUM INTERACTIONS ENGINE
   Custom cursor, 3D tilt, counters, parallax,
   magnetic buttons, text reveals, scroll progress
   ============================================ */

(function () {
  'use strict';

  // ── SCROLL PROGRESS BAR ──────────────────────
  var progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  progressBar.style.cssText =
    'position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,#10B981,#D4956B);z-index:10000;transition:width .15s linear;width:0;pointer-events:none;';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', function () {
    var h = document.documentElement;
    var pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    progressBar.style.width = pct + '%';
  });

  // ── CUSTOM CURSOR ────────────────────────────
  if (window.innerWidth > 991) {
    var cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    cursor.innerHTML = '<div id="cursor-dot"></div><div id="cursor-ring"></div>';
    document.body.appendChild(cursor);

    var dot = document.getElementById('cursor-dot');
    var ring = document.getElementById('cursor-ring');
    var mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = 'translate(' + mouseX + 'px,' + mouseY + 'px)';
    });

    // Smooth ring follow
    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.transform = 'translate(' + ringX + 'px,' + ringY + 'px)';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover states
    var hoverTargets = 'a, button, .btn, .service-box, .nav-link, .testimonial-text';
    document.querySelectorAll(hoverTargets).forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        ring.classList.add('cursor-hover');
        dot.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', function () {
        ring.classList.remove('cursor-hover');
        dot.classList.remove('cursor-hover');
      });
    });
  }

  // ── 3D TILT ON SERVICE CARDS ─────────────────
  document.querySelectorAll('.service-box').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = ((y - centerY) / centerY) * -6;
      var rotateY = ((x - centerX) / centerX) * 6;
      card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
      card.style.transition = 'transform 0.6s cubic-bezier(.4,0,.2,1)';
    });

    card.addEventListener('mouseenter', function () {
      card.style.transition = 'transform 0.1s ease-out';
    });
  });

  // ── ANIMATED COUNTERS ────────────────────────
  function animateCounter(el) {
    var text = el.textContent.trim();
    var hasPlus = text.indexOf('+') > -1;
    var hasDot = text.indexOf('.') > -1;
    var numStr = text.replace(/[^0-9.]/g, '');
    var target = parseFloat(numStr);
    if (isNaN(target)) return;

    var duration = 2000;
    var start = null;
    var decimals = hasDot ? 1 : 0;
    var comma = target >= 1000;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = eased * target;

      var display = current.toFixed(decimals);
      if (comma) {
        display = Number(current.toFixed(0)).toLocaleString();
      }

      if (hasPlus) {
        el.innerHTML = display + '<span class="accent">+</span>';
      } else {
        el.textContent = display;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    el.textContent = '0';
    requestAnimationFrame(step);
  }

  // Observe trust numbers
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.trust-number').forEach(function (el) {
    counterObserver.observe(el);
  });

  // ── MAGNETIC BUTTONS ─────────────────────────
  if (window.innerWidth > 991) {
    document.querySelectorAll('.btn-primary, .btn-rose').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.2) + 'px,' + (y * 0.2) + 'px) translateY(-2px)';
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = 'translate(0,0) translateY(0)';
        btn.style.transition = 'transform 0.5s cubic-bezier(.4,0,.2,1)';
      });

      btn.addEventListener('mouseenter', function () {
        btn.style.transition = 'transform 0.15s ease-out';
      });
    });
  }

  // ── PARALLAX HERO ────────────────────────────
  var hero = document.querySelector('#hero .slider');
  if (hero) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        hero.style.backgroundPositionY = (y * 0.4) + 'px';
      }
    });
  }

  // ── TEXT REVEAL ANIMATION ────────────────────
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal-text').forEach(function (el) {
    revealObserver.observe(el);
  });

  // ── IMAGE REVEAL ON SCROLL ───────────────────
  var imgObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('img-revealed');
        imgObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.box-img, .service-section img').forEach(function (el) {
    el.classList.add('img-reveal');
    imgObserver.observe(el);
  });

  // ── STAGGER CHILDREN ON SCROLL ───────────────
  var staggerObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var children = entry.target.querySelectorAll('.service-box, .testimonials-content');
        children.forEach(function (child, i) {
          child.style.transitionDelay = (i * 0.1) + 's';
          child.classList.add('stagger-visible');
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.our-best-service .row, .about-us-section .row').forEach(function (row) {
    if (row.querySelector('.service-box, .testimonials-content')) {
      staggerObserver.observe(row);
    }
  });

  // ── NAVBAR BLUR INTENSIFY ON SCROLL ──────────
  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // ── SMOOTH ANCHOR SCROLLING ──────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── PRELOADER ENHANCEMENT ────────────────────
  window.addEventListener('load', function () {
    var loader = document.getElementById('loading');
    if (loader) {
      loader.style.transition = 'opacity 0.6s ease, visibility 0.6s ease';
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
      setTimeout(function () {
        loader.style.display = 'none';
      }, 600);
    }

    // Trigger hero text animation after load
    var heroText = document.querySelector('.slider_text');
    if (heroText) {
      heroText.classList.add('hero-loaded');
    }
  });

})();
