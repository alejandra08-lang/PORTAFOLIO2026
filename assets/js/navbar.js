document.addEventListener("DOMContentLoaded", () => {

    const isPage = window.location.pathname.includes("/pages/");

    const navbarPath = isPage
        ? "../components/nabvar-pages.html"
        : "components/navbar.html";
    const footerPath = isPage
        ? "../components/footer.html"
        : "components/footer.html";

    fetch(footerPath)
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo cargar el footer");
            }
            return response.text();
        })
        .then(data => {
            const footerContainer = document.getElementById("site-footer");
            if (!footerContainer) return;

            footerContainer.innerHTML = data;
            footerContainer.querySelector("#copyright-year").textContent = new Date().getFullYear();
        })
        .catch(error => console.error(error));

    fetch(navbarPath)
    .then(response => {
        if (!response.ok) {
            throw new Error("No se pudo cargar el navbar");
        }
        return response.text();
    })
    .then(data => {
        document.getElementById("navbar").innerHTML = data;

        const menuButton = document.querySelector(".menu-toggle");
        const menu = document.querySelector(".nav-menu");

        menuButton.addEventListener("click", () => {
            const isOpen = menu.classList.toggle("is-open");
            menuButton.setAttribute("aria-expanded", String(isOpen));
            menuButton.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
        });

        menu.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                menu.classList.remove("is-open");
                menuButton.setAttribute("aria-expanded", "false");
                menuButton.setAttribute("aria-label", "Abrir menú");
            });
        });

        const themeButton = document.querySelector(".theme-btn");
        if (themeButton) {
            themeButton.addEventListener("click", () => {
                const isLight = document.body.classList.toggle("light-theme");
                themeButton.textContent = isLight ? "☀️" : "🌙";
                themeButton.setAttribute("aria-pressed", String(isLight));
                themeButton.setAttribute("aria-label", isLight ? "Cambiar a tema oscuro" : "Cambiar a tema claro");
            });
        }
    })
    .catch(error => {
        console.error(error);
    });
});
