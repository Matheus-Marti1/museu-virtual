document.addEventListener("DOMContentLoaded", () => {
  const loadComponent = async (selector, url) => {
    const element = document.querySelector(selector);
    if (!element) return;

    try {
      const response = await fetch(url);
      if (response.ok) {
        element.innerHTML = await response.text();
      } else {
        console.error(
          `Erro ao carregar componente de ${url}: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error(`Falha na requisição para ${url}:`, error);
    }
  };

  const getDOMElements = () => ({
    componentesBtn: document.getElementById("componentesBtn"),
    componentesDropdown: document.getElementById("componentesDropdown"),
    mobileMenuBtn: document.getElementById("mobileMenuBtn"),
    closeMobileMenuBtn: document.getElementById("closeMobileMenuBtn"),
    mobileMenu: document.getElementById("mobileMenu"),
    mobileComponentesBtn: document.getElementById("mobileComponentesBtn"),
    mobileComponentesSubmenu: document.getElementById(
      "mobileComponentesSubmenu"
    ),
  });

  const setActiveNavigation = () => {
    const currentPageFile =
      window.location.pathname.split("/").pop() || "index.html";
    const effectivePage = currentPageFile;

    document
      .querySelectorAll(".nav-link, .nav-component-link")
      .forEach((link) => {
        if (link.getAttribute("href") === effectivePage) {
          link.classList.add(
            "font-bold",
            "text-white",
            "border-b-2",
            "border-white"
          );

          const isInDropdown =
            link.closest("#componentesDropdown") ||
            link.closest("#mobileComponentesSubmenu");

          if (isInDropdown) {
            const buttons = ["#componentesBtn", "#mobileComponentesBtn"];
            buttons.forEach((btnSelector) => {
              document
                .querySelector(btnSelector)
                ?.classList.add(
                  "font-bold",
                  "text-white",
                  "border-b-2",
                  "border-white"
                );
            });

            if (link.classList.contains("nav-component-link")) {
              link.classList.add("bg-white/10");
              link.classList.remove("border-b-2", "border-white");
            }
          }
        }
      });
  };

  const setupDropdownMenu = (elements) => {
    if (elements.componentesBtn && elements.componentesDropdown) {
      elements.componentesBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        elements.componentesDropdown.classList.toggle("hidden");
      });

      window.addEventListener("click", () => {
        elements.componentesDropdown?.classList.add("hidden");
      });
    }
  };

  const setupMobileMenu = (elements) => {
    const {
      mobileMenuBtn,
      closeMobileMenuBtn,
      mobileMenu,
      mobileComponentesBtn,
      mobileComponentesSubmenu,
    } = elements;

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
  };

  const initializeHeaderFunctionality = () => {
    const elements = getDOMElements();
    setActiveNavigation();
    setupDropdownMenu(elements);
    setupMobileMenu(elements);
  };

  const setupTimelineAnimation = () => {
    const setupObserver = () => {
      const timelineItems = document.querySelectorAll(
        ".timeline-item, .modal-trigger"
      );
      if (timelineItems.length === 0) return false;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              if (entry.target.classList.contains("modal-trigger")) {
                entry.target.classList.remove("timeline-hidden");
                entry.target.classList.add("timeline-visible");
              }
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      timelineItems.forEach((item, index) => {
        if (item.classList.contains("modal-trigger")) {
          item.classList.add("timeline-hidden");
        }
        observer.observe(item);
      });

      return true;
    };

    if (!setupObserver()) {
      setTimeout(() => {
        if (!setupObserver()) {
          setTimeout(setupObserver, 500);
        }
      }, 100);
    }
  };

  const initializeVueCompatibleFeatures = () => {
    setupTimelineAnimation();
    setupBackToTop();
    setupModal();
  };

  const setupBackToTop = () => {
    const backToTopBtn = document.getElementById("backToTopBtn");
    if (!backToTopBtn) return;

    const toggleVisibility = () => {
      const isVisible = window.scrollY > 300;
      backToTopBtn.classList.toggle("hidden", !isVisible);
    };

    window.addEventListener("scroll", toggleVisibility);
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const setupModal = () => {
    const modal = document.getElementById("timelineModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const modalTriggers = document.querySelectorAll(".modal-trigger");

    if (!modal || !closeModalBtn || modalTriggers.length === 0) return;

    const modalElements = {
      title: document.getElementById("modalTitle"),
      year: document.getElementById("modalYear"),
      image: document.getElementById("modalImage"),
      imageSource: document.getElementById("modalImageSource"),
      description: document.getElementById("modalDescription"),
    };

    const openModal = (trigger) => {
      const data = trigger.dataset;

      modalElements.title.textContent = data.title;
      modalElements.year.textContent = `(${data.year})`;
      modalElements.image.src = data.imageSrc;
      modalElements.image.alt = data.imageAlt;
      modalElements.imageSource.textContent = `Fonte: ${data.imageSource}`;

      const formattedDescription = data.description
        .split("\n")
        .filter((p) => p.trim() !== "")
        .map((p) => `<p class="mb-4">${p.trim()}</p>`)
        .join("");

      modalElements.description.innerHTML = formattedDescription;

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
      if (event.target === modal) closeModal();
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
      }
    });
  };

  const initializeApp = async () => {
    await loadComponent("#header-placeholder", "header.html");

    initializeHeaderFunctionality();
    initializeVueCompatibleFeatures();
  };

  initializeApp();

  window.initializeHeaderFunctionality = initializeHeaderFunctionality;
  window.initializeVueCompatibleFeatures = initializeVueCompatibleFeatures;
  window.setupTimelineAnimation = setupTimelineAnimation;
  window.setupBackToTop = setupBackToTop;
  window.setupModal = setupModal;
});
