document.addEventListener('DOMContentLoaded', function () {
  var navLinks = document.querySelector('.nav-links');
  var indicator = document.querySelector('.nav-indicator');
  var activeLink = navLinks.querySelector('a.active');
  var links = navLinks.querySelectorAll('a:not(.saved-jobs-drawer)');

  if (!indicator || !activeLink) return;

  function moveIndicator(el) {
    var linkRect = el.getBoundingClientRect();
    var navRect = navLinks.getBoundingClientRect();
    var left = linkRect.left - navRect.left;
    var centerX = left + linkRect.width / 2;
    indicator.style.left = (centerX - indicator.offsetWidth / 2) + 'px';
  }

  // Position indicator on active link after layout settles
  requestAnimationFrame(function () {
    moveIndicator(activeLink);
    // Enable transitions only after initial positioning
    indicator.style.transition = 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
  });

  // Hover: slide indicator to hovered link
  links.forEach(function (link) {
    link.addEventListener('mouseenter', function () {
      moveIndicator(link);
    });
  });

  // Mouse leave: return indicator to active link
  navLinks.addEventListener('mouseleave', function () {
    moveIndicator(activeLink);
  });

  // Recalculate on resize
  window.addEventListener('resize', function () {
    // Temporarily disable transition for instant repositioning
    indicator.style.transition = 'none';
    moveIndicator(activeLink);
    // Re-enable after a frame
    requestAnimationFrame(function () {
      indicator.style.transition = 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  });
});
