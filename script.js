const navToggle = document.querySelector(".nav-toggle");
const mobileNav = document.querySelector("#mobile-nav");
const revealItems = document.querySelectorAll(".reveal");
const modal = document.querySelector("#case-modal");
const modalLabel = document.querySelector("#case-modal-label");
const modalTitle = document.querySelector("#case-modal-title");
const modalIntro = document.querySelector("#case-modal-intro");
const modalBody = document.querySelector("#case-modal-body");
const openers = document.querySelectorAll("[data-modal-open]");
const templates = {
  meama: document.querySelector("#template-meama"),
  os: document.querySelector("#template-os"),
};

let lastModalTrigger = null;

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

function setModalContent(key) {
  const definitions = {
    meama: {
      label: "Meama NYC",
      title: "A clearer local presence for a hospitality brand.",
      intro:
        "A case study focused on website presentation, Google visibility, and the small details that make a local business feel worth choosing.",
    },
    os: {
      label: "Neighborhood Media OS",
      title: "A system view for planning, content, and reporting.",
      intro:
        "A more advanced look at how the agency organizes execution, content flow, and measurable work across a single system.",
    },
  };

  const template = templates[key];
  const definition = definitions[key];

  if (!template || !definition || !modal || !modalBody) return;

  modalLabel.textContent = definition.label;
  modalTitle.textContent = definition.title;
  modalIntro.textContent = definition.intro;
  modalBody.innerHTML = "";
  modalBody.appendChild(template.content.cloneNode(true));
}

function openModal(key, trigger) {
  if (!modal) return;

  lastModalTrigger = trigger || null;
  setModalContent(key);
  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");
  document.documentElement.style.overflow = "hidden";
}

function closeModal() {
  if (!modal) return;

  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  document.documentElement.style.overflow = "";

  if (lastModalTrigger && typeof lastModalTrigger.focus === "function") {
    lastModalTrigger.focus();
  }
}

function setupCaseModals() {
  if (!modal || !modalBody) return;

  openers.forEach((button) => {
    button.addEventListener("click", () => {
      openModal(button.dataset.modalOpen, button);
    });
  });

  modal.addEventListener("click", (event) => {
    if (event.target.matches("[data-modal-close]")) {
      closeModal();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
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
  setupMobileNav();
  setupCaseModals();
  setupForm();
});
