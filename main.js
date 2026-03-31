// ─── Theme Toggle ───
(function () {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = root.getAttribute('data-theme') || 
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  root.setAttribute('data-theme', theme);
  updateToggleIcon(toggle, theme);

  toggle && toggle.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    updateToggleIcon(toggle, theme);
    toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  });

  function updateToggleIcon(btn, mode) {
    if (!btn) return;
    btn.innerHTML = mode === 'dark'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }
})();

// ─── Mobile Menu ───
(function () {
  const btn = document.getElementById('menuBtn');
  const nav = document.getElementById('mobileNav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', isOpen);
    nav.setAttribute('aria-hidden', !isOpen);
  });

  // Close on nav link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      nav.setAttribute('aria-hidden', 'true');
    });
  });
})();

// ─── Scroll reveal animations ───
(function () {
  if (!('IntersectionObserver' in window)) return;

  const revealEls = document.querySelectorAll(
    '.for-you-card, .service-item, .pricing-card, .why-value, .why-text'
  );

  revealEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${(i % 4) * 0.08}s, transform 0.5s ease ${(i % 4) * 0.08}s`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));
})();

// ─── Sticky header shadow on scroll ───
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 10
      ? '0 1px 12px rgba(28,18,8,0.08)'
      : 'none';
  }, { passive: true });
})();

// ─── Contact form submission ───
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const btn = form.querySelector('[type="submit"]');
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();

    if (!name || !email) {
      showFormMessage(form, 'Please fill in your name and email.', 'error');
      return;
    }

    // Simulate submission
    btn.disabled = true;
    btn.textContent = 'Sending…';

    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Send Inquiry';
      form.reset();
      showFormMessage(
        form,
        '✓ Inquiry received. Thank you — I\'ll be in touch within 2–3 business days.',
        'success'
      );
    }, 1200);
  });

  function showFormMessage(form, text, type) {
    let msg = form.querySelector('.form-message');
    if (!msg) {
      msg = document.createElement('p');
      msg.className = 'form-message';
      form.appendChild(msg);
    }
    msg.textContent = text;
    msg.style.cssText = `
      font-size: 0.875rem;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      margin-top: 0.5rem;
      ${type === 'success'
        ? 'background: #F0F7EB; color: #2E6010; border: 1px solid #C5DFB5;'
        : 'background: #FBF0ED; color: #9B4A37; border: 1px solid #EECEC7;'}
    `;
  }
})();
