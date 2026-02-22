/* =============================
   JavaScript principal - main.js
   - Control del menú móvil
   - Efectos de parallax/hover para hero (animaciones suaves)
   - Mantener modular y preparado para agregar funciones
   ============================= */

(() => {
  // Safety: no ejecutar heavy animations si user prefiere reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------
     NAV TOGGLE (móvil)
     ---------------------------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');

      // Simple hamburger animation class (CSS can target .is-active if desired)
      navToggle.classList.toggle('is-active', open);
    });

    // Close nav when clicking a link (mobile)
    mainNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (mainNav.classList.contains('open')) {
          mainNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.classList.remove('is-active');
        }
      });
    });
  }

  /* ----------------------------
     HERO POINTER EFFECTS (parallax + rings + background subtle move)
     ---------------------------- */
  const hero = document.getElementById('hero');
  if (hero && !prefersReduced) {
    // Create 2 decorative rings that follow the cursor for a "magical" feel
    const ring1 = document.createElement('div');
    const ring2 = document.createElement('div');
    ring1.className = 'ring';
    ring2.className = 'ring';
    ring1.style.boxShadow = '0 0 90px 24px rgba(255,210,77,0.08)';
    ring2.style.boxShadow = '0 0 60px 18px rgba(30,167,255,0.08)';
    hero.appendChild(ring1);
    hero.appendChild(ring2);

    let lastX = 0, lastY = 0;
    let raf = null;

    function onMove(e) {
      const x = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
      const y = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
      lastX = x;
      lastY = y;

      if (!raf) {
        raf = requestAnimationFrame(() => {
          // position rings
          ring1.style.left = `${lastX}px`;
          ring1.style.top = `${lastY}px`;
          ring1.style.opacity = '0.98';
          ring1.style.transform = 'translate(-50%,-50%) scale(1)';

          ring2.style.left = `${lastX + 30}px`;
          ring2.style.top = `${lastY + 20}px`;
          ring2.style.opacity = '0.85';
          ring2.style.transform = 'translate(-50%,-50%) scale(0.86)';

          // slight parallax for content
          const rect = hero.getBoundingClientRect();
          const relX = (lastX - (rect.left + rect.width / 2)) / rect.width;
          const relY = (lastY - (rect.top + rect.height / 2)) / rect.height;
          const depth = 18;

          const content = hero.querySelector('.hero-content');
          if (content) {
            content.style.transform = `translate3d(${relX * depth}px, ${relY * depth}px, 0)`;
          }

          // subtle background position shift (parallax feel)
          const bgX = 50 + relX * 4; // small shift
          const bgY = 50 + relY * 4;
          hero.style.backgroundPosition = `${bgX}% ${bgY}%`;

          raf = null;
        });
      }
    }

    function onLeave() {
      ring1.style.opacity = '0';
      ring1.style.transform = 'translate(-50%,-50%) scale(.4)';
      ring2.style.opacity = '0';
      ring2.style.transform = 'translate(-50%,-50%) scale(.4)';
      const content = hero.querySelector('.hero-content');
      if (content) content.style.transform = `translate3d(0,0,0)`;
      hero.style.backgroundPosition = `50% 50%`;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
    }

    // Events
    hero.addEventListener('mousemove', onMove, { passive: true });
    hero.addEventListener('touchmove', onMove, { passive: true });
    hero.addEventListener('mouseleave', onLeave, { passive: true });
    hero.addEventListener('touchend', onLeave, { passive: true });

    // subtle ambient animation (shifting background)
    let t = 0;
    function ambientLoop() {
      t += 0.0018;
      const x = Math.sin(t) * 3;
      const y = Math.cos(t) * 2;
      hero.style.setProperty('--ambient-x', `${x}px`);
      hero.style.setProperty('--ambient-y', `${y}px`);
      requestAnimationFrame(ambientLoop);
    }
    ambientLoop();
  } // end hero effects

  // Debug:
  // console.log("Orion Studio JS cargado");
})();
