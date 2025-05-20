function redirigerVersSemestre(semestre) {
    const url = new URL(window.location.href);
    if (semestre === 'tous') {
        url.searchParams.delete('S');
    } else {
        url.searchParams.set('S', `S${semestre}`);
    }
    window.location.href = url.toString();
}

let editModeActive = false;
function enableEditMode(icon) {
    const bubble = icon.closest('.bubble');
    bubble.querySelector('.edit-form').style.display = 'block';
    bubble.querySelector('.bubble-settings').style.display = 'none';
    bubble.querySelector('.Info').style.display = 'none';
    bubble.querySelector('.Image').style.display = 'none';
    editModeActive = true;
}

function cancelEdit(button) {
    const form = button.closest('.edit-form');
    const bubble = form.closest('.bubble');
    form.style.display = 'none';
    bubble.querySelector('.bubble-settings').style.display = 'block';
    bubble.querySelector('.Info').style.display = 'block';
    bubble.querySelector('.Image').style.display = 'block';
    editModeActive = false;
}

function handleDrop(e, dropzone) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const input = dropzone.querySelector('input[type="file"]');
    input.files = e.dataTransfer.files;
    previewImage(input);
}

function previewImage(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        const uploadZone = input.closest('.upload-zone');
        const preview = uploadZone.querySelector('.preview');
        const message = uploadZone.querySelector('p');
        preview.src = e.target.result;
        preview.style.display = 'block';
        if (message) {
            message.style.display = 'none';
        }
    };
    reader.readAsDataURL(file);
}

function syncContent(form) {
    const editables = form.querySelectorAll('.editable');
    editables.forEach(p => {
        const name = p.dataset.field;
        const input = form.querySelector(`input[name="${name}"]`);
        if (input) input.value = p.innerText.trim();
        if (name === 'id_ressource') {
            const isValid = /^[a-zA-Z0-9_-]+$/.test(p.innerText.trim());
            if (!isValid) {
                alert("L'ID ne doit contenir que des lettres, chiffres, tirets ou underscores.");
                event.preventDefault(); // bloque la soumission
                return false;
            }
        }
    });
    return true;
}

const abubble = document.querySelector('.Abubble');

if (abubble) {
    abubble.addEventListener('click', function () {
        const Ajout = document.querySelector('.Ajout');
        const form = document.querySelector('#ADJ');
        if (form && Ajout) {
            if (form.style.display === 'none') {
                form.style.display = 'block';
                Ajout.style.display = 'none';
            }
        }
    });
}

function AcancelEdit() {
    const form = document.querySelector('#ADJ')
    const Ajout = document.querySelector('.Ajout');
    form.style.display = 'none';
    Ajout.style.display = 'block';
}

const adjForm = document.querySelector('#ADJ');

if (adjForm) {
    adjForm.addEventListener('click', function (e) {
        e.stopPropagation();
    });
}
