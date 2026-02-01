import { initWishes } from './wishes.js';
import { initRsvp } from './rsvp.js';

const segments = window.location.pathname
  .split('/')
  .filter(Boolean);

const groupName = segments[0] || 'default';

initWishes(groupName);
initRsvp(groupName);

function initCopyGift() {
  console.log('ss');
  document.querySelectorAll('[id^="copyGiftBtn"]').forEach(btn => {
    btn.addEventListener('click', async function () {
      const targetId = this.dataset.target;
      const accountEl = document.getElementById(targetId);

      if (!accountEl) return;

      const account = accountEl.dataset.account;

      try {
        await navigator.clipboard.writeText(account);
        const status = document.getElementById('copyStatus');
        status.style.display = 'block';

        const originalText = this.innerText;
        this.innerText = '✅ Tersalin!';

        setTimeout(() => {
          this.innerText = originalText;
        }, 2000);

      } catch (err) {
        console.error('Gagal menyalin', err);
      }
    });
  });
}

initCopyGift();

const audio = document.getElementById('weddingAudio');
        const musicIcon = document.getElementById('musicIcon');
        let isPlaying = false;
$('#lampIcon').on('click', function () {
    $(this).toggleClass('active');
    $('#overlay').fadeToggle(200);
  });

  // Klik overlay untuk menutup
  $('#overlay').on('click', function () {
    $('#lampIcon').removeClass('active');
    $(this).fadeOut(200);
  });

$('#btnOpenInvitation').on('click', function () { 
    document.getElementById('hero-section').classList.add('hide');
    playMusic();
});
function playMusic() {
    audio.play().catch(e => console.log("Audio play blocked"));
    isPlaying = true;
    musicIcon.classList.add('rotate');
}
$('#btnToggleMusic').on('click', function () { 
    if (isPlaying) {
        audio.pause();
        musicIcon.classList.remove('rotate');
    } else {
        audio.play();
        musicIcon.classList.add('rotate');
    }
    isPlaying = !isPlaying;
});