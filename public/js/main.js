const componentesBtn = document.getElementById("componentesBtn");
const componentesDropdown = document.getElementById("componentesDropdown");

componentesBtn.addEventListener("click", function (event) {
  event.stopPropagation();
  componentesDropdown.classList.toggle("hidden");
});

window.addEventListener("click", function (event) {
  if (!componentesDropdown.classList.contains("hidden")) {
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

mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.remove("hidden");
});

closeMobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.add("hidden");
});

mobileComponentesBtn.addEventListener("click", () => {
  mobileComponentesSubmenu.classList.toggle("hidden");
});
mobileMenu.querySelectorAll('a[href="#"]').forEach((link) => {
  if (!mobileComponentesSubmenu.contains(link)) {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  }
});

const timeline = document.querySelector(".timeline-container");
if (timeline) {
  const timelineItems = document.querySelectorAll(".timeline-item");

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
