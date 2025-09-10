const componentesBtn = document.getElementById("componentesBtn");
const componentesDropdown = document.getElementById("componentesDropdown");
if (componentesBtn && componentesDropdown) {
  componentesBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    componentesDropdown.classList.toggle("hidden");
  });
}
window.addEventListener("click", function (event) {
  if (
    componentesDropdown &&
    !componentesDropdown.classList.contains("hidden")
  ) {
    componentesDropdown.classList.add("hidden");
  }
});

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const closeMobileMenuBtn = document.getElementById("closeMobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const mobileComponentesBtn = document.getElementById("mobileComponentesBtn");
const mobileComponentesSubmenu = document.getElementById(
  "mobileComponentesSubmenu"
);

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.remove("hidden");
  });
}
if (closeMobileMenuBtn && mobileMenu) {
  closeMobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
  });
}
if (mobileComponentesBtn && mobileComponentesSubmenu) {
  mobileComponentesBtn.addEventListener("click", () => {
    mobileComponentesSubmenu.classList.toggle("hidden");
  });
}

const timeline = document.querySelector(".timeline-container");
if (timeline) {
  const timelineItems = document.querySelectorAll(".timeline-item");
  if (timelineItems.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );
    timelineItems.forEach((item) => {
      observer.observe(item);
    });
  }
}

const backToTopBtn = document.getElementById("backToTopBtn");
if (backToTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.remove("hidden");
    } else {
      backToTopBtn.classList.add("hidden");
    }
  });
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

const modal = document.getElementById("timelineModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalTriggers = document.querySelectorAll(".modal-trigger");
if (modal && closeModalBtn && modalTriggers.length > 0) {
  const openModal = (trigger) => {
    const title = trigger.dataset.title;
    const year = trigger.dataset.year;
    const imgSrc = trigger.dataset.imageSrc;
    const imgAlt = trigger.dataset.imageAlt;
    const imgSource = trigger.dataset.imageSource;
    const description = trigger.dataset.description;

    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalYear").textContent = `(${year})`;
    document.getElementById("modalImage").src = imgSrc;
    document.getElementById("modalImage").alt = imgAlt;
    document.getElementById(
      "modalImageSource"
    ).textContent = `Fonte: ${imgSource}`;
    document.getElementById("modalDescription").textContent = description;

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  };

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => openModal(trigger));
  });

  closeModalBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
}
