document.addEventListener("DOMContentLoaded", () => {
    const burger = document.querySelector('.right-icon i');
    const sidebar = document.getElementById('sidebar');
    const settingsIcon = document.querySelector('.fa-user-gear');
    const linksMenu = document.getElementById('linksMenu');

    // Ouvrir / Fermer la sidebar au clic du hamburger
    burger.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Afficher / Cacher les liens Paramètre et Déconnexion
    settingsIcon.addEventListener('click', () => {
        // Basculer l'affichage du menu Paramètres
        if (linksMenu.style.display === 'flex') {
            linksMenu.style.display = 'none';
        } else {
            linksMenu.style.display = 'flex';
        }
    });

    // Fermer la sidebar automatiquement si on dépasse 1024px
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            sidebar.classList.remove('active');
        }
    });
});
