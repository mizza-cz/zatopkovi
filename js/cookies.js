/* ==========================================================================
   Cookie Consent Banner
   ========================================================================== */
(function () {
  var BANNER_HTML =
    '<div class="cookie-banner__inner">' +
      '<p class="cookie-banner__text">Tento web používá cookies pro zajištění správného fungování webu a&nbsp;analýzu návštěvnosti. Více informací najdete v&nbsp;našich <a href="cookies.html">zásadách používání cookies</a>.</p>' +
      '<div class="cookie-banner__actions">' +
        '<button class="btn btn--secondary cookie-banner__btn" id="cookieReject">Odmítnout</button>' +
        '<button class="btn btn--primary cookie-banner__btn" id="cookieAccept">Přijmout vše</button>' +
      '</div>' +
    '</div>';

  function showBanner() {
    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = BANNER_HTML;
    document.body.appendChild(banner);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.classList.add('cookie-banner--visible');
      });
    });

    function closeBanner(value) {
      localStorage.setItem('cookieConsent', value);
      banner.classList.remove('cookie-banner--visible');
      setTimeout(function () { banner.remove(); }, 400);
    }

    document.getElementById('cookieAccept').addEventListener('click', function () {
      closeBanner('accepted');
    });

    document.getElementById('cookieReject').addEventListener('click', function () {
      closeBanner('rejected');
    });
  }

  // Show on first visit
  if (!localStorage.getItem('cookieConsent')) {
    showBanner();
  }

  // Allow re-opening from footer link
  var settingsLink = document.getElementById('cookieSettings');
  if (settingsLink) {
    settingsLink.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem('cookieConsent');
      updateStatusLabel();
      if (!document.querySelector('.cookie-banner')) {
        showBanner();
      }
    });
  }

  // Cookie status display on cookies.html
  var statusLabel = document.getElementById('cookieStatusLabel');
  var changeBtn = document.getElementById('cookieChange');

  function updateStatusLabel() {
    if (!statusLabel) return;
    var consent = localStorage.getItem('cookieConsent');
    var labels = {
      accepted: 'Cookies přijaty',
      rejected: 'Cookies odmítnuty'
    };
    statusLabel.textContent = labels[consent] || 'Nezvoleno';
  }

  updateStatusLabel();

  if (changeBtn) {
    changeBtn.addEventListener('click', function () {
      localStorage.removeItem('cookieConsent');
      updateStatusLabel();
      if (!document.querySelector('.cookie-banner')) {
        showBanner();
      }
    });
  }

  // Update status label when banner is closed (on same page)
  var origSetItem = localStorage.setItem;
  localStorage.setItem = function (key, value) {
    origSetItem.call(localStorage, key, value);
    if (key === 'cookieConsent') updateStatusLabel();
  };
})();
