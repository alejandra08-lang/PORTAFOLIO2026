/* =========================================================
   NAVBAR Y FOOTER — se cargan como componentes con fetch.
   Requiere servir el sitio por HTTP (Live Server, GitHub Pages…);
   con file:// el navegador bloquea fetch.

   <body data-root="">     → index.html
   <body data-root="../">  → páginas dentro de /pages
   En los componentes, {{root}} y {{home}} se reemplazan por la
   ruta correcta según la página.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const root = document.body.dataset.root || "";
    const isHome = root === "";
    const home = isHome ? "" : `${root}index.html`;

    const loadComponent = (path, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return Promise.resolve(null);

        return fetch(`${root}${path}`)
            .then(response => {
                if (!response.ok) throw new Error(`No se pudo cargar ${path}`);
                return response.text();
            })
            .then(html => {
                container.innerHTML = html
                    .replaceAll("{{root}}", root)
                    .replaceAll("{{home}}", home);
                return container;
            })
            .catch(error => {
                console.error(error);
                return null;
            });
    };

    loadComponent("components/navbar.html", "navbar").then(container => {
        if (container) initNavbar(isHome);
    });

    loadComponent("components/footer.html", "site-footer").then(container => {
        if (!container) return;
        const year = container.querySelector("[data-year]");
        if (year) year.textContent = new Date().getFullYear();
    });
});

function initNavbar(isHome) {
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".menu-toggle");
    const panel = document.getElementById("primary-nav");
    if (!header || !toggle || !panel) return;

    const setOpen = isOpen => {
        panel.classList.toggle("is-open", isOpen);
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    };

    toggle.addEventListener("click", () => {
        setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Cerrar al elegir un enlace, con Escape o al hacer clic fuera
    panel.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => setOpen(false));
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && panel.classList.contains("is-open")) {
            setOpen(false);
            toggle.focus();
        }
    });

    document.addEventListener("click", event => {
        if (panel.classList.contains("is-open") && !header.contains(event.target)) {
            setOpen(false);
        }
    });

    // Borde inferior al hacer scroll
    const updateScrolled = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });

    // Resaltar la sección visible (solo en la one-page)
    if (!isHome || !("IntersectionObserver" in window)) return;

    const links = [...document.querySelectorAll(".nav-link[data-section]")];
    const sections = links
        .map(link => document.getElementById(link.dataset.section))
        .filter(Boolean);

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            links.forEach(link => {
                const isActive = link.dataset.section === entry.target.id;
                if (isActive) link.setAttribute("aria-current", "true");
                else link.removeAttribute("aria-current");
            });
        });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(section => observer.observe(section));
}
