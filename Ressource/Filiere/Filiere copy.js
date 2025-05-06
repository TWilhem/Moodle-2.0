document.addEventListener('DOMContentLoaded', () => {
    const bubbles = document.querySelectorAll('.bubble');

    bubbles.forEach(bubble => {
        bubble.addEventListener('click', (e) => {
            if (e.target.closest('.bubble-second')) return;

            // Ferme tous les autres
            bubbles.forEach(b => {
                if (b !== bubble) {
                    b.classList.remove('open');
                    b.querySelectorAll('.bubble-second').forEach(second => {
                        second.style.display = 'none';
                    });
                }
            });

            // Toggle l'ouverture de cette bubble
            bubble.classList.toggle('open');

            // Affiche/cacher les bubble-second
            const seconds = bubble.querySelectorAll('.bubble-second');
            if (bubble.classList.contains('open')) {
                seconds.forEach(second => {
                    second.style.display = 'block';
                    second.querySelector('.sub-links').style.opacity = '0';
                    second.querySelector('.sub-links').style.maxHeight = '0';
                    const text = second.querySelector('.bubble-second-text');
                    if (text) text.style.opacity = '1'; // On remet visible le texte
                });
            } else {
                seconds.forEach(second => {
                    second.style.display = 'none';
                });
            }
        });

        const bubbleSeconds = bubble.querySelectorAll('.bubble-second');
        bubbleSeconds.forEach(bubbleSecond => {
            bubbleSecond.addEventListener('click', (e) => {
                e.stopPropagation();

                bubbleSeconds.forEach(second => {
                    if (second !== bubbleSecond) {
                        second.style.display = 'none';
                    } else {
                        // Cacher uniquement le texte du bubble-second
                        const text = second.querySelector('.bubble-second-text');
                        if (text) text.style.opacity = '0';
                    }
                });

                const subLinks = bubbleSecond.querySelector('.sub-links');
                subLinks.style.opacity = '1';
                subLinks.style.pointerEvents = 'auto';
                subLinks.style.maxHeight = '300px';
            });
        });
    });
});
