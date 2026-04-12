/* =============================================
   ATLAS DANCE — Scripts
   ============================================= */

// --- Sticky nav ---
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// --- Mobile nav toggle ---
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

function openMobileNav() {
  navLinks.classList.add('open');
  toggle.setAttribute('aria-expanded', 'true');
  document.body.classList.add('nav-open');

  // Animate hamburger → X
  const spans = toggle.querySelectorAll('span');
  spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
  spans[1].style.opacity = '0';
  spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
}

function closeMobileNav() {
  navLinks.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-open');

  // Animate X → hamburger
  const spans = toggle.querySelectorAll('span');
  spans[0].style.transform = '';
  spans[1].style.opacity = '';
  spans[2].style.transform = '';
}

toggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.contains('open');
  if (isOpen) {
    closeMobileNav();
  } else {
    openMobileNav();
  }
});

// Close mobile nav when a link is clicked
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

// Close mobile nav on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks?.classList.contains('open')) {
    closeMobileNav();
    toggle.focus(); // return focus to toggle button
  }
});

// --- Hero logo sizing ---
// Show and size the logo only after it loads successfully
const heroLogo = document.querySelector('.hero-logo-img');

function sizeHeroLogo() {
  const title = document.querySelector('.hero-title');
  const tagline = document.querySelector('.hero-tagline');

  if (!title || !tagline || !heroLogo) return;

  const top = title.getBoundingClientRect().top;
  const bottom = tagline.getBoundingClientRect().bottom;
  const span = bottom - top;

  heroLogo.style.height = (span * 1.14) + 'px';
  heroLogo.style.width = 'auto';
}

if (heroLogo) {
  heroLogo.addEventListener('load', () => {
    heroLogo.classList.add('loaded');
    sizeHeroLogo();
  });
  // If already cached and loaded
  if (heroLogo.complete && heroLogo.naturalWidth > 0) {
    heroLogo.classList.add('loaded');
    sizeHeroLogo();
  }
}

window.addEventListener('resize', sizeHeroLogo);

// --- Scroll fade-in animations ---
// Skip animations entirely if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Make everything visible immediately
  document.querySelectorAll('.fade-up, .fade-up-children').forEach(el => {
    el.classList.add('visible');
  });
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.fade-up, .fade-up-children').forEach(el => {
    observer.observe(el);
  });
}

// --- Contact form handler (Formspree) ---
const form = document.getElementById('contact-form');
const successMsg = document.getElementById('form-success');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  const data = new FormData(form);

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' }
    });

    if (res.ok) {
      form.style.display = 'none';
      successMsg.style.display = 'block';
      // Move focus to success message for screen readers
      successMsg.focus();
    } else {
      btn.textContent = 'Something went wrong — please try again';
      btn.disabled = false;
    }
  } catch {
    btn.textContent = 'Something went wrong — please try again';
    btn.disabled = false;
  }
});
