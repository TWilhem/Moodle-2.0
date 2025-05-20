function filterCours(filter) {
    const coursBlocks = document.querySelectorAll('.cours-block');

    coursBlocks.forEach(block => {
        const blockFilter = block.getAttribute('data-filter');

        if (filter === 'all') {
            block.style.display = 'block';
        } else {
            if (blockFilter === filter) {
                block.style.display = 'block';
            } else {
                block.style.display = 'none';
            }
        }
    });
}