function main() {

console.log("main appelé")

let actualiserClassement = document.getElementById("actualiserBut");
if (actualiserClassement) {
    actualiserClassement.addEventListener("click", function () {
        actualisationClassement();
    });
}
        
}

function actualisationClassement () {
    fetch("http://localhost:8080/.....chevaux")
        .then(res => res.json())
        .then(data => {
            const olListeChevaux = document.getElementById("liste_chevaux");
            olListeChevaux.innerHTML = "";

            data.forEach((cheval, index) => {
                const liListeChevaux = document.createElement("li");
                liListeChevaux.textContent = `${index + 1}e cheval : ${cheval}`;
                olListeChevaux.appendChild(liListeChevaux);
            });
        })
        .catch(error => console.error("Erreur lors du fetch :", error));


    fetch("http://localhost:8080/.....joueur")
        .then(res => res.json())
        .then(data => {
            const olListeJoueur = document.getElementById("liste_joueur");
            olListeJoueur.innerHTML = "";

            data.forEach((joueur, index) => {
                const liListeJoueur = document.createElement("li");
                liListeJoueur.textContent = `${index + 1}e joueur : ${joueur}`;
                olListeJoueur.appendChild(liListeJoueur);
            });
        })
        .catch(error => console.error("Erreur lors du fetch :", error));

    fetch("http://localhost:8080/.....gains")
        .then(res => res.json())
        .then(data => {
            const olListeGains = document.getElementById("liste_gains");
            olListeGains.innerHTML = "";

            data.forEach((gains, index) => {
                const liListeGains = document.createElement("li");
                liListeGains.textContent = `${index + 1}e gain : ${gains}`;
                olListeGains.appendChild(liListeGains);
            });
        })
        .catch(error => console.error("Erreur lors du fetch :", error));

}

main();