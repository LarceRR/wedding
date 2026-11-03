const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealElements = document.querySelectorAll(".reveal");
const revealAll = () => {
  revealElements.forEach((element) => element.classList.add("visible"));
};

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealAll();
} else {
  let observerResponded = false;
  let revealObserver;

  try {
    document.documentElement.classList.add("reveal-ready");
    revealObserver = new IntersectionObserver(
      (entries, observer) => {
        observerResponded = true;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0, rootMargin: "300px 0px 400px 0px" }
    );

    revealElements.forEach((element) => revealObserver.observe(element));

    // If the observer never calls back, fail open instead of leaving sections hidden.
    window.setTimeout(() => {
      if (observerResponded) return;
      document.documentElement.classList.remove("reveal-ready");
      revealAll();
      revealObserver.disconnect();
    }, 2500);
  } catch (error) {
    document.documentElement.classList.remove("reveal-ready");
    revealAll();
  }
}

/* RSVP demo state */
// Remove this note from the page after connecting Formspree, Google Apps Script or a Telegram bot.
const FORM_DEMO_NOTE = "Демонстрационная форма: ответы пока не отправляются.";
const form = document.getElementById("rsvp-form");
const formStatus = form?.querySelector(".form-status");
const formDemoNote = form?.querySelector(".form-demo-note");

if (formDemoNote) formDemoNote.textContent = FORM_DEMO_NOTE;
const attendanceInputs = form?.querySelectorAll('input[name="attendance"]');
const guestGroup = form?.querySelector("[data-guest-count]");
const guestInput = form?.querySelector("#guests");

const syncGuestField = () => {
  if (!guestGroup || !attendanceInputs) return;
  const attending = form.querySelector('input[name="attendance"]:checked')?.value === "yes";
  guestGroup.hidden = !attending;
  if (guestInput) guestInput.disabled = !attending;
};

attendanceInputs?.forEach((input) => {
  input.addEventListener("change", syncGuestField);
});

syncGuestField();

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  if (!formStatus) return;

  formStatus.textContent =
    "Это демонстрационная форма: ответ не передан и не сохранён. Подключите обработчик заявок, чтобы получать ответы гостей.";
});

/* Gallery lightbox */
const lightbox = document.getElementById("lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxFocusableSelector =
  'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
const lightboxClose = lightbox?.querySelector(".lightbox-close");
const galleryItems = document.querySelectorAll(".gallery-item");
let lastActiveGalleryItem = null;

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove("visible");
  lightbox.setAttribute("aria-hidden", "true");
  if (lightboxImage) {
    lightboxImage.src = "";
    lightboxImage.alt = "";
  }
  document.body.style.overflow = "";
  lastActiveGalleryItem?.focus();
};

galleryItems.forEach((item) => {
  item.addEventListener("click", () => {
    const imageSrc = item.dataset.image;
    const thumbnail = item.querySelector("img");
    if (!lightbox || !lightboxImage || !imageSrc) return;

    lastActiveGalleryItem = item;
    lightboxImage.src = imageSrc;
    lightboxImage.alt = thumbnail?.alt || "Фотография из галереи";
    lightbox.classList.add("visible");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lightboxClose?.focus();
  });
});

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox?.classList.contains("visible")) return;

  if (event.key === "Escape") {
    closeLightbox();
    return;
  }

  if (event.key === "Tab") {
    const focusableElements = Array.from(
      lightbox.querySelectorAll(lightboxFocusableSelector)
    );
    if (!focusableElements.length) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!lightbox.contains(document.activeElement)) {
      event.preventDefault();
      firstElement.focus();
    } else if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
});