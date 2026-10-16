/* =========================================================
   ANIMACIONES — aparición al hacer scroll con IntersectionObserver.
   Los elementos con [data-reveal] reciben .is-visible al entrar
   en pantalla. Si el usuario pidió reducir el movimiento o el
   navegador no soporta IntersectionObserver, se muestran todos.
   ========================================================= */

(() => {
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
        items.forEach(item => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
        });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });

    items.forEach(item => observer.observe(item));
})();
