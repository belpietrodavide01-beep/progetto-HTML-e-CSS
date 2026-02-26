
const EMAILJS_PUBLIC_KEY = '_-nOEkP9xBsDiWtDY';
const EMAILJS_SERVICE_ID = 'il mio sito';      
const EMAILJS_TEMPLATE_ID = 'template_3xnc553';

if (window.emailjs) {
  emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY,
    blockHeadless: true,
    limitRate: { id: 'portfolio', throttle: 10000 }
  });
}


document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--y', `${e.clientY - rect.top}px`);
  });
});

const introCard = document.querySelector('.card.intro');
const introChar = document.querySelector('.intro-character');
const canParallax = window.matchMedia('(pointer: fine)').matches;

if (introCard && introChar && canParallax) {
  introCard.addEventListener('mousemove', (e) => {
    const rect = introCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    introChar.style.transform = `translate(${x * 6}px, ${y * 6}px)`;
  });

  introCard.addEventListener('mouseleave', () => {
    introChar.style.transform = `translate(0px, 0px)`;
  });
}

document.querySelectorAll('.info-cards, .info-card').forEach(box => {
  box.addEventListener('mousemove', (e) => {
    const rect = box.getBoundingClientRect();
    box.style.setProperty('--x', `${e.clientX - rect.left}px`);
    box.style.setProperty('--y', `${e.clientY - rect.top}px`);
  });
});


const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');

function isValidEmail(value){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function setError(el, state){
  if (!el) return;
  el.classList.toggle('is-error', state);
}

if (contactForm && submitBtn && successMessage) {
  const nameEl = document.getElementById('name');
  const emailEl = document.getElementById('email');
  const subjectEl = document.getElementById('subject');
  const messageEl = document.getElementById('message');

  [nameEl, emailEl, subjectEl, messageEl].forEach(el => {
    if (!el) return;
    el.addEventListener('input', () => {
      if (el === emailEl) setError(el, el.value.trim() !== '' && !isValidEmail(el.value.trim()));
      else setError(el, el.value.trim() === '');
    });
  });

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameEl?.value.trim() || '';
    const email = emailEl?.value.trim() || '';
    const subject = subjectEl?.value.trim() || '';
    const message = messageEl?.value.trim() || '';

    const hasErrors = !name || !email || !isValidEmail(email) || !subject || !message;

    setError(nameEl, !name);
    setError(emailEl, !email || !isValidEmail(email));
    setError(subjectEl, !subject);
    setError(messageEl, !message);

    if (hasErrors) return;

    const oldText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;
    successMessage.classList.remove('show');

    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm);
      contactForm.reset();
      successMessage.classList.add('show');
      setTimeout(() => successMessage.classList.remove('show'), 4500);
    } catch (err) {
      console.error('EmailJS error:', err);
      alert('Errore durante l’invio. Riprova tra poco.');
    } finally {
      submitBtn.textContent = oldText;
      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;
    }
  });
}

const footerYear = document.getElementById('footerYear');
if (footerYear) footerYear.textContent = new Date().getFullYear();


document.documentElement.classList.add('js');

const revealTargets = [
  '.site-header',
  'main .title-section',
  '.about-title',
  '.bento-grid .card',
  '.projects-title',
  '.slider',
  '.feedback-section',
  '.contact-section',
  '.site-footer-minimal'
];

const elements = document.querySelectorAll(revealTargets.join(', '));
elements.forEach(el => el.classList.add('reveal'));

const bento = document.querySelectorAll('.bento-grid .card');
bento.forEach((el, i) => el.classList.add(`d${Math.min(i + 1, 4)}`));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.18 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


(function initFeedbackLoop(){
  const slider = document.querySelector('.feedback-slider');
  const track = document.querySelector('.feedback-track');
  if (!slider || !track) return;

  if (!track.dataset.cloned) {
    track.innerHTML += track.innerHTML;
    track.dataset.cloned = '1';
  }

  slider.style.setProperty('--fbDur', '16s');

  const computeShift = () => {
    const children = Array.from(track.children);
    const half = Math.floor(children.length / 2);

    let width = 0;
    const gap = parseFloat(getComputedStyle(track).gap || '0');

    for (let i = 0; i < half; i++) {
      width += children[i].getBoundingClientRect().width + gap;
    }

    track.style.setProperty('--fbShift', `${Math.max(0, Math.floor(width))}px`);
  };

  computeShift();
  window.addEventListener('resize', computeShift);
})();


(function initMobileNav(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (!toggle || !nav) return;

  const open = () => {
    document.body.classList.add('nav-open', 'no-scroll');
    toggle.setAttribute('aria-expanded', 'true');
  };

  const close = () => {
    document.body.classList.remove('nav-open', 'no-scroll');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = document.body.classList.contains('nav-open');
    if (isOpen) close();
    else open();
  });

  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  nav.addEventListener('click', (e) => {
    if (e.target === nav) close();
  });
})();

(function () {
  function initMobileMenu(){
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    if (!toggle || !nav) return;

    const openMenu = () => {
      document.body.classList.add('nav-open', 'no-scroll');
      toggle.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
      document.body.classList.remove('nav-open', 'no-scroll');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = document.body.classList.contains('nav-open');
      isOpen ? closeMenu() : openMenu();
    });

    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => closeMenu());
    });

    nav.addEventListener('click', (e) => {
      if (e.target === nav) closeMenu();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  try {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
      initMobileMenu();
    }
  } catch (err) {
    console.error('Menu init error:', err);
  }
})();

(function initMobileMenu(){
  const header = document.querySelector('.site-header') || document.querySelector('header');
  if (!header) return;

  let nav = header.querySelector('.nav');
  if (!nav) {
    nav = document.createElement('nav');
    nav.className = 'nav';
    nav.setAttribute('aria-label', 'Primary');
    header.appendChild(nav);
  }

  if (!nav.querySelector('.nav-link')) {
    const links = [
      { href: '#home', text: 'Home' },
      { href: '#progetti', text: 'Progetti' },
      { href: '#recensioni', text: 'Recensioni' },
    ];
    links.forEach(l => {
      const a = document.createElement('a');
      a.className = 'nav-link';
      a.href = l.href;
      a.textContent = l.text;
      nav.appendChild(a);
    });
  }

  let toggle = header.querySelector('.nav-toggle');
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Apri menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span></span><span></span><span></span>';

    const logo = header.querySelector('.logo');
    if (logo) header.insertBefore(toggle, logo);
    else header.insertBefore(toggle, header.firstChild);
  }

  let overlay = document.querySelector('.nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
  }

  let panel = document.querySelector('.nav-panel');
  if (!panel) {
    panel = document.createElement('div');
    panel.className = 'nav-panel';
    document.body.appendChild(panel);
  }

  
  const rebuildPanel = () => {
    panel.innerHTML = '';
    const navClone = nav.cloneNode(true);
    panel.appendChild(navClone);
    navClone.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => closeMenu());
    });
  };
  rebuildPanel();

  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  function openMenu(){
    if (!isMobile()) return;
    document.body.classList.add('nav-open', 'no-scroll');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Chiudi menu');
  }

  function closeMenu(){
    document.body.classList.remove('nav-open', 'no-scroll');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Apri menu');
  }

  function toggleMenu(){
    const open = document.body.classList.contains('nav-open');
    if (open) closeMenu();
    else openMenu();
  }

  toggle.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (!isMobile()) closeMenu();
    rebuildPanel();
  });
})();