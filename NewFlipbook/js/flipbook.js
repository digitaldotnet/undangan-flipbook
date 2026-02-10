document.addEventListener("DOMContentLoaded", () => {
  let pageFlip;
  const pages = [
    "img/1.png",
    "img/2.png",
    "img/3.png",
    "img/4.png",
    "img/5.png",
    "img/6.png",
    "img/7.png",
    "img/8.png",
    "img/9.png",
  ];

  const flipbookEl = document.getElementById("flipbook");
  const indicator = document.getElementById("pageIndicator");

  function isSinglePage() {
    return window.innerWidth < 768 && window.innerHeight > window.innerWidth;
  }

  function buildPages() {
    return pages
      .map(
        img => `
        <div class="page">
          <img src="${img}" alt="">
        </div>`
      )
      .join("");
  }

  function initFlipbook() {
    // destroy sebelumnya
    if (pageFlip) {
      pageFlip.destroy();
      pageFlip = null;
    }

    // rebuild DOM
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
      showCover: !singlePage, // 🔑 KUNCI UTAMA
      mobileScrollSupport: false,
      useMouseEvents: true,
    });

    pageFlip.loadFromHTML(document.querySelectorAll(".page"));

    pageFlip.on("flip", e => {
      indicator.textContent = `${e.data + 1} / ${pageFlip.getPageCount()}`;
    });

    pageFlip.on("flip", () => {
      prevBtn.disabled = pageFlip.getCurrentPageIndex() === 0;
      nextBtn.disabled =
        pageFlip.getCurrentPageIndex() === pageFlip.getPageCount() - 1;
    });

    indicator.textContent = `1 / ${pageFlip.getPageCount()}`;    
  }

  // tombol navigasi
  document.getElementById("prevBtn").onclick = () => pageFlip.flipPrev();
  document.getElementById("nextBtn").onclick = () => pageFlip.flipNext();

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
  // init pertama
  initFlipbook();

  // 🔁 resize / rotate handler (INI YANG KAMU KELEWAT)
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initFlipbook, 300);
  });

  // music
  const audio = document.getElementById("bgMusic");

  function tryPlayMusic() {
    audio.play().catch(() => {});
    document.removeEventListener("click", tryPlayMusic);
    document.removeEventListener("touchstart", tryPlayMusic);
  }

  document.addEventListener("click", tryPlayMusic);
  document.addEventListener("touchstart", tryPlayMusic);

  const bgMusic = document.getElementById("bgMusic");
  const musicBtn = document.getElementById("musicToggle");

  bgMusic.volume = 0.4;

  musicBtn.onclick = () => {
    if (bgMusic.paused) {
      bgMusic.play().catch(() => {});
      musicBtn.textContent = "🔊";
    } else {
      bgMusic.pause();
      musicBtn.textContent = "🔇";
    }
  };

  // hero
  const coverGate = document.getElementById("coverGate");
  const openBtn = document.getElementById("openInvitation");

  openBtn.onclick = () => {
    // pastikan element ada
    if (!coverGate) return;

    // animasi geser ke atas
    coverGate.style.transition = "transform 1.5s ease, opacity 1.4s ease";
    coverGate.style.transform = "translateY(-100%)";
    coverGate.style.opacity = "0";
    coverGate.style.pointerEvents = "none";

    // play musik
    bgMusic.play().catch(() => {});

    setTimeout(() => {
      if (pageFlip && pageFlip.getCurrentPageIndex() === 0) {
        pageFlip.flipNext();
      }
    }, 900);
  };

  // nama tamu
  function getGuestName() {
    const params = new URLSearchParams(window.location.search);
    return params.get("to");
  }

  const guest = getGuestName();
  const guestEl = document.getElementById("guestName");

  if (guest && guestEl) {
    guestEl.textContent = guest;
  }

});
