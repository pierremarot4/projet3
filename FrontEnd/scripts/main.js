// Créer et afficher la galerie de projets, récupérer les projets dans l'API
function loadGallery() {
fetch("http://localhost:5678/api/works", {
    method: 'GET',
    headers: {
        Accept: 'application/json',
    },
})
    .then(response => response.json())
    .then(data => {
        const divGallery = document.querySelector(".gallery");
        divGallery.innerHTML = "";

        data.forEach((projet) => {
            const projetElement = document.createElement("figure");

            const projetImage = document.createElement("img");
            projetImage.src = projet.imageUrl;
            const projetTitle = document.createElement("figcaption");
            projetTitle.innerText = projet.title;

            projetElement.appendChild(projetImage);
            projetElement.appendChild(projetTitle);
            divGallery.appendChild(projetElement);
        });
    });
}

loadGallery();

//Récupérer les catégories dans l'API
fetch("http://localhost:5678/api/categories", {
    method: 'GET',
    headers: {
        Accept: 'application/json',
    },
})
    .then(response => response.json())
    .then(data => {
        const filtersContainer = document.getElementById("filters-container");
        createFilterButton({
            name: "Tous"
        })
        data.forEach((btn) => {
            createFilterButton(btn);
        })
    })

// Créer les boutons de filtres
function createFilterButton(btn) {
    const filtersContainer = document.getElementById("filters-container");

    let button = document.createElement("button");
    button.innerText = btn.name;
    if (btn.id) {
        button.dataset.categoryId = btn.id;
    }
    button.classList.add("btn", "active");
    filtersContainer.appendChild(button);
    button.addEventListener("click", () => {
        const divGallery = document.querySelector(".gallery");
        divGallery.innerHTML = "";
        const btns = document.querySelectorAll(".btn");
        btns.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        filters(button)
    });
}


function filters(button) {
    const divGallery = document.querySelector(".gallery");
    divGallery.innerHTML = "";
    fetch("http://localhost:5678/api/works", {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            const divGallery = document.querySelector(".gallery");
            data.forEach((projet) => {
                if (!button.dataset || !button.dataset.categoryId || projet.categoryId == button.dataset.categoryId) {
                    const projetElement = document.createElement("figure");

                    const projetImage = document.createElement("img");
                    projetImage.src = projet.imageUrl;
                    const projetTitle = document.createElement("figcaption");
                    projetTitle.innerText = projet.title;

                    projetElement.appendChild(projetImage);
                    projetElement.appendChild(projetTitle);
                    divGallery.appendChild(projetElement);
                }
            });
        })
}

// PARTIE MODALE
let modal = null

// Ouvrir la fenêtre modale
function openModal(e) {
    const target = document.querySelector(".js-modal")
    target.style.display = null
    target.removeAttribute("aria-hidden")
    target.setAttribute("aria-modal", "true")
    modal = target
    document.querySelectorAll(".js-modal-close").forEach(a => {
         a.addEventListener("click", closeModal)
    });
    const bodyContainer = document.getElementById("body-container");
    bodyContainer.addEventListener("click", closeModal);
    document.querySelectorAll(".modal-wrapper").forEach(a => {
        a.addEventListener("click", stopPropagation)
    });
    const galleryBtn = document.querySelector(".modal-gallery-btn");
    galleryBtn.addEventListener("click", (e) => displayEditForm(e));
    displayModalGallery();
    stopPropagation(e);
}

// Afficher le formulaire d'envoie de nouveau projet
function displayEditForm(e) {
    e.preventDefault();
    const modalWrapperGallery = document.querySelector(".modal-wrapper-gallery");
    const modalAddPhoto = document.querySelector(".modal-add-photo");
    const addImageButton = document.querySelector(".add-image-btn");
    addImageButton.addEventListener("click", importImage);
    modalWrapperGallery.style.display = "none";
    modalAddPhoto.style.display = "block";
    const previousArrow = document.getElementById("previous-arrow");
    previousArrow.addEventListener("click", (e) => {
        e.preventDefault();
        displayModalGallery();
        modalAddPhoto.style.display = "none";
        modalWrapperGallery.style.display = "";
    })
    fetch("http://localhost:5678/api/categories", {
        method: "GET",
        headers: {
            Accept: 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            const selectElement = document.getElementById("category");
            selectElement.innerHTML = "";
            data.forEach((category) => {
                const optionElement = document.createElement("option");
                optionElement.value = category.id;
                optionElement.innerHTML = category.name;
                selectElement.appendChild(optionElement);
            });
        })
}

function importImage() {
    const imageFile = document.getElementById("image-file");
    imageFile.click();
}

// Envoyer un nouveau projet via le formulaire
function sendNewWork() {
    const token = localStorage.getItem("token");
    const form = document.getElementById("upload-form");
    const formData = new FormData(form);
    fetch("http://localhost:5678/api/works/", {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + token
        },
        body: formData,
    })
        .then(response => {
            console.log(response)
            alert ("La photo est bien ajoutée");
            loadGallery();
        })
        .catch((erreur) => {
            alert ("Une erreur est survenue");
        })
}


// Fermer la fenêtre modale
const closeModal = function (e) {
    if (modal === null) return

    const modalWrapperGallery = document.querySelector(".modal-wrapper-gallery");
    const modalAddPhoto = document.querySelector(".modal-add-photo");
    modalAddPhoto.style.display = "none";
    modalWrapperGallery.style.display = "";
    modal.style.display = "none"
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
    modal = null
    const modalGallery = document.querySelector(".modal-gallery");
    modalGallery.innerHTML = ""
    stopPropagation(e);
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
})


// Récupérer les travaux dans l'API et les afficher dans la fenêtre modale
function displayModalGallery() {
    
    fetch("http://localhost:5678/api/works", {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            const modalGallery = document.querySelector(".modal-gallery");
            modalGallery.innerHTML="";
            data.forEach((projet) => {
                const container = document.createElement("div");
                container.classList.add("modal-gallery-container");
                const modalProjetElement = document.createElement("img");
                modalProjetElement.className = "modal-img";
                modalProjetElement.src = projet.imageUrl;
                container.appendChild(modalProjetElement);
                const trashIcon = document.createElement("i");
                trashIcon.classList.add("fa-solid", "fa-trash", "trash-icon");
                trashIcon.addEventListener("click", (e) => deleteProjet(e.target.getAttribute("projetId")));
                trashIcon.setAttribute("projetId", projet.id);
                container.appendChild(trashIcon);
                modalGallery.appendChild(container);
            });
        })
}

// Supprimer un projet
function deleteProjet(id) {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5678/api/works/" + id, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + token
        },
    })
        .then(response => {
            if (response.ok) {
                const modalGallery = document.querySelector(".modal-gallery");
                modalGallery.innerHTML = "";
                displayModalGallery()
            }
        }).catch(err => console.error(err));
}


// Eléments au chargement de la page
window.addEventListener("load", () => { onLoad() })
async function onLoad() {
    const logoutLink = document.querySelector("#logout-link");
    const loginLink = document.querySelector("#login-link");
    const token = localStorage.getItem("token");
    const editorMode = document.querySelector("#editor-mode");
    const filterBtns = document.querySelectorAll(".btn");
    const editorElements = document.querySelectorAll("#editor-element");

    editorMode.style.display = "none";
    editorElements.forEach((editorElement) => {
        editorElement.style.display = "none";
    });

    if (token) {
        filterBtns.forEach((filterBtn) => {
            filterBtn.style.display = "none";
        });

        editorElements.forEach((editorElement) => {
            editorElement.style.display = "flex";
        });

        editorMode.style.display = "flex";
        logoutLink.style.display = "block";
        loginLink.style.display = "none";

        logoutLink.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.reload();
        });
    }

    if (!token) {
        const modal1 = document.getElementById("open-modal1");
        modal1.style.display = "none";
    }

    const modal1 = document.getElementById("open-modal1");
    if (modal1) {
        modal1.addEventListener("click", (e) => { openModal(e) });
    }

    const modalAddButton = document.getElementById("modal-add-btn");
    modalAddButton.addEventListener("click", sendNewWork);

    const imageFile = document.getElementById("image-file"); 
    imageFile.addEventListener("change", (e) => { 
        const output = document.getElementById("image-preview");
        output.style.display = "block";
        const imageIcon = document.getElementById("image-icon");
        imageIcon.style.display = "none";
        const addImageButton = document.querySelector(".add-image-btn");
        addImageButton.style.display = "none";
        output.src = URL.createObjectURL(e.target.files[0]);
    })

}