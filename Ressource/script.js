document.addEventListener("DOMContentLoaded", () => {
    const burger = document.querySelector('.right-icon i');
    const sidebar = document.getElementById('sidebar');

    burger.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Fermer la sidebar automatiquement si on dépasse 1024px
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            sidebar.classList.remove('active');
        }
    });
});
