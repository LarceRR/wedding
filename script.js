document.documentElement.classList.add("js");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealElements = document.querySelectorAll(".reveal");

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

/* RSVP demo state */
const form = document.getElementById("rsvp-form");
const formStatus = form?.querySelector(".form-status");
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
    event.preventDefault();
    lightboxClose?.focus();
  }
});