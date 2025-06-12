let id;
let pseudo;


function main() {

console.log("main appelé")

let modifPassword = document.getElementById("formModifPassword")
    if (modifPassword) {
        modifPassword.addEventListener("submit", function (event) {
            event.preventDefault();
            console.log("test lancement");
            changementPassword(event);
    });
    }
        
}

function changementPassword(event) {

    let form = event.target;
    let username = form.elements["username"].value; 
    let passwordInput = form.elements["password"];
    let newPasswordInput = form.elements["newPassword"];

    fetch("http://localhost:8080/courses/hippiques/joueur/modifPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: passwordInput.value, newPassword: newPasswordInput.value })
    })

    .then(res => {
    return res.json().then(data => {
        if (res.status === 401) {
            passwordInput.value = "";
            newPasswordInput.value = "";
            afficherPopup(data.message);
            throw new Error(data.message);
        }
        if (!res.ok) {
            throw new Error("Erreur serveur : " + res.status);
        }
        return data;
    });
})
    .then(data => {
        passwordInput.value = "";
        newPasswordInput.value = "";
        afficherPopupSuccess(data.message);
    })
    .catch(err => console.error("Erreur connexion :", err.message));
}


function afficherPopup(message) {
    const popup = document.getElementById("popupErreur");
    const messageDiv = document.getElementById("messageErreurPopup");
    const boutonFermer = document.getElementById("fermerPopup");

    messageDiv.textContent = message;
    popup.style.display = "block";

    // Auto-hide après 4 secondes
    setTimeout(() => {
        popup.style.display = "none";
    }, 4000);

    boutonFermer.onclick = function() {
        popup.style.display = "none";
    };
}

function afficherPopupSuccess(message) {
    const popup = document.getElementById("popupConnection");
    const messageDiv = document.getElementById("messagePopup");
    const boutonFermer = document.getElementById("popupConnection");

    messageDiv.textContent = message;
    popup.style.display = "block";

    // Auto-hide après 4 secondes
    setTimeout(() => {
        popup.style.display = "none";
    }, 4000);

    boutonFermer.onclick = function() {
        popup.style.display = "none";
    };
}


main();