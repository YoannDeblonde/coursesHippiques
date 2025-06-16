let linkChoixChevalPari = document.getElementById("choixChevalParis");
let argent
let id = sessionStorage.getItem("id");
let ordreSelection = [];

fetch("http://localhost:8080/courses/hippiques/joueur/affichageprofil2",{
    method:"POST",
    headers:{"Content-Type":"application/json"
    },
    body: JSON.stringify(id)
})
    .then(res => res.json())
    .then(data => {argent=data["argent"];})
    .catch(err => console.log(err));

function main() {
    console.log("main appelé")
    setChoixCheval();
}

function setChoixCheval(){
    let idCourse = sessionStorage.getItem("idCourse");
    let typeParis = sessionStorage.getItem("Type de paris");
    console.log("ID Course:", idCourse);
    console.log("Type de pari:", typeParis);

    fetch("http://localhost:8080/courses/hippiques/course/recuperer1Course",{
    method:"POST",
    headers:{"Content-Type":"application/json"
    },
    body: JSON.stringify(idCourse)
    })
    .then(res => res.json())
    .then(data => {
    
        
        let listeCheval = data["listeCheval"];
        console.log(listeCheval);
        let nbParticipants = data["nbParticipants"];
        for (let i=0;i<nbParticipants;i++){
            let idChevalChoix = "cheval"+i;
            let idCheval = listeCheval[i]["idCheval"];
            let coteCheval = listeCheval[i]["cote"].toFixed(2);
            let nomCheval = listeCheval[i]["nom"];

            if (typeParis === "SIMPLE" || typeParis === "SIMPLE_PLACE") {
                linkChoixChevalPari.innerHTML += "<div>" + "<input type=\"radio\" name=\"choix\"  value=\""+idCheval+"\" id=\""+idChevalChoix+"\">+<label for=\""+idChevalChoix+"\">"+nomCheval+"; cote = "+coteCheval +"</label>"+ "</div>"
            }

            else if (
                typeParis === "COUPLE_GAGNANT" || 
                typeParis === "COUPLE_PLACE" || 
                typeParis === "COUPLE_ORDRE" || 
                typeParis === "TRIO_GAGNANT"
            ) {
                // checkbox pour choix multiple
                linkChoixChevalPari.innerHTML += `
                <div>
                <label for="${idChevalChoix}">${nomCheval}; cote = ${coteCheval}</label>
                <input type="checkbox" name="choix" value="${idCheval}" id="${idChevalChoix}">
                </div>`;
                setTimeout(() => {
                    const checkbox = document.getElementById(idChevalChoix);
                    checkbox.addEventListener("change", function () {
                        if (this.checked) {
                            if (!ordreSelection.includes(this.value)) {
                                ordreSelection.push(this.value);
                            }
                        } 
                        else {
                            ordreSelection = ordreSelection.filter(id => id !== this.value);
                        }
                        console.log("Ordre actuel :", ordreSelection);
                    });
                }, 0);
            }
            
        };
        console.log(listeCheval);
        let recupPari = document.getElementById("formParis")
        recupPari.addEventListener("submit", function (event) {
                event.preventDefault();
                console.log("test lancement");
                recuperationPari(event);
        });
        console.log(listeCheval);
    })
    .catch(err => console.log(err));
}


function recuperationPari(event) {
    event.preventDefault();

    let form = event.target;
    let mise = parseFloat(form.elements["mise"].value);
    let typePari = sessionStorage.getItem("Type de paris");
    let chevauxChoisis = Array.from(document.querySelectorAll("input[name='choix']:checked")).map(e => e.value);

    if (mise > argent || mise <= 0 || isNaN(mise)) {
        return afficherPopupErreur("Mise invalide.");
    }

    // Vérification du nombre de chevaux selon le type de pari
    if ((typePari === "SIMPLE" || typePari === "SIMPLE_PLACE") && chevauxChoisis.length !== 1) {
        return afficherPopupErreur("Veuillez sélectionner un seul cheval.");
    }

    if ((typePari === "COUPLE_GAGNANT" || typePari === "COUPLE_PLACE" || typePari === "COUPLE_ORDRE") && chevauxChoisis.length !== 2) {
        return afficherPopupErreur("Veuillez sélectionner deux chevaux.");
    }

    if (typePari === "TRIO_GAGNANT" && chevauxChoisis.length !== 3) {
        return afficherPopupErreur("Veuillez sélectionner trois chevaux.");
    }

    // Gestion de l'ordre pour le COUPLE_ORDRE
    if (typePari === "COUPLE_ORDRE") {
        if (ordreSelection.length !== 2) {
            return afficherPopupErreur("Veuillez sélectionner deux chevaux, dans l'ordre.");
        }
        chevauxChoisis = ordreSelection.slice(0, 2); 
    }


    fetch("http://localhost:8080/courses/hippiques/main/initPariAvecIdJoueur/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            idJoueur: id,
            mise: mise,
            typePari: typePari,
            idChevaux: chevauxChoisis
        })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Erreur serveur : " + res.status);
        }
        return res.text();
    })
    .then(data => {
        console.log("Pari sauvegardé !", data);
        window.location.href = "pageCourse.html";
    })
    .catch(err => console.error("Erreur connexion :", err.message));
}

/* function recuperationPari(event) {
    let choix = document.getElementsByName("choix");
    for (c of choix){
        if (c.checked){
            let form = event.target;

            let idChevaux = c.value;
            let mise = form.elements["mise"].value; 
            let pariSimple = "SIMPLE";
            console.log(id);

            if (mise<=argent){
                fetch("http://localhost:8080/courses/hippiques/main/initPariAvecIdJoueur/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "idJoueur":id, "mise":mise,"typePari":pariSimple, "idChevaux":[idChevaux] })
                })
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Erreur serveur : " + res.status);
                    }
                    return res.text();
                })
                .then(data => {
                    console.log("Pari sauvegardé !", data);
                    window.location.href = "pageCourse.html";

                })
                .catch(err => console.error("Erreur connexion :", err.message));
            }
        }
    }
} */

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

