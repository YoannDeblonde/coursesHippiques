let idCourse = sessionStorage.getItem("idCourse");
let idJoueur = sessionStorage.getItem("id");
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

let linkChevalAcceleration = document.getElementById("chevalAcceleration");
let linkNomChevalAcceleration= document.getElementById("nomChevalAcceleration");

let linkTypeDeTerrain = document.getElementById("typeDeTerrain");

async function lancerFetchsEnOrdre(idCourse, idJoueur) {
  try {
    // 1. Premier fetch : Course Test
    const resCourse = await fetch("http://localhost:8080/courses/hippiques/course/testCourse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(idCourse)
    });
    const dataCourse = await resCourse.json();
    recupererDonneesChevaux(dataCourse);

    // 2. Deuxième fetch : Profil Joueur
    const resJoueur = await fetch("http://localhost:8080/courses/hippiques/joueur/affichageprofil2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(idJoueur)
    });
    const dataJoueur = await resJoueur.json();
    recupererJoueur(dataJoueur);

    // 3. Troisième fetch : Podium
    const resPodium = await fetch("http://localhost:8080/courses/hippiques/course/podium", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(idCourse)
    });
    const dataPodium = await resPodium.json();
    recupererPodium(dataPodium);

  } catch (err) {
    console.error("Erreur lors des fetchs :", err);
  }
}
function recupererJoueur(data){
    joueur = data;
    pari = data["pari"];
}
function recupererPodium(data){
    podium = data;
}

lancerFetchsEnOrdre(idCourse, idJoueur);

let nbChevauxFinis = 0;
let nbParticipants;
let typeSol;
let typeDeTerrain;
let nbTours;
let longueur;
let meteoEvenment;
let dataStock;

function recupererDonneesChevaux(data){
    dataStock = data;
    console.log(data["listeCheval"]);
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
    linkAffichageClassement.innerHTML = "";
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

        if (initialisation){
            majCheval(document.getElementById(cheval),tempsRealise,0);
        }
        else {
            for (let j = 0; j < tempsRealise.length; j++){
                majCheval(document.getElementById(cheval),tempsRealise,j);
            }
            setTimeout(function(){
                nbChevauxFinis++;
                linkAffichageClassement.innerHTML += "<li> <span>"+nom + " : </span>" + dernierTemps.toFixed(2) +" sec" + "</li>" ;
                if (nbChevauxFinis == nbParticipants){
                    finDeLaCourse();
                }
            },dernierTemps*1000/24);

            
        }
        }
}

function finDeLaCourse(){
    joueur["nbPartiesJouees"] += 1;
    linkContenuFinCourse.innerHTML = linkAffichageClassement.innerHTML;

    const typePari = pari["typePari"];
    const chevauxChoisis = pari["chevalChoisi"].map(c => c["idCheval"]);
    const mise = pari["mise"];
    let pariGagne = false;
    let gains = 0;

    switch(typePari) {
        case "SIMPLE":
            if (podium[0]["idCheval"] === chevauxChoisis[0]) {
                gains = mise * podium[0]["cote"];
                pariGagne = true;
            }
            break;

        case "SIMPLE_PLACE":
            if (podium.slice(0, 3).some(p => p["idCheval"] === chevauxChoisis[0])) {
                gains = mise * (podium[0]["cote"] / 2); 
                pariGagne = true;
            }
            break;

        case "COUPLE_GAGNANT":
            if (chevauxChoisis.length === 2) {
                const premierDeux = [podium[0]["idCheval"], podium[1]["idCheval"]];
                if (chevauxChoisis.every(id => premierDeux.includes(id))) {
                    gains = mise * (podium[0]["cote"] * podium[1]["cote"]); 
                    pariGagne = true;
                }
            }
            break;

        case "COUPLE_PLACE":
            if (chevauxChoisis.length === 2) {
                const premiersTrois = [podium[0]["idCheval"], podium[1]["idCheval"], podium[2]["idCheval"]];
                if (chevauxChoisis.every(id => premiersTrois.includes(id))) {
                    gains = mise * (podium[0]["cote"] * podium[1]["cote"] / 2); 
                    pariGagne = true;
                }
            }
            break;

        case "COUPLE_ORDRE":
            if (chevauxChoisis.length === 2) {
                if (podium[0]["idCheval"] === chevauxChoisis[0] && podium[1]["idCheval"] === chevauxChoisis[1]) {
                    gains = mise * (podium[0]["cote"] * podium[1]["cote"] * 1.5); 
                    pariGagne = true;
                }
            }
            break;

        case "TRIO_GAGNANT":
            if (chevauxChoisis.length === 3) {
                const premiersTrois = [podium[0]["idCheval"], podium[1]["idCheval"], podium[2]["idCheval"]];
                if (chevauxChoisis.every(id => premiersTrois.includes(id))) {
                    gains = mise * (podium[0]["cote"] * podium[1]["cote"] * podium[2]["cote"]); 
                    pariGagne = true;
                }
            }
            break;

        default:
            linkContenuFinCourse.innerHTML += "\n Type de pari inconnu.";
            break;
    }

    if (pariGagne) {
        joueur["argent"] += gains;
        joueur["nbPartiesGagnees"] += 1;
        joueur["gainsGeneres"] += gains - mise;

        linkContenuFinCourse.innerHTML += "\n Bravo vous avez remporté votre pari ! <br>Votre cagnote s'élève maintenant à " + joueur["argent"].toFixed(2) + " euros/jetons/cequetuveux";
    } else if (typePari !== undefined) {
        linkContenuFinCourse.innerHTML += "\n Perdu ! Vous pouvez toujours recommencer... (Tous les perdants s'arrêtent avant de gagner)";
    }

    majJoueur(joueur);
    document.getElementById("popupFinCourse").style.display = "block";
    document.getElementById("retour").style.display = "block";

    document.getElementById("fermerFinCourse").addEventListener("click", function() {
        document.getElementById("popupFinCourse").style.display = "none";
    });
}


/* function finDeLaCourse(){
    joueur["nbPartiesJouees"]+=1;
    linkContenuFinCourse.innerHTML="<div>Classement</div>" + linkAffichageClassement.innerHTML;


    let idChevalPari = pari["chevalChoisi"][0]["idCheval"];
    //Pari bon
    if (podium[0]["idCheval"] === idChevalPari){
        joueur["argent"] += pari["mise"]*podium[0]["cote"];
        joueur["nbPartiesGagnees"] += 1;
        joueur["gainsGeneres"] += pari["mise"]*(podium[0]["cote"]-1); 

        linkContenuFinCourse.innerHTML += "\n Bravo vous avez remporté votre pari ! <br>Votre cagnote s'eleve maintenant à " +  joueur["argent"].toFixed(2) +" euros/jetons/cequetuveux";
    }
    //Pari mauvais
    else {
        linkContenuFinCourse.innerHTML += "\n Perdu ! Vous pouvez toujours recommencer... (Tous les perdants s'arretent avant de gagner)";
    }
    majJoueur(joueur);
    document.getElementById("popupFinCourse").style.display = "block";
    document.getElementById("retour").style.display = "block";


    document.getElementById("fermerFinCourse").addEventListener("click", function() {
        document.getElementById("popupFinCourse").style.display = "none";
    });
} */

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
    course(dataStock,false);
});