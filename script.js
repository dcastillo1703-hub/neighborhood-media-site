const navToggle = document.querySelector(".nav-toggle");
const mobileNav = document.querySelector("#mobile-nav");
const revealItems = document.querySelectorAll(".reveal");
const servicesSection = document.querySelector("#services");
const serviceItems = document.querySelectorAll("[data-scene]");
const sceneDisplay = document.querySelector("#scene-display");
const sceneNames = ["website", "google", "ads"];
let showreelStart = 0;
let showreelEnd = 0;
let targetProgress = 0;
let currentProgress = 0;
let rafId = null;
let touchStartY = 0;
let touchActive = false;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function updateShowreelBounds() {
  if (!servicesSection) return;

  const pageY = window.scrollY || window.pageYOffset || 0;
  const top = servicesSection.getBoundingClientRect().top + pageY;
  const viewportHeight = window.innerHeight || 1;

  showreelStart = top - 90;
  showreelEnd = top + servicesSection.offsetHeight - viewportHeight + 90;
}

function applyShowreelProgress() {
  currentProgress += (targetProgress - currentProgress) * 0.14;

  if (Math.abs(targetProgress - currentProgress) < 0.001) {
    currentProgress = targetProgress;
    rafId = null;
  } else {
    rafId = window.requestAnimationFrame(applyShowreelProgress);
  }

  if (sceneDisplay) {
    sceneDisplay.style.setProperty("--scene-progress", currentProgress.toFixed(4));
  }

  const activeIndex = Math.min(
    sceneNames.length - 1,
    Math.round(currentProgress * (sceneNames.length - 1))
  );

  serviceItems.forEach((item, index) => {
    item.classList.toggle("is-active", index === activeIndex);
  });
}

function setTargetProgress(nextProgress) {
  targetProgress = clamp(nextProgress, 0, 1);
  if (!rafId) {
    rafId = window.requestAnimationFrame(applyShowreelProgress);
  }
}

function isInShowreelZone() {
  const y = window.scrollY || window.pageYOffset || 0;
  return y >= showreelStart && y <= showreelEnd;
}

function onWheel(event) {
  if (!servicesSection || !sceneDisplay || !isInShowreelZone()) return;

  const atStart = currentProgress <= 0.001;
  const atEnd = currentProgress >= 0.999;
  const direction = Math.sign(event.deltaY);

  if ((direction > 0 && atEnd) || (direction < 0 && atStart)) {
    return;
  }

  event.preventDefault();
  const delta = event.deltaY / ((window.innerHeight || 1) * 1.15);
  setTargetProgress(currentProgress + delta);
}

function onTouchStart(event) {
  if (event.touches.length !== 1) return;
  touchStartY = event.touches[0].clientY;
  touchActive = isInShowreelZone();
}

function onTouchMove(event) {
  if (!touchActive || !servicesSection || !sceneDisplay || event.touches.length !== 1) return;

  const currentY = event.touches[0].clientY;
  const deltaY = touchStartY - currentY;
  const direction = Math.sign(deltaY);
  const atStart = currentProgress <= 0.001;
  const atEnd = currentProgress >= 0.999;

  if ((direction > 0 && atEnd) || (direction < 0 && atStart)) {
    touchStartY = currentY;
    return;
  }

  event.preventDefault();
  const delta = deltaY / ((window.innerHeight || 1) * 1.05);
  setTargetProgress(currentProgress + delta);
  touchStartY = currentY;
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

  updateShowreelBounds();
  setTargetProgress(0);

  window.addEventListener("scroll", updateShowreelBounds, { passive: true });
  window.addEventListener("resize", updateShowreelBounds, { passive: true });
  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("touchend", () => {
    touchActive = false;
  });
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
