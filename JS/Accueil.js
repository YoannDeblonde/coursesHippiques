function main() {

console.log("main appelé")

    actualisationClassement();    
}

function actualisationClassement () {
    fetch("http://localhost:8080/courses/hippiques/main/recuperation/top/3/joueurs")
        .then(res => res.json())
        .then(data => {
            const olTop3Joeurs = document.getElementById("top3");
            olTop3Joeurs.innerHTML = "";

            data.forEach((joueur, index) => {
                console.log(data);
                const liListeJoueur = document.createElement("li");
                liListeJoueur.textContent = `${index + 1}e joueur : ${joueur.username ?? "Inconnu"} - Parties gagnées : ${joueur.nbPartiesGagnees}`;
                olTop3Joeurs.appendChild(liListeJoueur);
            });
        })
        .catch(error => console.error("Erreur lors du fetch :", error));
}

main();