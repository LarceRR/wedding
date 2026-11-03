const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealElements.forEach((element) => revealObserver.observe(element));

const form = document.getElementById('rsvp-form');
const formStatus = document.querySelector('.form-status');

if (form && formStatus) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    formStatus.textContent = 'Спасибо! Ваш ответ успешно сохранён в нашем демонстрационном форме.';
    form.reset();
    const guestField = document.getElementById('guests');
    if (guestField) guestField.value = '2';
  });
}

const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxClose = document.querySelector('.lightbox-close');
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach((item) => {
  item.addEventListener('click', () => {
    const imageSrc = item.dataset.image;
    if (!lightbox || !lightboxImage || !imageSrc) return;

    lightboxImage.src = imageSrc;
    lightbox.classList.add('visible');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove('visible');
  lightbox.setAttribute('aria-hidden', 'true');
  if (lightboxImage) lightboxImage.src = '';
};

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox?.classList.contains('visible')) {
    closeLightbox();
  }
});
