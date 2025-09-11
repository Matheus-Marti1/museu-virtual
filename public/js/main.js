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

  const initializeApp = async () => {
    await loadComponent("#header-placeholder", "header.html");

    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";
    document
      .querySelectorAll(".nav-link, .nav-component-link")
      .forEach((link) => {
        if (link.getAttribute("href") === currentPage) {
          link.classList.add(
            "font-bold",
            "text-white",
            "border-b-2",
            "border-white"
          );

          if (
            link.closest("#componentesDropdown") ||
            link.closest("#mobileComponentesSubmenu")
          ) {
            document
              .querySelector("#componentesBtn")
              ?.classList.add(
                "font-bold",
                "text-white",
                "border-b-2",
                "border-white"
              );
            document
              .querySelector("#mobileComponentesBtn")
              ?.classList.add(
                "font-bold",
                "text-white",
                "border-b-2",
                "border-white"
              );

            if (link.classList.contains("nav-component-link")) {
              link.classList.add("bg-white/10");
              link.classList.remove("border-b-2", "border-white");
            }
          }
        }
      });

    const componentesBtn = document.getElementById("componentesBtn");
    const componentesDropdown = document.getElementById("componentesDropdown");
    if (componentesBtn && componentesDropdown) {
      componentesBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        componentesDropdown.classList.toggle("hidden");
      });
    }
    window.addEventListener("click", () => {
      componentesDropdown?.classList.add("hidden");
    });

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const closeMobileMenuBtn = document.getElementById("closeMobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const mobileComponentesBtn = document.getElementById(
      "mobileComponentesBtn"
    );
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
        { threshold: 0.2 }
      );
      timelineItems.forEach((item) => observer.observe(item));
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

        const modalTitle = document.getElementById("modalTitle");
        const modalYear = document.getElementById("modalYear");
        const modalImage = document.getElementById("modalImage");
        const modalImageSource = document.getElementById("modalImageSource");
        const modalDescription = document.getElementById("modalDescription");

        modalTitle.textContent = title;
        modalYear.textContent = `(${year})`;
        modalImage.src = imgSrc;
        modalImage.alt = imgAlt;
        modalImageSource.textContent = `Fonte: ${imgSource}`;

        const formattedDescription = description
          .split("\n")
          .filter((p) => p.trim() !== "")
          .map((p) => `<p class="mb-4">${p.trim()}</p>`)
          .join("");

        modalDescription.innerHTML = formattedDescription;

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
  };
  initializeApp();
});
