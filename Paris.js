let linkChoixChevalPari = document.getElementById("choixChevalParis");
let argent
let id = sessionStorage.getItem("id");
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

    fetch("http://localhost:8080/courses/hippiques/course/recuperer1Course",{
    method:"POST",
    headers:{"Content-Type":"application/json"
    },
    body: JSON.stringify(idCourse)
    })
    .then(res => res.json())
    .then(data => {
        let listeCheval = data["listeCheval"];
        let nbParticipants = data["nbParticipants"];
        for (let i=0;i<nbParticipants;i++){
            let idChevalChoix = "cheval"+i;
            let idCheval = listeCheval[i]["idCheval"];
            let coteCheval = listeCheval[i]["cote"].toFixed(2);
            let nomCheval = listeCheval[i]["nom"];
            linkChoixChevalPari.innerHTML += "<div><label for=\""+idChevalChoix+"\">"+nomCheval+"; cote = "+coteCheval +"</label>"+
                    "<input type=\"radio\" name=\"choix\"  value=\""+idCheval+"\" id=\""+idChevalChoix+"\"></div>"
        };

        let recupPari = document.getElementById("formParis")
        recupPari.addEventListener("submit", function (event) {
                event.preventDefault();
                console.log("test lancement");
                recuperationPari(event);
        });
    })
    .catch(err => console.log(err));
}

function recuperationPari(event) {
    let choix = document.getElementsByName("choix");
    for (c of choix){
        if (c.checked){
            let form = event.target;

            let idChevaux = c.value;
            let mise = form.elements["mise"].value; 

            if (mise<=argent){
                fetch("http://localhost:8080/courses/hippiques/main/initPariAvecIdJoueur/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ "idJoueur":id, "mise":mise, "idChevaux":[idChevaux] })
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
        return res.text();
    }
}

main();

