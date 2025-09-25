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

    const closeMobileComponentesBtn = document.getElementById(
      "closeMobileComponentesBtn"
    );
    const mobileComponentesIcon = document.getElementById(
      "mobileComponentesIcon"
    );

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.remove("pointer-events-none");
        mobileMenu.classList.remove("opacity-0", "scale-95");
        mobileMenu.classList.add("opacity-100", "scale-100");
        document.body.style.overflow = "hidden";
      });
    }

    if (closeMobileMenuBtn && mobileMenu) {
      closeMobileMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.add("opacity-0", "scale-95");
        mobileMenu.classList.remove("opacity-100", "scale-100");

        setTimeout(() => {
          mobileMenu.classList.add("pointer-events-none");
          document.body.style.overflow = "";
        }, 300);
      });
    }

    if (mobileComponentesBtn && mobileComponentesSubmenu) {
      mobileComponentesBtn.addEventListener("click", () => {
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
    }

    if (closeMobileComponentesBtn && mobileComponentesSubmenu && mobileMenu) {
      closeMobileComponentesBtn.addEventListener("click", () => {
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
      });
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
        { threshold: 0.2 }
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
    const backToTopBtn = document.getElementById("backToTopBtn");
    if (!backToTopBtn) return;

    const toggleVisibility = () => {
      const isVisible = window.scrollY > 300;
      backToTopBtn.classList.toggle("hidden", !isVisible);
    };

    window.addEventListener("scroll", toggleVisibility);
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (window.location.hash && window.location.hash.startsWith("#year-")) {
        const cleanUrl = window.location.pathname + window.location.search;
        history.replaceState(null, "", cleanUrl);
      }
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
