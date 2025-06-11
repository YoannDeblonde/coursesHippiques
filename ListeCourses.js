function main() {
     console.log("truc");
  afficherCourses();
  console.log("main appelé");
}

function afficherCourses() {
  fetch("http://localhost:8080/courses/hippiques/course/creerListeCourses")
    .then(res => res.json())
    .then(data => {
      console.log(data);

      for (let i = 0; i < 3; i++) {
        const course = data[i];
        const infosDiv = document.getElementById(`infosCourse${i + 1}`);
        infosDiv.innerHTML = ""; 

  const header = document.createElement("div");
header.className = "course-header";
header.innerHTML = `
  <h3>Course n° ${i + 1}</h3>
  <p><strong>Terrain :</strong> ${course.terrain.nomTerrain}</p>
  <p><strong>Type de terrain :</strong> ${course.terrain.typeDeTerrain}</p>
  <p><strong>Météo :</strong> ${course.terrain.meteoEvenement}</p>
  <p><strong>Type de course :</strong> ${course.typeDeCourse}</p>
  <p><strong>Nombre de tours :</strong> ${course.nbTours}</p>
  <p><strong>Nombre de participants :</strong> ${course.nbParticipants}</p>
`;
infosDiv.appendChild(header);

        // Liste des chevaux
course.listeCheval.forEach(cheval => {
  const chevalDiv = document.createElement("div");
  chevalDiv.className = "cheval-card";
  chevalDiv.innerHTML = `
    <p>🐎 <strong>${cheval.nom}</strong> <em>(${cheval.race})</em></p>
    <p>Courses gagnées : <strong>${cheval.nbCourseGagnees}</strong> | Cote : <strong>${cheval.cote}</strong></p>
  `;
  infosDiv.appendChild(chevalDiv);
});
      }
    })
    .catch(err => console.error("Erreur connexion :", err.message));
}

document.addEventListener("DOMContentLoaded", main);





/* fetch("http://localhost:8080/courses/hippiques/course/creerListeCourses") 
  .then(response => response.json())
  .then(courses => {
    afficherCourses(courses);
  })
  .catch(err => console.error('Erreur fetch:', err));

function afficherCourses(courses) {
  courses.forEach((course, index) => {
    const ol = document.getElementById(`infosCourse${index + 1}`);
    if (!ol) return;
    ol.innerHTML = '';

    const infos = [
      `Nom de la course : ${course.nomCourse}`,
      `Type de course : ${course.typeDeCourse}`,
      `Nombre de tours : ${course.nbTours}`,
      `Nombre de participants : ${course.nbParticipants}`
    ];

    infos.forEach(info => {
      const li = document.createElement('li');
      li.textContent = info;
      ol.appendChild(li);
    });

    const liChevaux = document.createElement('li');
    liChevaux.textContent = 'Liste des chevaux :';

    const ulChevaux = document.createElement('ul');

    course.listeCheval.forEach(cheval => {
      const liCheval = document.createElement('li');
      liCheval.innerHTML = `
        Nom : ${cheval.nom}, 
        Race : ${cheval.race}, 
        Nbr courses gagnées : ${cheval.nbCourseGagnees}, 
        Cote : ${cheval.cote}
      `;
      ulChevaux.appendChild(liCheval);
    });

    liChevaux.appendChild(ulChevaux);
    ol.appendChild(liChevaux);
  });
} */
