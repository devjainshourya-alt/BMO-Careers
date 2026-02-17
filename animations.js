/* ===== GSAP ScrollTrigger Animations ===== */
window.BMO = window.BMO || {};

window.BMO.Animations = {
  init: function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    this.animateHero();
    this.animateHeroParallax();
    this._revealOnScroll('.section-head');
    this._revealOnScroll('.job-card', true);
    this._revealOnScroll('.career-card', true);
    this._revealOnScroll('.article-card', true);
    this._revealOnScroll('.commitment-header');
    this._revealOnScroll('.commitment-card', true);
    this._revealOnScroll('.career-paths-header');
    this._revealOnScroll('.testimonials-header');
    this._revealOnScroll('.testimonial-quote', true);
    this._revealOnScroll('.video-testimonial', true);
    this._revealOnScroll('.team-card', true);
    this._revealOnScroll('.talent-cta-content');
  },

  destroy: function () {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
    }
    // Clear any inline styles GSAP may have set
    var selectors = [
      '.hero-text-group', '.search-bar',
      '.section-head', '.job-card', '.career-card', '.article-card',
      '.talent-cta-content', '.commitment-card', '.commitment-header',
      '.testimonial-quote', '.video-testimonial', '.team-card',
      '.career-paths-header', '.testimonials-header'
    ];
    var els = document.querySelectorAll(selectors.join(','));
    els.forEach(function (el) {
      gsap.set(el, { clearProps: 'all' });
    });
  },

  // --- Hero entrance (immediate, no scroll trigger) ---
  animateHero: function () {
    var textGroup = document.querySelector('.hero-text-group');
    var searchBar = document.querySelector('.search-bar');
    if (!textGroup) return;

    gsap.set(textGroup, { opacity: 0, y: 30 });
    if (searchBar) gsap.set(searchBar, { opacity: 0, y: 20 });

    var tl = gsap.timeline({ delay: 0.1, defaults: { ease: 'power2.out' } });
    tl.to(textGroup, { opacity: 1, y: 0, duration: 0.7 });
    if (searchBar) {
      tl.to(searchBar, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3');
    }
  },

  // --- Hero parallax (desktop only) ---
  animateHeroParallax: function () {
    var heroBg = document.querySelector('.hero-bg');
    if (!heroBg || window.innerWidth < 768) return;

    gsap.to(heroBg, {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
      y: '25%',
      ease: 'none',
    });
  },

  // --- Generic scroll reveal ---
  // Uses gsap.set + gsap.to pattern (not gsap.from) for reliability
  _revealOnScroll: function (selector, stagger) {
    var elements = gsap.utils.toArray(selector);
    if (!elements.length) return;

    if (stagger) {
      // Group by parent for independent stagger per section
      var groups = this._groupByParent(elements);
      var self = this;
      groups.forEach(function (group) {
        // Set initial state
        gsap.set(group, { opacity: 0, y: 40 });
        // Create a ScrollTrigger for the first element in group
        ScrollTrigger.create({
          trigger: group[0].parentNode,
          start: 'top 85%',
          once: true,
          onEnter: function () {
            gsap.to(group, {
              opacity: 1, y: 0,
              duration: 0.6,
              stagger: 0.12,
              ease: 'power2.out',
            });
          }
        });
      });
    } else {
      elements.forEach(function (el) {
        gsap.set(el, { opacity: 0, y: 30 });
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: function () {
            gsap.to(el, {
              opacity: 1, y: 0,
              duration: 0.6,
              ease: 'power2.out',
            });
          }
        });
      });
    }
  },

  // Helper: group elements by their parent node
  _groupByParent: function (elements) {
    var map = new Map();
    elements.forEach(function (el) {
      var parent = el.parentNode;
      if (!map.has(parent)) map.set(parent, []);
      map.get(parent).push(el);
    });
    return Array.from(map.values());
  }
};

// Remove no-js class and auto-init
document.addEventListener('DOMContentLoaded', function () {
  document.documentElement.classList.remove('no-js');
  window.BMO.Animations.init();
});
