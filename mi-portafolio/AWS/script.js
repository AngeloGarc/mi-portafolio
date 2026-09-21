// ===== Menú responsive =====
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');

function toggleMenu(force) {
  const open = force !== undefined ? force : !navLinks.classList.contains('open');
  navLinks.classList.toggle('open', open);
  menuBtn.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}

menuBtn.addEventListener('click', () => toggleMenu());

// Cerrar menú al hacer clic en un enlace (navegación suave)
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => toggleMenu(false));
});

// Cerrar con tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') toggleMenu(false);
});

// Resaltar enlace activo al hacer scroll
const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((a) =>
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`)
        );
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);
sections.forEach((s) => sectionObserver.observe(s));

// ===== Modo oscuro elegante =====
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') {
    root.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    root.setAttribute('data-theme', 'dark');
  }
}

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});
initTheme();

// ===== Animaciones suaves de aparición =====
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ===== Validación básica del formulario =====
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function setError(input, message) {
  const group = input.closest('.form-group');
  group.classList.toggle('invalid', Boolean(message));
  group.querySelector('.error-msg').textContent = message || '';
  return !message;
}

function validateField(input) {
  const value = input.value.trim();
  if (input.id === 'nombre') {
    if (!value) return setError(input, 'Por favor ingresa tu nombre.');
    if (value.length < 2) return setError(input, 'El nombre debe tener al menos 2 caracteres.');
  }
  if (input.id === 'email') {
    if (!value) return setError(input, 'Por favor ingresa tu correo.');
    if (!emailRegex.test(value)) return setError(input, 'Ingresa un correo válido (ej. nombre@dominio.com).');
  }
  if (input.id === 'mensaje') {
    if (!value) return setError(input, 'Por favor escribe tu mensaje.');
    if (value.length < 10) return setError(input, 'El mensaje debe tener al menos 10 caracteres.');
  }
  return setError(input, '');
}

// Validación en tiempo real
form.querySelectorAll('input, textarea').forEach((input) => {
  input.addEventListener('input', () => {
    validateField(input);
    status.textContent = '';
    status.className = 'form-status';
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputs = [...form.querySelectorAll('input, textarea')];
  const valid = inputs.map(validateField).every(Boolean);

  if (!valid) {
    status.textContent = '⚠️ Revisa los campos marcados en rojo.';
    status.className = 'form-status error';
    form.querySelector('.form-group.invalid input, .form-group.invalid textarea')?.focus();
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  // Simulación de envío (aquí conectarías tu backend o servicio como Formspree)
  setTimeout(() => {
    status.textContent = '✅ ¡Mensaje enviado! Gracias por contactarme, te responderé pronto.';
    status.className = 'form-status success';
    form.reset();
    btn.disabled = false;
    btn.textContent = 'Enviar mensaje';
  }, 900);
});

// ===== Año dinámico =====
document.getElementById('year').textContent = new Date().getFullYear();
