document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.getElementById('togglePasswordSection');
    const passwordSection = document.getElementById('passwordSection');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    let visible = false;

    toggleBtn.addEventListener('click', function () {
        if (!visible) {
            passwordSection.style.maxHeight = passwordSection.scrollHeight + 'px';
            passwordSection.style.opacity = '1';
            visible = true;
        } else {
            passwordSection.style.maxHeight = '0';
            passwordSection.style.opacity = '0';
            visible = false;
        }
    });

    togglePassword.addEventListener('click', function () {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';

        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("photo");
    const fileUpload = document.getElementById("file-upload");
    const preview = document.getElementById("image-preview");
    const uploadBox = document.getElementById("file-upload-box");

    // Gérer l'affichage de l'image
    fileInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
                preview.style.display = "block";
                uploadBox.style.display = "none";
            };
            reader.readAsDataURL(file);
        }
    });

    // Drag-and-drop
    ["dragenter", "dragover"].forEach(eventType => {
        fileUpload.addEventListener(eventType, e => {
            e.preventDefault();
            e.stopPropagation();
            fileUpload.style.borderColor = "#333";
            fileUpload.style.backgroundColor = "#eef";
        });
    });

    ["dragleave", "drop"].forEach(eventType => {
        fileUpload.addEventListener(eventType, e => {
            e.preventDefault();
            e.stopPropagation();
            fileUpload.style.borderColor = "#aaa";
            fileUpload.style.backgroundColor = "#f9f9f9";
        });
    });

    fileUpload.addEventListener("drop", e => {
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            fileInput.dispatchEvent(new Event("change"));
        }
    });
});



