document.addEventListener("DOMContentLoaded", () => {
  // Utility function to load external HTML components
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

  // Cache DOM elements for better performance
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

  // Handle active navigation styling
  const setActiveNavigation = () => {
    const currentPageFile =
      window.location.pathname.split("/").pop() || "index.html";
    const effectivePage = currentPageFile;

    document
      .querySelectorAll(".nav-link, .nav-component-link")
      .forEach((link) => {
        if (link.getAttribute("href") === effectivePage) {
          // Add active styles to current page link
          link.classList.add(
            "font-bold",
            "text-white",
            "border-b-2",
            "border-white"
          );

          // Handle dropdown menu highlighting
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

            // Special styling for component links in dropdown
            if (link.classList.contains("nav-component-link")) {
              link.classList.add("bg-white/10");
              link.classList.remove("border-b-2", "border-white");
            }
          }
        }
      });
  };

  // Setup dropdown menu functionality
  const setupDropdownMenu = (elements) => {
    if (elements.componentesBtn && elements.componentesDropdown) {
      elements.componentesBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        elements.componentesDropdown.classList.toggle("hidden");
      });

      // Close dropdown when clicking outside
      window.addEventListener("click", () => {
        elements.componentesDropdown?.classList.add("hidden");
      });
    }
  };

  // Setup mobile menu functionality
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

  // Main header initialization function
  const initializeHeaderFunctionality = () => {
    const elements = getDOMElements();
    setActiveNavigation();
    setupDropdownMenu(elements);
    setupMobileMenu(elements);
  };

  // Setup timeline animation with Intersection Observer
  const setupTimelineAnimation = () => {
    // Function to setup observer for timeline items
    const setupObserver = () => {
      // Check for timeline items with different possible selectors
      const timelineItems = document.querySelectorAll(
        ".timeline-item, .modal-trigger"
      );
      if (timelineItems.length === 0) return false;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              // For Vue.js timeline, add custom visibility class
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
        // Set initial state for Vue.js timeline items
        if (item.classList.contains("modal-trigger")) {
          item.classList.add("timeline-hidden");
        }
        observer.observe(item);
      });

      return true;
    };

    // Try immediately, then retry with delays for Vue.js rendering
    if (!setupObserver()) {
      setTimeout(() => {
        if (!setupObserver()) {
          setTimeout(setupObserver, 500);
        }
      }, 100);
    }
  };

  // Enhanced initialization for Vue.js compatibility
  const initializeVueCompatibleFeatures = () => {
    setupTimelineAnimation();
    setupBackToTop();
    setupModal();
  };

  // Setup back to top button functionality
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

  // Modal functionality
  const setupModal = () => {
    const modal = document.getElementById("timelineModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const modalTriggers = document.querySelectorAll(".modal-trigger");

    if (!modal || !closeModalBtn || modalTriggers.length === 0) return;

    // Cache modal elements for better performance
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

      // Format description with paragraphs
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

    // Event listeners
    modalTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => openModal(trigger));
    });

    closeModalBtn.addEventListener("click", closeModal);

    // Close modal on backdrop click
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });

    // Close modal on Escape key
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
      }
    });
  };

  // Main application initialization
  const initializeApp = async () => {
    // Load header component
    await loadComponent("#header-placeholder", "header.html");

    // Initialize all functionalities
    initializeHeaderFunctionality();
    initializeVueCompatibleFeatures();
  };

  // Initialize the application
  initializeApp();

  // Export functions for external use (especially Vue.js)
  window.initializeHeaderFunctionality = initializeHeaderFunctionality;
  window.initializeVueCompatibleFeatures = initializeVueCompatibleFeatures;
  window.setupTimelineAnimation = setupTimelineAnimation;
  window.setupBackToTop = setupBackToTop;
  window.setupModal = setupModal;
});
