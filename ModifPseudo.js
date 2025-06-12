let id;
let pseudo;


function main() {

console.log("main appelé")

let modifPseudo = document.getElementById("formModifPseudo")
    if (modifPseudo) {
        modifPseudo.addEventListener("submit", function (event) {
            event.preventDefault();
            console.log("test lancement");
            changementUsername(event);
    });
    }
        
}

function changementUsername(event) {

    let form = event.target;
    let usernameInput = form.elements["username"]; 
    let newUsernameInput = form.elements["newUsername"];
    let passwordInput = form.elements["password"];

    fetch("http://localhost:8080/courses/hippiques/joueur/modifPseudo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput.value, newUsername: newUsernameInput.value, password: passwordInput.value })
    })

    .then(res => {
    return res.json().then(data => {
        if (res.status === 401) {
            passwordInput.value = "";
            newUsernameInput.value = "";
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
        sessionStorage.setItem("pseudo", newUsernameInput.value);
        passwordInput.value = "";
        newUsernameInput.value = "";
        usernameInput.value = "";
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