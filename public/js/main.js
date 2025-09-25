document.addEventListener("DOMContentLoaded", () => {
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const domCache = new Map();
  const getCachedElement = (selector) => {
    if (!domCache.has(selector)) {
      domCache.set(selector, document.querySelector(selector));
    }
    return domCache.get(selector);
  };

  const loadComponent = async (selector, url) => {
    const element = document.querySelector(selector);
    if (!element) return null;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(
          `Erro ao carregar componente de ${url}: ${response.statusText}`
        );
        return null;
      }

      const markup = await response.text();
      element.innerHTML = markup;
      document.dispatchEvent(
        new CustomEvent("component:loaded", {
          detail: { selector, url, element },
        })
      );
      return markup;
    } catch (error) {
      console.error(`Falha na requisição para ${url}:`, error);
      return null;
    }
  };

  const getDOMElements = () => {
    domCache.clear();

    const elementIds = [
      "componentesBtn",
      "componentesDropdown",
      "mobileMenuBtn",
      "closeMobileMenuBtn",
      "mobileMenu",
      "mobileComponentesBtn",
      "mobileComponentesSubmenu",
    ];

    const elements = {};
    elementIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        elements[id] = element;
        domCache.set(`#${id}`, element);
      }
    });

    return elements;
  };

  const setActiveNavigation = () => {
    const currentPageFile =
      window.location.pathname.split("/").pop() || "index.html";
    const effectivePage = currentPageFile;

    document
      .querySelectorAll(".nav-link, .nav-component-link")
      .forEach((link) => {
        link.classList.remove(
          "font-bold",
          "text-white",
          "border-b-2",
          "border-white",
          "bg-white/30",
          "ring-2",
          "ring-white/50"
        );

        const href = link.getAttribute("href");
        const linkFile = href ? href.split("/").pop() : "";

        if (linkFile === effectivePage) {
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

            if (link.closest("#mobileComponentesSubmenu")) {
              link.classList.add("bg-white/30", "ring-2", "ring-white/50");
              link.classList.remove(
                "border-b-2",
                "border-white",
                "bg-white/10"
              );
            } else if (link.classList.contains("nav-component-link")) {
              link.classList.add("bg-white/10");
              link.classList.remove("border-b-2", "border-white");
            }
          }
        }
      });
  };

  const setupDropdownMenu = (elements) => {
    if (elements.componentesBtn && elements.componentesDropdown) {
      const btn = elements.componentesBtn;
      const dropdown = elements.componentesDropdown;

      if (btn._clickHandler) {
        btn.removeEventListener("click", btn._clickHandler);
      }
      if (btn._outsideClickHandler) {
        document.removeEventListener("click", btn._outsideClickHandler);
      }

      const clickHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        dropdown.classList.toggle("hidden");
      };

      const outsideClickHandler = (event) => {
        if (!btn.contains(event.target) && !dropdown.contains(event.target)) {
          dropdown.classList.add("hidden");
        }
      };

      btn.addEventListener("click", clickHandler);
      document.addEventListener("click", outsideClickHandler, {
        passive: true,
      });

      btn._clickHandler = clickHandler;
      btn._outsideClickHandler = outsideClickHandler;
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

    const closeMobileComponentesBtn = document.getElementById(
      "closeMobileComponentesBtn"
    );
    const mobileComponentesIcon = document.getElementById(
      "mobileComponentesIcon"
    );

    if (mobileMenuBtn && mobileMenu) {
      if (mobileMenuBtn._clickHandler) {
        mobileMenuBtn.removeEventListener("click", mobileMenuBtn._clickHandler);
      }

      const clickHandler = (event) => {
        event.preventDefault();
        event.stopPropagation();
        mobileMenu.classList.remove(
          "pointer-events-none",
          "opacity-0",
          "scale-95"
        );
        mobileMenu.classList.add("opacity-100", "scale-100");
        document.body.style.overflow = "hidden";
      };

      mobileMenuBtn.addEventListener("click", clickHandler);
      mobileMenuBtn._clickHandler = clickHandler;
    }

    if (closeMobileMenuBtn && mobileMenu) {
      const newCloseBtn = closeMobileMenuBtn.cloneNode(true);
      closeMobileMenuBtn.parentNode.replaceChild(
        newCloseBtn,
        closeMobileMenuBtn
      );

      newCloseBtn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        mobileMenu.classList.add("opacity-0", "scale-95");
        mobileMenu.classList.remove("opacity-100", "scale-100");

        setTimeout(() => {
          mobileMenu.classList.add("pointer-events-none");
          document.body.style.overflow = "";
        }, 300);
      });

      elements.closeMobileMenuBtn = newCloseBtn;
    }

    if (mobileComponentesBtn && mobileComponentesSubmenu) {
      const newMobileCompBtn = mobileComponentesBtn.cloneNode(true);
      mobileComponentesBtn.parentNode.replaceChild(
        newMobileCompBtn,
        mobileComponentesBtn
      );

      newMobileCompBtn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (mobileComponentesIcon) {
          mobileComponentesIcon.style.transform = "rotate(90deg)";
        }

        mobileComponentesSubmenu.classList.remove("pointer-events-none");
        mobileComponentesSubmenu.classList.remove(
          "opacity-0",
          "translate-x-full"
        );
        mobileComponentesSubmenu.classList.add("opacity-100", "translate-x-0");

        mobileMenu.classList.add("-translate-x-full");
      });

      elements.mobileComponentesBtn = newMobileCompBtn;
    }

    if (closeMobileComponentesBtn && mobileComponentesSubmenu && mobileMenu) {
      const newCloseCompBtn = closeMobileComponentesBtn.cloneNode(true);
      closeMobileComponentesBtn.parentNode.replaceChild(
        newCloseCompBtn,
        closeMobileComponentesBtn
      );

      newCloseCompBtn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (mobileComponentesIcon) {
          mobileComponentesIcon.style.transform = "rotate(0deg)";
        }

        mobileComponentesSubmenu.classList.add("opacity-0", "translate-x-full");
        mobileComponentesSubmenu.classList.remove(
          "opacity-100",
          "translate-x-0"
        );

        mobileMenu.classList.remove("-translate-x-full");

        setTimeout(() => {
          mobileComponentesSubmenu.classList.add("pointer-events-none");
        }, 300);
      });
    }
    const componentLinks = document.querySelectorAll(".nav-component-link");
    componentLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (mobileMenu) {
          mobileMenu.classList.add("opacity-0", "scale-95");
          mobileMenu.classList.remove("opacity-100", "scale-100");
          setTimeout(() => {
            mobileMenu.classList.add("pointer-events-none");
            document.body.style.overflow = "";
          }, 300);
        }

        if (mobileComponentesSubmenu) {
          mobileComponentesSubmenu.classList.add(
            "opacity-0",
            "translate-x-full"
          );
          mobileComponentesSubmenu.classList.remove(
            "opacity-100",
            "translate-x-0"
          );
          setTimeout(() => {
            mobileComponentesSubmenu.classList.add("pointer-events-none");
          }, 300);
        }
      }
    });
  };

  const initializeHeaderFunctionality = () => {
    const elements = getDOMElements();
    setActiveNavigation();
    setupDropdownMenu(elements);
    setupMobileMenu(elements);
  };

  const setupTimelineAnimation = () => {
    const setupObserver = () => {
      const timelineItems = document.querySelectorAll(".timeline-item");
      if (timelineItems.length === 0) return false;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              entry.target.classList.remove("timeline-hidden");
              entry.target.classList.add("timeline-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.2,
          rootMargin: "10px",
        }
      );
      timelineItems.forEach((item, index) => {
        item.classList.add("timeline-hidden");
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
    const backToTopBtn =
      getCachedElement("#backToTopBtn") ||
      document.getElementById("backToTopBtn");
    if (!backToTopBtn) return;
    let visibilityFrame = null;

    const applyVisibility = () => {
      const isVisible = window.scrollY > 300;
      backToTopBtn.classList.toggle("hidden", !isVisible);
    };

    const scheduleVisibilityUpdate = () => {
      if (visibilityFrame !== null) return;
      visibilityFrame = requestAnimationFrame(() => {
        visibilityFrame = null;
        applyVisibility();
      });
    };

    applyVisibility();

    window.addEventListener("scroll", scheduleVisibilityUpdate, {
      passive: true,
    });
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (window.location.hash && window.location.hash.startsWith("#year-")) {
        const cleanUrl = window.location.pathname + window.location.search;
        history.replaceState(null, "", cleanUrl);
      }
    });
    window.addEventListener("resize", scheduleVisibilityUpdate);
  };

  const setupModal = () => {
    const modal =
      getCachedElement("#timelineModal") ||
      document.getElementById("timelineModal");
    const closeModalBtn =
      getCachedElement("#closeModalBtn") ||
      document.getElementById("closeModalBtn");
    const modalTriggers = document.querySelectorAll(".modal-trigger");

    if (!modal || !closeModalBtn || modalTriggers.length === 0) return;

    const modalElements = {
      title:
        getCachedElement("#modalTitle") ||
        document.getElementById("modalTitle"),
      year:
        getCachedElement("#modalYear") || document.getElementById("modalYear"),
      image:
        getCachedElement("#modalImage") ||
        document.getElementById("modalImage"),
      imageSource:
        getCachedElement("#modalImageSource") ||
        document.getElementById("modalImageSource"),
      description:
        getCachedElement("#modalDescription") ||
        document.getElementById("modalDescription"),
    };

    const openModal = (trigger) => {
      const data = trigger.dataset;

      requestAnimationFrame(() => {
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
      });
    };

    const closeModal = () => {
      modal.classList.add("hidden");
      document.body.style.overflow = "";
    };

    document.addEventListener("click", (event) => {
      if (event.target.closest(".modal-trigger")) {
        openModal(event.target.closest(".modal-trigger"));
      } else if (event.target === closeModalBtn || event.target === modal) {
        closeModal();
      }
    });

    window.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape" && !modal.classList.contains("hidden")) {
          event.preventDefault();
          closeModal();
        }
      },
      { passive: false }
    );
  };

  const adjustLinksForSubfolder = () => {
    const isInSubfolder = window.location.pathname.includes("/componentes/");

    if (isInSubfolder) {
      document.querySelectorAll('a[href^="componentes/"]').forEach((link) => {
        const href = link.getAttribute("href");
        link.setAttribute("href", href.replace("componentes/", ""));
      });

      document.querySelectorAll('a[href="index.html"]').forEach((link) => {
        link.setAttribute("href", "../index.html");
      });

      document.querySelectorAll('a[href="timeline.html"]').forEach((link) => {
        link.setAttribute("href", "../timeline.html");
      });

      document.querySelectorAll('a[href="membros.html"]').forEach((link) => {
        link.setAttribute("href", "../membros.html");
      });

      document
        .querySelectorAll('img[src="images/logo_fatec.png"]')
        .forEach((img) => {
          img.setAttribute("src", "../images/logo_fatec.png");
        });
    }
  };

  const initializeApp = async () => {
    const isInSubfolder = window.location.pathname.includes("/componentes/");
    const headerPath = isInSubfolder ? "../header.html" : "header.html";

    await loadComponent("#header-placeholder", headerPath);

    adjustLinksForSubfolder();

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
