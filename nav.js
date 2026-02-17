/* ===== Navigation Indicator ===== */
window.BMO = window.BMO || {};

window.BMO.Nav = {
  indicator: null,
  activeLink: null,
  navLinks: null,
  links: null,
  _abortController: null,

  init: function () {
    // Abort all previous listeners so we don't duplicate
    if (this._abortController) this._abortController.abort();
    this._abortController = new AbortController();
    var signal = this._abortController.signal;

    this.navLinks = document.querySelector('.nav-links');
    this.indicator = document.querySelector('.nav-indicator');
    if (!this.navLinks || !this.indicator) return;

    this.activeLink = this.navLinks.querySelector('a.active');
    this.links = this.navLinks.querySelectorAll('a:not(.saved-jobs-drawer)');

    if (!this.activeLink) return;

    var self = this;

    // Position indicator on active link after layout settles
    requestAnimationFrame(function () {
      self.indicator.style.transition = 'none';
      self._moveIndicator(self.activeLink);
      // Enable transitions only after initial positioning
      requestAnimationFrame(function () {
        self.indicator.style.transition = 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
      });
    });

    // Hover: slide indicator to hovered link
    this.links.forEach(function (link) {
      link.addEventListener('mouseenter', function () {
        self._moveIndicator(link);
      }, { signal: signal });
    });

    // Mouse leave: return indicator to active link
    this.navLinks.addEventListener('mouseleave', function () {
      self._moveIndicator(self.activeLink);
    }, { signal: signal });

    // Recalculate on resize
    window.addEventListener('resize', function () {
      self.indicator.style.transition = 'none';
      self._moveIndicator(self.activeLink);
      requestAnimationFrame(function () {
        self.indicator.style.transition = 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
      });
    }, { signal: signal });
  },

  _moveIndicator: function (el) {
    if (!el || !this.navLinks || !this.indicator) return;
    var linkRect = el.getBoundingClientRect();
    var navRect = this.navLinks.getBoundingClientRect();
    var left = linkRect.left - navRect.left;
    var centerX = left + linkRect.width / 2;
    this.indicator.style.left = (centerX - this.indicator.offsetWidth / 2) + 'px';
  }
};

document.addEventListener('DOMContentLoaded', function () {
  window.BMO.Nav.init();
});
