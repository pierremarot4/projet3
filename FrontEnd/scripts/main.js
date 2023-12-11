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
        const projetElement = document.createElement("figure");

        const projetImage = document.createElement("img");
        projetImage.src = projet.imageUrl;
        const projetTitle = document.createElement("figcaption");
        projetTitle.innerText = projet.title;

        projetElement.appendChild(projetImage);
        projetElement.appendChild(projetTitle);
        divGallery.appendChild(projetElement);
    });
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
            name : "Tous"
        })
        data.forEach((btn) => {
            createFilterButton(btn);
        })
    })
})


function createFilterButton (btn) {
    const filtersContainer = document.getElementById("filters-container");

    let button = document.createElement("button");
    button.innerText = btn.name;
    if(btn.id) {
        button.dataset.categoryId=btn.id;
    }
    button.classList.add("btn", "active");
    filtersContainer.appendChild(button);
    button.addEventListener("click", () => {
        const divGallery = document.querySelector(".gallery");
        divGallery.innerHTML = ""; 
        const btns = document.querySelectorAll(".btn");
        btns.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        filters (button)
    });
}


function filters (button) {
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
            if (!button.dataset || !button.dataset.categoryId || projet.categoryId==button.dataset.categoryId) {
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

let modal = null

function openModal() {
    const target = document.querySelector(".js-modal")
    target.style.display = null
    target.removeAttribute("aria-hidden")
    target.setAttribute("aria-modal", "true")
    modal = target
    const jsModalClose = document.querySelector(".js-modal-close");
    if (jsModalClose) {
        jsModalClose.addEventListener("click", closeModal)
    }
}

const closeModal = function (e) {
    if (modal === null) return
    modal.style.display = "none"
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
    modal = null
    stopPropagation(e);
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

window.addEventListener("keydown", function (e){
    if (e.key === "Escape"  || e.key === "Esc") {
        closeModal(e)
    }
})

window.addEventListener("load",  ()=>{onLoad()})
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

    const modal1 = document.getElementById("open-modal1");
    if (modal1) {
        modal1.addEventListener("click", ()=>{openModal()});
    }

    document.querySelectorAll(".js-modal").forEach(a => {
        a.addEventListener("click", openModal)
    })
}