
let idCourse = 5;
//let idJoueur = sessionStorage.getItem("id");
let idJoueur = 1;
let joueur;
let pari;
let podium;

let linkContenuFinCourse = document.getElementById("contenuFinCourse");

let linkBoutonCourse = document.getElementById("lancementCourse");
let linkAffichageCourse = document.getElementById("affichageCourse");
let linkLigneArrivee = document.getElementById("ligneArrivee");
let linkAffichageClassement = document.getElementById("affichageClassement");
let linkTitre = document.getElementById("titre");
let linkResultatCourse = document.getElementById("resultatCourse");

let linkMeteo = document.getElementById("meteo");
let linkNbTour = document.getElementById("nbTour");
let linkLongueur = document.getElementById("longueur");

let linkChevalVmax = document.getElementById("chevalVmax");
let linkNomChevalVmax = document.getElementById("nomChevalVmax");

let linkChevalVictoire = document.getElementById("chevalVictoire");
let linkNomChevalVictoire = document.getElementById("nomChevalVictoire");

let linkChevalAcceleration = document.getElementById("chevalAcceleration");
let linkNomChevalAcceleration= document.getElementById("nomChevalAcceleration");

let linkTypeDeTerrain = document.getElementById("typeDeTerrain");

fetch("http://localhost:8080/courses/hippiques/course/testCourse",{
    method:"POST",
    headers:{"Content-Type":"application/json"
    },
    body: JSON.stringify(idCourse)
})
    .then(res => res.json())
    .then(data => {recupererDonneesChevaux(data)})
    .catch(err => console.log(err));

fetch("http://localhost:8080/courses/hippiques/joueur/affichageprofil2",{
    method:"POST",
    headers:{"Content-Type":"application/json"
    },
    body: JSON.stringify(idJoueur)
})
    .then(res => res.json())
    .then(data => {recupererJoueur(data)})
    .catch(err => console.log(err));

fetch("http://localhost:8080/courses/hippiques/course/podium",{
    method:"POST",
    headers:{"Content-Type":"application/json"
    },
    body: JSON.stringify(idCourse)
})
    .then(res => res.json())
    .then(data => {recupererPodium(data)})
    .catch(err => console.log(err));

function recupererJoueur(data){
    joueur = data;
    pari = data["pari"];
}
function recupererPodium(data){
    podium = data;
}

let nbChevauxFinis = 0;
let nbParticipants;
let typeSol;
let typeDeTerrain;
let nbTours;
let longueur;
let meteoEvenment;
let dataStock;
let finCourse = false;

function recupererDonneesChevaux(data){
    dataStock = data;
    linkTitre.innerHTML = data["nomCourse"];
    linkMeteo.innerHTML = data["terrain"]["meteoEvenement"];
    linkNbTour.innerHTML = data["nbTours"];
    linkLongueur.innerHTML = data["terrain"]["longueur"];
    linkTypeDeTerrain.innerHTML = data["terrain"]["typeDeTerrain"]

    nbParticipants = data["nbParticipants"];
    nbTours = data["nbTours"];
    typeDeTerrain = data["terrain"]["typeDeTerrain"];
    longueur = data["terrain"]["longueur"];
    linkLigneArrivee.style.marginLeft = 90  + "%";
    linkLigneArrivee.style.height = nbParticipants*5 + "em";
 
    if (typeDeTerrain == null){
        typeDeTerrain = "HERBE";
    }
    for (let i = 0; i < nbParticipants; i++){
        let cheval = "Cheval"+i;
        let imageCheval = "Cheval"+ (i %7);
        linkAffichageCourse.innerHTML = linkAffichageCourse.innerHTML + 
                "<div class=\"" +typeDeTerrain + "\">" +
                "<img src=\"Image-Cheval/"+
                imageCheval +".png\"" +
                 "id=\"" + cheval +
                "\">" + "<span style = \"position: relative;background-color:rgb(255, 255, 255);"+
                    "bottom: 5em; overflow: visible;"+
                    "left: -6em; font-size: 0.9em; font-weight: bold;"+
                    "color: black\" >" + data["listeCheval"][i]["nom"] + "</span>"
                 +"</img>"+
                "</div>" ;
    }
    course(data,true);


}

function course(data,initialisation){
    for (let i = 0; i < nbParticipants; i++){
        let tempsRealise = data["listeCheval"][i]["tempsRealise"];
        let dernierTemps = data["listeCheval"][i]["dernierTemps"];
        let nom = data["listeCheval"][i]["nom"] ;
        let cheval = "Cheval"+i;

        if (data["listeCheval"][i]["vitesseMax"] > linkChevalVmax.innerHTML ){
            linkNomChevalVmax.innerHTML = nom;
            linkChevalVmax.innerHTML = data["listeCheval"][i]["vitesseMax"];
        }

        if (data["listeCheval"][i]["acceleration"] > linkChevalAcceleration.innerHTML ){
            linkNomChevalAcceleration.innerHTML = nom;
            linkChevalAcceleration.innerHTML = data["listeCheval"][i]["acceleration"].toFixed(2);
        }

        if (data["listeCheval"][i]["nbCourseGagnees"] > linkChevalVictoire.innerHTML ){
            linkNomChevalVictoire.innerHTML = nom;
            linkChevalVictoire.innerHTML = data["listeCheval"][i]["nbCourseGagnees"];
        }

        if (initialisation){
            majCheval(document.getElementById(cheval),tempsRealise,0);
        }
        else {
            for (let j = 0; j < tempsRealise.length; j++){
                majCheval(document.getElementById(cheval),tempsRealise,j);
            }
            setTimeout(function(){
                nbChevauxFinis++;
                linkAffichageClassement.innerHTML += nom + " : " + dernierTemps.toFixed(2) +" sec" + "<br>" ;
                if (!finCourse){
                    linkResultatCourse.style.display = "";
                    linkResultatCourse.innerHTML = "Le cheval gagnant est " + nom ;
                    finCourse = true;
                };
                if (nbChevauxFinis == nbParticipants){
                    finDeLaCourse();
                }
            },dernierTemps*1000/24);

            
        }
        }
}

function finDeLaCourse(){
    joueur["nbPartiesJouees"]+=1;
    linkContenuFinCourse.innerHTML=linkAffichageClassement.innerHTML;

    let idChevalPari = pari["chevalChoisi"][0]["idCheval"];
    //Pari bon
    if (podium[0]["idCheval"] === idChevalPari){
        linkContenuFinCourse.innerHTML += "\n Bravo vous avez remporté votre pari";
        joueur["argent"] += pari["mise"]*podium[0]["cote"];
        joueur["nbPartiesGagnees"] += 1;
        joueur["gainsGeneres"] = pari["mise"]*podium[0]["cote"]; 
    }
    //Pari mauvais
    else {
        linkContenuFinCourse.innerHTML += "\n Perdu ! Vous pouvez toujours recommencer... (Tous les gagnants ont déjà joués)";
    }
    majJoueur(joueur);
    document.getElementById("popupFinCourse").style.display = "block";


    document.getElementById("fermerFinCourse").addEventListener("click", function() {
        document.getElementById("popupFinCourse").style.display = "none";
    });
}

function majJoueur(joueur){
    fetch("http://localhost:8080/courses/hippiques/joueur/saveJoueur",{
    method:"POST",
    headers:{"Content-Type":"application/json"
    },
    body: JSON.stringify(joueur)
})
    .then(res => res.json())
    .then(data => {data})
    .catch(err => console.log(err));
}

function majCheval(lienCheval, distanceParcourue,i)
{
    setTimeout(function(){
        //if (i % 4 == 0){
        //    lienCheval.src="Image-Cheval/chevalA1.jpg";
        //};
        //if (i % 4 == 1){
        //    lienCheval.src="Image-Cheval/chevalA2.jpg";
        //};
        //if (i % 4 == 2){
        //    lienCheval.src="Image-Cheval/chevalA3.jpg";
        //};
        //if (i % 4 == 3){
        //    lienCheval.src="Image-Cheval/chevalA4.jpg";
        //};
        lienCheval.style.paddingLeft = distanceParcourue[i]/(nbTours * longueur) * 90 + "%";  
    },i*1000/24)
}

linkBoutonCourse.addEventListener("click",function(){
    linkAffichageClassement.innerHTML = "<h4>Classement</h4>";
    course(dataStock,false);
});
//,{once: true,}
