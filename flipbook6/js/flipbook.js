import { initWishes } from './wishes.js';
//import { initRsvp } from './rsvp.js';

const segments = window.location.pathname
  .split('/')
  .filter(Boolean);

const groupName = segments[0] || 'default';

initWishes(groupName);
//initRsvp(groupName);

document.addEventListener("DOMContentLoaded", () => {
  let pageFlip;
  const pages = [
    "img/1.png",
    "img/2.png",
    "img/3.png",
    "img/4.png",
    "img/5.png",
    "img/6.png", // RSVP PAGE
    "img/7.png",
    "img/8.png"
  ];

  const flipbookEl = document.getElementById("flipbook");
  const indicator = document.getElementById("pageIndicator");

  function isSinglePage() {
    return window.innerWidth < 768 && window.innerHeight > window.innerWidth;
  }

  /* ===============================
     BUILD PAGES (+ RSVP HOTSPOT)
  =============================== */
  function buildPages() {
    return pages
      .map((img, index) => {
        const isUcapanPage = index === 5;
        const isSavePage = index === 2;

        return `
          <div class="page">
            <img src="${img}" alt="">

            ${isUcapanPage ? `
              <img src="img/btn-ucapan.png" class="overlay-item wishes-overlay" data-bs-toggle="modal" data-bs-target="#wishes">
            ` : ""}

            ${isSavePage ? `
              <a href="https://www.google.com/maps/place/Ritz-Carlton+Jkt,+Kuningan,+Kuningan+Tim.,+Kecamatan+Setiabudi,+Kota+Jakarta+Selatan,+Daerah+Khusus+Ibukota+Jakarta+12950/@-6.2285518,106.8246668,17z/data=!3m1!4b1!4m6!3m5!1s0x2e69f3e522f87729:0xdefece2f325ccb3d!8m2!3d-6.2285571!4d106.8272417!16s%2Fg%2F11yqrt3fq7?entry=ttu&g_ep=EgoyMDI2MDIwOC4wIKXMDSoASAFQAw%3D%3D" target="_blank"><img src="img/btn-lokasi.png" class="overlay-item location-overlay"></a>
            ` : ""}
          </div>
        `;
      })
      .join("");
  }

  /* ===============================
     INIT FLIPBOOK
  =============================== */
  function initFlipbook() {
    if (pageFlip) {
      pageFlip.destroy();
      pageFlip = null;
    }

    flipbookEl.innerHTML = buildPages();

    const singlePage = isSinglePage();

    pageFlip = new St.PageFlip(flipbookEl, {
      width: 415,
      height: 640,
      size: singlePage ? "stretch" : "fixed",
      minWidth: 315,
      maxWidth: 1000,
      minHeight: 420,
      maxHeight: 1350,
      showCover: !singlePage,
      mobileScrollSupport: false,
      useMouseEvents: true,
    });

    pageFlip.loadFromHTML(document.querySelectorAll(".page"));

    pageFlip.on("flip", e => {
      indicator.textContent = `${e.data + 1} / ${pageFlip.getPageCount()}`;
    });

    indicator.textContent = `1 / ${pageFlip.getPageCount()}`;
  }

  /* ===============================
     NAV BUTTON
  =============================== */
  document.getElementById("prevBtn").onclick = () => pageFlip.flipPrev();
  document.getElementById("nextBtn").onclick = () => pageFlip.flipNext();

  /* ===============================
     HINT
  =============================== */
  const hint = document.getElementById("hintSwipe");

  if (!localStorage.getItem("flipHintShown")) {
    hint.style.display = "block";
    localStorage.setItem("flipHintShown", "yes");

    setTimeout(() => {
      hint.style.display = "none";
    }, 4000);
  }

  pages.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  /* ===============================
   PRELOAD IMAGES & INIT
  =============================== */
  const preloadImages = () => {
    const promises = pages.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = resolve; // Tetap lanjut meski 1 gambar error
      });
    });
    return Promise.all(promises);
  };

  // Tambahkan fungsi ini untuk menangani isolasi klik
function setupOverlayEvents() {
  const overlays = document.querySelectorAll('.overlay-item');
  
  overlays.forEach(button => {
    // 1. Hentikan 'click' agar tidak memicu flip otomatis
    button.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // 2. Hentikan 'mousedown' & 'touchstart' 
    // Ini adalah kunci agar page-flip tidak menganggapnya awal dari tarikan (drag)
    const stopPropagation = (e) => {
      e.stopPropagation();
    };

    button.addEventListener('mousedown', stopPropagation);
    button.addEventListener('touchstart', stopPropagation, { passive: true });
    button.addEventListener('pointerdown', stopPropagation);
  });
}

// Panggil di dalam preloadImages().then(...)
preloadImages().then(() => {
  initFlipbook();
  setupOverlayEvents(); // <--- Panggil fungsi di sini
});

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initFlipbook, 300);
  });

  /* ===============================
     MUSIC
  =============================== */
  const bgMusic = document.getElementById("bgMusic");
  const musicBtn = document.getElementById("musicToggle");

  bgMusic.volume = 0.4;

  function tryPlayMusic() {
    bgMusic.play().catch(() => {});
    document.removeEventListener("click", tryPlayMusic);
    document.removeEventListener("touchstart", tryPlayMusic);
  }

  document.addEventListener("click", tryPlayMusic);
  document.addEventListener("touchstart", tryPlayMusic);

  musicBtn.onclick = () => {
    if (bgMusic.paused) {
      bgMusic.play().catch(() => {});
      musicBtn.textContent = "🔊";
    } else {
      bgMusic.pause();
      musicBtn.textContent = "🔇";
    }
  };

  /* ===============================
     COVER GATE
  =============================== */
  const coverGate = document.getElementById("coverGate");
  const openBtn = document.getElementById("openInvitation");

  openBtn.onclick = () => {
    coverGate.style.transition = "transform 1.3s ease, opacity 1.2s ease";
    coverGate.style.transform = "translateY(-100%)";
    coverGate.style.opacity = "0";
    coverGate.style.pointerEvents = "none";

    bgMusic.play().catch(() => {});
  };

  /* ===============================
     GUEST NAME
  =============================== */
  const params = new URLSearchParams(window.location.search);
  const guest = params.get("to");
  const guestEl = document.getElementById("guestName");
  if (guest && guestEl) guestEl.textContent = guest;

});
