function initFiliere() {
    const bubbles = document.querySelectorAll(".bubble");

    document.addEventListener("click", (e) => {
        // Fermer toutes les bulles si on clique en dehors
        if (!e.target.closest(".bubble")) {
            bubbles.forEach(bubble => {
                const bubbleGroup = bubble.querySelector(".bubble-second-group");
                const title = bubbleGroup.querySelector("p");
                const secondItems = bubbleGroup.querySelectorAll(".bubble-second");
                const secondTexts = bubbleGroup.querySelectorAll(".bubble-second-text");
                const subLinks = bubbleGroup.querySelectorAll(".sub-links");

                title.style.display = "flex";
                secondItems.forEach(item => item.style.display = "none");
                secondTexts.forEach(text => text.style.display = "inline-block");
                subLinks.forEach(links => links.style.display = "none");
            });
        }
    });

    bubbles.forEach(bubble => {
        const bubbleGroup = bubble.querySelector(".bubble-second-group");
        const title = bubbleGroup.querySelector("p");
        const secondItems = bubbleGroup.querySelectorAll(".bubble-second");
        const secondTexts = bubbleGroup.querySelectorAll(".bubble-second-text");
        const subLinks = bubbleGroup.querySelectorAll(".sub-links");

        bubble.addEventListener("click", (e) => {
            if (e.target.classList.contains("bubble-second-text") || e.target.closest(".sub-links")) return;

            // Fermer toutes les autres bulles
            bubbles.forEach(otherBubble => {
                if (otherBubble !== bubble) {
                    const group = otherBubble.querySelector(".bubble-second-group");
                    group.querySelector("p").style.display = "flex";
                    group.querySelectorAll(".bubble-second").forEach(item => item.style.display = "none");
                    group.querySelectorAll(".bubble-second-text").forEach(text => text.style.display = "inline-block");
                    group.querySelectorAll(".sub-links").forEach(sub => sub.style.display = "none");
                }
            });

            title.style.display = "none";

            if (secondItems.length > 0) {
                secondItems.forEach(item => item.style.display = "flex");
                secondTexts.forEach(text => text.style.display = "inline-block");
                subLinks.forEach(links => links.style.display = "none");
            } else {
                subLinks.forEach(links => {
                    links.style.display = "flex";
                    links.style.flexDirection = "row";
                    links.style.gap = "5px";
                });
            }
        });

        // Clic sur un texte d’année
        secondTexts.forEach(text => {
            text.addEventListener("click", (e) => {
                e.stopPropagation();

                secondTexts.forEach(t => t.style.display = "none");
                const parent = text.parentElement;
                const subLinks = parent.querySelector(".sub-links");
                if (subLinks) {
                    subLinks.style.display = "flex";
                    subLinks.style.flexDirection = "row";
                    subLinks.style.gap = "5px";
                }
            });
        });
    });
};

// Rendre disponible dans le global
window.initFiliere = initFiliere;