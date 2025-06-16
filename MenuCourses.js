function main() {

console.log("main appelé")

let deconnexion = document.getElementById("SaveAndQuitBut")
    if (deconnexion) {
        deconnexion.addEventListener("click", function (event) {
            event.preventDefault();
            console.log("test lancement");
            deconnexionJoueur();
    });
    }

    let parisSimple = document.getElementById("ParisSimpleBut")
    if (parisSimple) {
        parisSimple.addEventListener("click", function () {
             sessionStorage.setItem("Type de paris", "SIMPLE");
    });
    }

    window.addEventListener("DOMContentLoaded", () => {
    let id = sessionStorage.getItem("id");
    let pseudo = sessionStorage.getItem("pseudo");
    let messageBienvenue = sessionStorage.getItem("messageBienvenue");

    if (!id || !pseudo) {
        afficherPopupErreur("Veuillez vous connecter d'abord.");
        window.location.href = "Connexion.html";
    }
    else if (!messageBienvenue) {
        afficherPopupBienvenue(pseudo);
        sessionStorage.setItem("messageBienvenue", "true");
    }
});

let info = document.getElementById("InfoBut")
    if (info) {
        info.addEventListener("click", function (event) {
            event.preventDefault();
            afficherProfil();
    });
    }

let distributeur = document.getElementById("DistributeurBut")
    if (distributeur) {
        distributeur.addEventListener("click", function () {
            event.preventDefault();
            window.location.href = "Distributeur.html";
    });
    }

let bar = document.getElementById("BarBut")
    if (bar) {
        bar.addEventListener("click", function (event) {
            event.preventDefault();
            enTravaux();
    });
    }

let stats = document.getElementById("StatsBut")
    if (stats) {
        stats.addEventListener("click", function (event) {
            event.preventDefault();
            afficherStats();
    });
    }
   
}

function afficherStats() {
    let id = sessionStorage.getItem("id");
    if (!id) {
        alert("Aucun ID de joueur trouvé !");
        return;
    }

    fetch("http://localhost:8080/courses/hippiques/joueur/affichageprofil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({id})
    })
    .then(res => {
        if (!res.ok) throw new Error("Erreur serveur : " + res.status);
        return res.json();
    })
    .then(data => {
        console.log(data);

        const contenu = document.getElementById("contenuProfil");
        contenu.innerHTML = `
            <h3>Pseudo : ${data.username}</h3>
            <p><strong>Gains générés :</strong> ${data.gainsGeneres} €</p>
            <p><strong>Nombre de parties jouées :</strong> ${data.nbPartiesJouees}</p>
            <p><strong>Nombre de parties gagnées :</strong> ${data.nbPartiesGagnees}</p>
        `;

        document.getElementById("popupProfil").style.display = "flex";
    })
    .catch(err => {
        console.error("Erreur connexion :", err.message);
        alert("Erreur lors du chargement du profil.");
    });
}

// Fermer le popup
document.getElementById("fermerProfil").addEventListener("click", () => {
    document.getElementById("popupProfil").style.display = "none";
});



function afficherProfil() {
    let id = sessionStorage.getItem("id");
    if (!id) {
        alert("Aucun ID de joueur trouvé !");
        return;
    }

    fetch("http://localhost:8080/courses/hippiques/joueur/affichageprofil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({id})
    })
    .then(res => {
        if (!res.ok) throw new Error("Erreur serveur : " + res.status);
        return res.json();
    })
    .then(data => {
        console.log(data);

        const contenu = document.getElementById("contenuProfil");
        contenu.innerHTML = `
            <h3>Pseudo : ${data.username}</h3>
            <p><strong>Argent disponible :</strong> ${data.argent} €</p>
        `;

        document.getElementById("popupProfil").style.display = "flex";
    })
    .catch(err => {
        console.error("Erreur connexion :", err.message);
        alert("Erreur lors du chargement du profil.");
    });
}

// Fermer le popup
document.getElementById("fermerProfil").addEventListener("click", () => {
    document.getElementById("popupProfil").style.display = "none";
});





function deconnexionJoueur() {

sessionStorage.clear();
window.location.href = "Accueil.html"; 
}

function enTravaux() {
alert("en travaux !");
}

function afficherPopupBienvenue(pseudo) {
    const popup = document.getElementById("popupBienvenue");
    const messageDiv = document.getElementById("messageBienvenuePopup");
    const boutonFermer = document.getElementById("fermerBienvenue");

    messageDiv.textContent = "Bienvenue " + pseudo + " !";
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
        window.location.href = "Connexion.html";
    };


    setTimeout(() => {
        popup.style.display = "none";
        window.location.href = "Connexion.html";
    }, 4000);
}



main();



