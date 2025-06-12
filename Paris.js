function main() {

console.log("main appelé")

let recupPari = document.getElementById("formParis")
    if (recupPari) {
        recupPari.addEventListener("submit", function (event) {
            event.preventDefault();
            console.log("test lancement");
            recuperationPari(event);
    });
    }

   
}

function recuperationPari(event) {

    let form = event.target;
    let mise = form.elements["mise"].value; 
    let chevalInput = form.elements["cheval"].value;
    let id = sessionStorage.getItem("id");

    let idChevaux = chevalInput.split(',').map(str => parseInt(str.trim()));

    console.log(mise);
    console.log(idChevaux);
    console.log(id);

    fetch("http://localhost:8080/courses/hippiques/main/initPariAvecIdJoueur/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idJoueur: id, mise, idChevaux })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Erreur serveur : " + res.status);
        }
        return res.text();
    })
    .then(data => {
        console.log("Pari sauvegardé !", data);
        window.location.href = "";

    })
    .catch(err => console.error("Erreur connexion :", err.message));
}

main();

