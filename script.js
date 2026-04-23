const navToggle = document.querySelector(".nav-toggle");
const mobileNav = document.querySelector("#mobile-nav");
const revealItems = document.querySelectorAll(".reveal");
const servicesSection = document.querySelector("#services");
const serviceItems = document.querySelectorAll("[data-scene]");
const sceneDisplay = document.querySelector("#scene-display");
const sceneNames = ["website", "google", "ads"];
let scrollRaf = null;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function updateShowreel() {
  if (!servicesSection || !sceneDisplay) return;

  const rect = servicesSection.getBoundingClientRect();
  const viewportHeight = window.innerHeight || 1;
  const range = Math.max(1, rect.height - viewportHeight);
  const progress = clamp((-rect.top) / range, 0, 1);
  const activeIndex = Math.min(
    sceneNames.length - 1,
    Math.round(progress * (sceneNames.length - 1))
  );

  sceneDisplay.style.setProperty("--scene-progress", progress.toFixed(4));

  serviceItems.forEach((item, index) => {
    item.classList.toggle("is-active", index === activeIndex);
  });

  scrollRaf = null;
}

function requestShowreelUpdate() {
  if (scrollRaf) return;
  scrollRaf = window.requestAnimationFrame(updateShowreel);
}

function revealOnScroll() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function observeServices() {
  if (!serviceItems.length || !servicesSection || !sceneDisplay) return;

  const update = () => requestShowreelUpdate();

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
}

function setupMobileNav() {
  if (!navToggle || !mobileNav) return;

  navToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    mobileNav.hidden = !isOpen;
  });

  mobileNav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      mobileNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      mobileNav.hidden = true;
    }
  });
}

function setupForm() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitButton = form.querySelector("button[type='submit']");
    const originalText = submitButton.textContent;

    submitButton.textContent = "Request received";
    submitButton.disabled = true;

    window.setTimeout(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      form.reset();
    }, 2200);
  });
}

window.addEventListener("load", () => {
  revealOnScroll();
  observeServices();
  setupMobileNav();
  setupForm();
});
