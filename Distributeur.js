let compteBancaire;
let id = sessionStorage.getItem("id");

function main() {

    affichageArgent();

}


function affichageArgent() {
fetch("http://localhost:8080/courses/hippiques/joueur/affichageprofil", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ id: parseInt(id) }) 
})
.then(res => res.json())
.then(data => {
    let argent = data["argent"];
    compteBancaire = data["compteBancaire"];

    const contenu = document.getElementById("affichage");
    contenu.innerHTML = `
        <h3>Votre compte bancaire : ${compteBancaire} €</h3>
        <p><strong>Argent disponible :</strong> ${argent} €</p>`;
})
.catch(err => console.error("Erreur :", err));

document.getElementById("formDistributeur").addEventListener("submit", function(event) {
    event.preventDefault();
    recuperationArgent(event);
});
}


function recuperationArgent(event) {
    let form = event.target;
    let argentRetire = form.elements["retirer"];
    let montant = parseFloat(argentRetire.value);

    if (montant <= compteBancaire && montant > 0) {
        fetch("http://localhost:8080/courses/hippiques/joueur/retirer/argent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: parseInt(id), argent: montant })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Erreur serveur : " + res.status);
            }
            return res.text();
        })
        .then(data => {
            argentRetire.value = "";
            afficherPopupSuccess("Argent retiré avec succès !");
            affichageArgent();
        })
        .catch(err => console.error("Erreur connexion :", err.message));
    } else {
        argentRetire.value = "";
        afficherPopupErreur("Montant invalide");
    }
}


function afficherPopupSuccess(message) {
    const popup = document.getElementById("popupBienvenue");
    const messageDiv = document.getElementById("messageBienvenuePopup");
    const boutonFermer = document.getElementById("fermerBienvenue");

    messageDiv.textContent = message;
    popup.style.display = "block";

    setTimeout(() => {
        popup.style.display = "none";
    }, 4000);

    boutonFermer.onclick = function () {
        popup.style.display = "none";
    };
}

function afficherPopupErreur(message) {
    const popup = document.getElementById("popupErreur");
    const messageElem = document.getElementById("messageErreurPopup");
    const contenu = popup.querySelector(".popup-contenu"); // <-- ici, très important !

    messageElem.textContent = message;
    popup.style.display = "block";

    document.getElementById("fermerErreur").onclick = () => {
        popup.style.display = "none";
    };


    setTimeout(() => {
        popup.style.display = "none";
    }, 4000);
}

main();