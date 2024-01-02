window.addEventListener("load",  ()=>{

    const loginForm = document.forms[0]
    const error = document.querySelector("#error-message")

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const formData = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value,
        }
        const chargeUtile = JSON.stringify(formData)

        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": 'application/json' },
            body: chargeUtile,
        })
            .then(response => response.json())
            .then(data => {

                if (data.token) {
                    localStorage.setItem("token", data.token)
                    window.location.href = "index.html"
                } else {
                    error.textContent = "Identifiant ou mot de passe incorrect"
                }

            })
    })
})
