const navToggle = document.querySelector(".nav-toggle");
const mobileNav = document.querySelector("#mobile-nav");
const revealItems = document.querySelectorAll(".reveal");
const serviceItems = document.querySelectorAll("[data-scene]");
const sceneDisplay = document.querySelector("#scene-display");
const sceneKicker = document.querySelector("#scene-kicker");
const sceneTitle = document.querySelector("#scene-title");
const sceneBody = document.querySelector("#scene-body");
const scenePreview = document.querySelector("#scene-panels");
let sceneTimer = null;
let sceneRaf = null;

const scenes = {
  website: {
    kicker: "Website design",
    title: "Make the site feel current, premium, and easy to act on.",
    body:
      "Strong layout, better copy, and a mobile-first flow that makes it easier for visitors to contact you.",
    preview:
      '<div class="preview-card"><strong>Homepage flow</strong><p>Headline, proof, services, and CTA in the right order.</p></div><div class="preview-stats"><div><span>UX</span><strong>Clear</strong></div><div><span>Mobile</span><strong>Ready</strong></div><div><span>CTA</span><strong>Visible</strong></div></div>',
  },
  google: {
    kicker: "Google Business + local search",
    title: "Show up looking active, trusted, and ready.",
    body:
      "Profile improvements and search signals help local customers choose you faster.",
    preview:
      '<div class="preview-card"><strong>Google presence</strong><p>Photos, services, and trust signals that support local search.</p></div><div class="preview-stats"><div><span>Maps</span><strong>Visible</strong></div><div><span>Reviews</span><strong>Strong</strong></div><div><span>Calls</span><strong>Easy</strong></div></div>',
  },
  ads: {
    kicker: "Meta Ads + growth strategy",
    title: "Put the right offer in front of the right audience.",
    body:
      "Simple campaign structure and clear messaging built to drive action.",
    preview:
      '<div class="preview-card"><strong>Campaign focus</strong><p>Offer, audience, and creative aligned around one goal.</p></div><div class="preview-stats"><div><span>Offer</span><strong>Clear</strong></div><div><span>Audience</span><strong>Local</strong></div><div><span>Action</span><strong>Fast</strong></div></div>',
  }
};

function setScene(sceneName) {
  const scene = scenes[sceneName];
  if (!scene || !sceneDisplay) return;

  if (sceneTimer) {
    window.clearTimeout(sceneTimer);
  }

  if (sceneRaf) {
    window.cancelAnimationFrame(sceneRaf);
  }

  sceneDisplay.classList.add("is-changing");

  sceneTimer = window.setTimeout(() => {
    if (sceneKicker) sceneKicker.textContent = scene.kicker;
    if (sceneTitle) sceneTitle.textContent = scene.title;
    if (sceneBody) sceneBody.textContent = scene.body;
    if (scenePreview) scenePreview.innerHTML = scene.preview;

    sceneRaf = window.requestAnimationFrame(() => {
      sceneDisplay.dataset.scene = sceneName;
      sceneDisplay.classList.remove("is-changing");
      sceneRaf = null;
    });

    sceneTimer = null;
  }, 110);

  serviceItems.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.scene === sceneName);
  });
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
  if (!serviceItems.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const active = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (active) {
        setScene(active.target.dataset.scene);
      }
    },
    {
      threshold: [0.3, 0.5, 0.7],
      rootMargin: "-10% 0px -44% 0px"
    }
  );

  serviceItems.forEach((item) => observer.observe(item));

  serviceItems.forEach((item) => {
    item.addEventListener("click", () => setScene(item.dataset.scene));
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
  setScene("website");
});
