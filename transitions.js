/* ===== Barba.js Page Transitions ===== */
window.BMO = window.BMO || {};

window.BMO.Transitions = {
  // Map namespace to href and page title
  pageMap: {
    home:   { href: 'index.html',       title: 'BMO Careers - You Belong Here' },
    campus: { href: 'campus.html',      title: 'BMO Careers - Campus' },
    work:   { href: 'work-at-bmo.html', title: 'BMO Careers - Work at BMO' },
    teams:  { href: 'our-teams.html',   title: 'BMO Careers - Our Teams' },
  },

  init: function () {
    if (typeof barba === 'undefined' || typeof gsap === 'undefined') return;

    var self = this;

    barba.init({
      preventRunning: true,
      cacheIgnore: true,
      prefetchIgnore: true,
      debug: false,
      transitions: [{
        name: 'fade',
        leave: function (data) {
          return gsap.to(data.current.container, {
            opacity: 0,
            duration: 0.3,
            ease: 'power1.inOut',
          });
        },
        enter: function (data) {
          // Scroll to top before entering
          if (window.BMO.Scroll) {
            window.BMO.Scroll.scrollToTop();
          } else {
            window.scrollTo(0, 0);
          }
          // Use set + to pattern (more reliable than gsap.from)
          gsap.set(data.next.container, { opacity: 0 });
          return gsap.to(data.next.container, {
            opacity: 1,
            duration: 0.3,
            ease: 'power1.inOut',
          });
        },
      }],
    });

    // After every page transition completes
    barba.hooks.afterEnter(function (data) {
      self._reinit(data);
    });

    // Before leaving: clean up
    barba.hooks.beforeLeave(function () {
      if (window.BMO.Animations) window.BMO.Animations.destroy();
    });
  },

  _reinit: function (data) {
    var namespace = data.next.namespace;
    var pageInfo = this.pageMap[namespace];

    // Update page title
    if (pageInfo) {
      document.title = pageInfo.title;
    }

    // Update active nav link class on the persistent header
    if (pageInfo) {
      var navLinks = document.querySelectorAll('.nav-links a:not(.saved-jobs-drawer)');
      var activeHref = pageInfo.href;
      navLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === activeHref) {
          link.classList.add('active');
        }
      });
    }

    // Re-init nav indicator (picks up new .active, re-binds hover)
    if (window.BMO.Nav) {
      window.BMO.Nav.init();
    }

    // Close mobile nav drawer if open
    var navToggle = document.getElementById('nav-toggle');
    if (navToggle) navToggle.checked = false;

    // Remove no-js class (in case it's on the new page)
    document.documentElement.classList.remove('no-js');

    // Re-init scroll animations for new page content
    if (window.BMO.Animations) window.BMO.Animations.init();

    // Refresh ScrollTrigger after layout settles
    if (typeof ScrollTrigger !== 'undefined') {
      requestAnimationFrame(function () {
        ScrollTrigger.refresh();
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', function () {
  window.BMO.Transitions.init();
});
