/* ===== Lenis Smooth Scroll ===== */
window.BMO = window.BMO || {};

window.BMO.Scroll = {
  lenis: null,

  init: function () {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof Lenis === 'undefined') return;

    // Destroy existing instance if re-initializing
    if (this.lenis) this.lenis.destroy();

    this.lenis = new Lenis({
      duration: 1.2,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      smoothWheel: true,
      smoothTouch: false,
    });

    // Integrate with GSAP ticker if available
    if (typeof gsap !== 'undefined') {
      this.lenis.on('scroll', function () {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
      });

      var self = this;
      gsap.ticker.add(function (time) {
        self.lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      // Standalone RAF loop if no GSAP
      var self = this;
      function raf(time) {
        self.lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  },

  scrollToTop: function () {
    if (this.lenis) {
      this.lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  },

  destroy: function () {
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
  }
};

document.addEventListener('DOMContentLoaded', function () {
  window.BMO.Scroll.init();
});
