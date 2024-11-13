export function Mode(config) {
  if (config.enabled) {

    const body = document.body;
    const toggleButton = document.getElementById(config.elementById);

    const styles = {
      lightMode: {
        backgroundColor: "var(--bg-light)",
        color: "var(--text-light)",
      },
      lightModeLink: {
        color: "var(--link-light)",
      },
      darkMode: {
        backgroundColor: "var(--bg-dark)",
        color: "var(--text-dark)",
      },
      darkModeLink: {
        color: "var(--link-dark)",
      },
      sidebarNav: {
        color: "inherit",
      },
      inherit: {
        color: "inherit",
      },
      lightModeText: {
        color: "var(--text-light)",
      },
      darkModeText: {
        color: "var(--text-dark)",
      },
      navbarHeader: {
        backgroundColor: "inherit",
      },
      modeToggleIcon: {
        display: "none",
      },
      modeToggleIconActive: {
        display: "inline-block",
      },
      modeToggle: {
        cursor: "pointer",
        fontSize: "24px",
      },
    };

    function applyStyles() {
      const isLightMode = body.classList.contains("light-mode");

      // Terapkan gaya dasar
      Object.assign(
        body.style,
        isLightMode ? styles.lightMode : styles.darkMode
      );

      // Terapkan gaya untuk tautan
      // document.querySelectorAll("a").forEach((a) => {
      //   Object.assign(
      //     a.style,
      //     isLightMode ? styles.lightModeLink : styles.darkModeLink
      //   );
      // });

      // Terapkan gaya untuk elemen sidebar
      document
        .querySelectorAll(".sidebar-nav .nav a, .sidebar-nav .nav-link")
        .forEach((el) => {
          Object.assign(el.style, styles.sidebarNav);
        });

      // Terapkan gaya untuk elemen teks, kecuali <pre><code>
      const headings = 'h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6';
      const paragraphs = 'p';
      const otherElements = 'ol, ul, li, div';

      document.querySelectorAll(`${headings}, ${paragraphs}, ${otherElements}`).forEach(el => {
        if (!el.closest('pre') && !el.closest('code')) {
          if (el.matches(headings) || el.matches(paragraphs)) {
            Object.assign(el.style, isLightMode ? styles.lightModeText : styles.darkModeText);
            
            // Terapkan gaya ke <span> di dalam heading dan paragraf
            // el.querySelectorAll('span').forEach(span => {
            //   Object.assign(span.style, isLightMode ? styles.lightModeText : styles.darkModeText);
            // });
          } else {
            // Terapkan gaya lain jika diperlukan untuk elemen selain heading dan paragraf
            Object.assign(el.style, styles.inherit);
          }
        }
      });

      // Tangani <span> yang berdiri sendiri (tidak di dalam heading atau paragraf)
      document.querySelectorAll('span').forEach(span => {
        if (!span.closest('pre') && !span.closest('code') && !span.closest('h1, h2, h3, h4, h5, h6, p')) {
          // Biarkan gaya <span> tidak berubah atau terapkan gaya khusus jika diperlukan
          // Misalnya: Object.assign(span.style, styles.inherit);
        }
      });

      // Terapkan gaya khusus untuk <pre><code>
      document.querySelectorAll("pre, code").forEach((el) => {
        // Tambahkan gaya khusus untuk <pre><code> di sini jika diperlukan
        // Misalnya:
        // el.style.backgroundColor = isLightMode ? 'var(--code-bg-light)' : 'var(--code-bg-dark)';
        // el.style.color = isLightMode ? 'var(--code-text-light)' : 'var(--code-text-dark)';
      });

      // Terapkan gaya untuk navbar
      const navbarHeader = document.querySelector(".header");
      if (navbarHeader) Object.assign(navbarHeader.style, styles.navbarHeader);

      document.querySelectorAll(".header .nav-link").forEach((el) => {
        Object.assign(el.style, styles.inherit);
      });

      // Terapkan gaya untuk toggle mode
      const modeToggle = document.querySelector(".mode-toggle");
      if (modeToggle) {
        Object.assign(modeToggle.style, styles.modeToggle);
        modeToggle.querySelectorAll("i").forEach((icon) => {
          Object.assign(icon.style, styles.modeToggleIcon);
        });

        const activeIcon = isLightMode
          ? modeToggle.querySelector("."+ config.icon.terang)
          : modeToggle.querySelector("."+config.icon.gelap);
        if (activeIcon)
          Object.assign(activeIcon.style, styles.modeToggleIconActive);
      }
    }

    function setMode(mode) {
      body.classList.toggle("dark-mode", mode === "dark");
      body.classList.toggle("light-mode", mode === "light");
      localStorage.setItem("mode", mode);
      applyStyles();
    }

    function handleSystemPreference(e) {
      if (!localStorage.getItem("mode")) {
        setMode(e.matches ? "dark" : "light");
      }
    }
    toggleButton.addEventListener("click", () => {
      const newMode = body.classList.contains("light-mode") ? "dark" : "light";
      setMode(newMode);
    });

    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const savedMode =
      localStorage.getItem("mode") ||
      (prefersDarkScheme.matches ? "dark" : "light");
    setMode(savedMode);
    prefersDarkScheme.addListener(handleSystemPreference);
  }
}