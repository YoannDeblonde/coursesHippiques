/* sessionStorage =  */

let id;
let pseudo;


function main() {

console.log("main appelé")

let connexionJoueur = document.getElementById("formConnexion")
    if (connexionJoueur) {
        connexionJoueur.addEventListener("submit", function (event) {
            event.preventDefault();
            console.log("test lancement");
            tentativeConnexion(event);
    });
    }

let id = sessionStorage.getItem("id");
let pseudo = sessionStorage.getItem("pseudo");

if (id && pseudo) {
    console.log("Utilisateur déjà connecté :", pseudo, "(ID :", id, ")");
    window.location.href = "MenuCourses.html";
}

        
}

function tentativeConnexion(event) {

    let form = event.target;
    let username = form.elements["username"].value; 
    let passwordInput = form.elements["password"];

    fetch("http://localhost:8080/courses/hippiques/joueur/tentativeconnectionjoueur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: passwordInput.value })
    })
    .then(res => {
        if (res.status === 401) {
            passwordInput.value = "";
            passwordInput.focus();
            afficherPopup("Mot de passe incorrect.");
            throw new Error("Mot de passe incorrect");
        }
        if (!res.ok) {
            throw new Error("Erreur serveur : " + res.status);
        }
        return res.json();
    })
    .then(data => {
        console.log("Connecté, id:", data);
        id = data;
        pseudo = username;
        sessionStorage.setItem("id", id);
        sessionStorage.setItem("pseudo", pseudo);
        console.log("Joueur connecté :", username, "(ID :", id, ")");
        window.location.href = "ZHEADER.html";

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


main();