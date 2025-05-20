document.addEventListener("DOMContentLoaded", () => {
    // === AJOUT DE LIENS ===
    function bindAddLink(btn) {
        btn.addEventListener("click", () => {
            const anneeIndex = btn.dataset.annee;
            const ul = btn.parentElement;

            const li = document.createElement("li");
            li.dataset.annee = anneeIndex;
            li.dataset.lien = ul.querySelectorAll("li:not(.add-block)").length;

            const nomSpan = document.createElement("span");
            nomSpan.contentEditable = "true";
            nomSpan.className = "editable-lien-nom";
            nomSpan.textContent = "Nouveau lien";

            const sep = document.createTextNode(" — ");

            const urlSpan = document.createElement("span");
            urlSpan.contentEditable = "true";
            urlSpan.className = "editable-lien-url";
            urlSpan.textContent = "#";

            li.appendChild(nomSpan);
            li.appendChild(sep);
            li.appendChild(urlSpan);

            ul.insertBefore(li, btn);
        });
    }

    document.querySelectorAll(".add-block").forEach(bindAddLink);

    // === AJOUT DE NIVEAUX ===
    document.querySelector(".add-niveau")?.addEventListener("click", () => {
        const container = document.getElementById("filiere-info");
        const index = document.querySelectorAll(".niveau").length;

        const div = document.createElement("div");
        div.className = "niveau";
        div.innerHTML = `
            <h3 contenteditable="true" data-annee-index="${index}">Nouveau niveau</h3>
            <ul>
                <li class="add-block" data-annee="${index}">+</li>
            </ul>
        `;
        container.insertBefore(div, container.querySelector(".add-niveau"));

        bindAddLink(div.querySelector(".add-block"));
    });

    // === DRAG AND DROP IMAGE ===
    const uploadZone = document.getElementById("uploadZone");
    const fileInput = document.getElementById("fileInput");
    const previewImage = document.getElementById("previewImage");

    if (uploadZone && fileInput && previewImage) {
        uploadZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            uploadZone.classList.add("dragging");
        });

        uploadZone.addEventListener("dragleave", () => {
            uploadZone.classList.remove("dragging");
        });

        uploadZone.addEventListener("drop", (e) => {
            e.preventDefault();
            uploadZone.classList.remove("dragging");
            const file = e.dataTransfer.files[0];
            if (file?.type.startsWith("image/")) preview(file);
        });

        uploadZone.addEventListener("click", () => fileInput.click());

        fileInput.addEventListener("change", () => {
            const file = fileInput.files[0];
            if (file?.type.startsWith("image/")) preview(file);
        });

        function preview(file) {
            const reader = new FileReader();
            reader.onload = () => {
                previewImage.src = reader.result;
                previewImage.style.display = "block";
                const placeholder = uploadZone.querySelector(".drop-placeholder, .main-image");
                if (placeholder) placeholder.style.display = "none";
            };
            reader.readAsDataURL(file);
        }
    }

    // === SUPPRESSION AUTOMATIQUE SI VIDE (hors focus) ===
    function reindexLiens(niveau, anneeIndex = null) {
        const annee = anneeIndex ?? niveau.querySelector("h3").dataset.anneeIndex;
        const liens = niveau.querySelectorAll("li:not(.add-block)");
        liens.forEach((lien, i) => {
            lien.dataset.annee = annee;
            lien.dataset.lien = i;
        });
        const addBlock = niveau.querySelector("li.add-block");
        if (addBlock) addBlock.dataset.annee = annee;
    }

    function reindexNiveaux() {
        const niveaux = document.querySelectorAll(".niveau");
        niveaux.forEach((niveau, i) => {
            const h3 = niveau.querySelector("h3");
            h3.dataset.anneeIndex = i;
            reindexLiens(niveau, i);
        });
    }

    function checkAndRemoveEmptyLien(li) {
        const nom = li.querySelector(".editable-lien-nom")?.textContent.trim();
        const url = li.querySelector(".editable-lien-url")?.textContent.trim();

        if (!nom && !url) {
            li.remove();
            const niveau = li.closest(".niveau");
            if (niveau) reindexLiens(niveau);
        }
    }

    function checkAndRemoveEmptyNiveau(niveau) {
        const titre = niveau.querySelector("h3")?.textContent.trim();
        const liens = niveau.querySelectorAll("li:not(.add-block)");
        if (!titre) {
            niveau.remove();
            reindexNiveaux();
        }
    }

    document.getElementById("filiere-info")?.addEventListener("focusout", (e) => {
        const target = e.target;
        if (target.classList.contains("editable-lien-nom") || target.classList.contains("editable-lien-url")) {
            const li = target.closest("li");
            if (li) checkAndRemoveEmptyLien(li);
        } else if (target.tagName === "H3") {
            const niveau = target.closest(".niveau");
            if (niveau) {
                // Supprimer tous les liens vides
                niveau.querySelectorAll("li:not(.add-block)").forEach(li => {
                    checkAndRemoveEmptyLien(li);
                });
                checkAndRemoveEmptyNiveau(niveau);
            }
        }
    }, true);
});

document.getElementById('export-json').addEventListener('click', function (e) {
    e.preventDefault();
    const niveaux = document.querySelectorAll('.niveau');
    const fileInput = document.getElementById('fileInput');
    const previewImage = document.getElementById('previewImage');

    let fileName = "";
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        fileName = "/"+ file.name;
    } else if (previewImage.src != "#" && previewImage.src != "") {
        const urlParts = previewImage.src.split("/");
        fileName = "/" + urlParts[urlParts.length - 1];
    }

    const data = {
        ID: new URLSearchParams(window.location.search).get('id') ?? id,
        Image: fileName ?? "",
        Nom: document.querySelector('h2[contenteditable]').textContent.trim(),
        Années: []
    };

    niveaux.forEach(niveau => {
        const titreRaw = niveau.querySelector('h3').textContent.trim();
        const titre = titreRaw === "null" ? null : titreRaw;
        const liens = [];
        niveau.querySelectorAll('ul li:not(.add-block)').forEach(li => {
            const nom = li.querySelector('.editable-lien-nom')?.textContent.trim() || '';
            const url = li.querySelector('.editable-lien-url')?.textContent.trim() || '#';
            liens.push({ Nom: nom, URL: url });
        });
        data.Années.push({ Niveau: titre, Liens: liens });
    });

    const formData = new FormData();
    formData.append('data', JSON.stringify(data));

    if (fileInput.files.length > 0) {
        formData.append('image', fileInput.files[0]);
    }

    formData.append('action', 'export');

    fetch("MFiliereAction.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            window.location.href = result.redirect_url;
        } else {
            alert(result.message || "Une erreur est survenue.");
        }
    })
    .catch(error => {
        console.error("Erreur lors de l'envoi :", error);
        alert("Une erreur est survenue lors de l'envoi.");
    });

    // document.getElementById('exported-data').value = JSON.stringify(data);
    // console.log(JSON.stringify(data))
});

// document.querySelector('form').addEventListener('submit', function(e) {
//     e.preventDefault(); // ⛔ Empêche l'envoi classique (donc pas de rechargement)

//     // Ici, tu peux gérer l'export via fetch/AJAX
// });