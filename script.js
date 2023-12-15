document.addEventListener('DOMContentLoaded', function() {
const apiUrl = window.location.origin + window.location.pathname;


    var docsButton = document.getElementById('docsLink');
    if (docsButton) {
        docsButton.addEventListener('click', function() {
            // Obtient l'URL actuelle et ajoute '/docs' à la fin
            window.open(window.location.href + 'docs', '_blank');
        });
    }

// Fonction pour afficher les classes
function displayClasses() {
    fetch(apiUrl + 'classe')
        .then(response => response.json())
        .then(data => {
            let html = '<table>';
            html += '<tr><th>ID</th><th>Nom</th><th>Niveau</th></tr>';
            data.forEach(classe => {
                html += `<tr><td>${classe.id}</td><td>${classe.name}</td><td>${classe.level}</td><td><button class="edit-button edit-class-button" data-id="${classe.id}">Modifier</button>
                </td></tr>`;
            });
            html += '</table>';
            document.getElementById('result').innerHTML = html;

            // Attacher les événements après que les boutons soient ajoutés au DOM
            attachEditButtonEvents();
        })
        .catch(error => console.error('Erreur:', error));
}




function displayEditClassForm(classId) {
    // Afficher la pop-up de modification
    document.getElementById('editClassFormContainer').style.display = 'block';

    fetch(apiUrl + 'classe/' + classId)
        .then(response => response.json())
        .then(data => {
            document.getElementById('editClassId').value = data.id;
            document.getElementById('editClassName').value = data.name;
            document.getElementById('editClassLevel').value = data.level;

            // Ajouter un gestionnaire d'événements 'submit' pour le formulaire de modification
            const editClassForm = document.getElementById('editClassForm');
            editClassForm.onsubmit = function(event) {
                event.preventDefault();

                // Ici, ajoutez le code pour envoyer les données mises à jour à votre API
                const updatedClass = {
                    id: document.getElementById('editClassId').value,
                    name: document.getElementById('editClassName').value,
                    level: document.getElementById('editClassLevel').value
                };

                fetch(apiUrl + 'classe/' + updatedClass.id, {
                    method: 'PUT', // Assurez-vous que c'est la bonne méthode HTTP pour votre API
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(updatedClass)
                })
                .then(response => {
                    if (response.ok) {
                        alert('Classe modifiée avec succès');
                        closePopup(); // Fermez la pop-up après la mise à jour
                        displayClasses(); // Optionnellement, rafraîchissez la liste des classes
                    } else {
                        alert('Erreur lors de la modification de la classe');
                    }
                })
                .catch(error => console.error('Erreur:', error));
            };
        })
        .catch(error => console.error('Erreur:', error));
}




// Fonction pour afficher les étudiants
function displayStudents() {
    fetch(apiUrl + 'student')
        .then(response => response.json())
        .then(data => {
            let html = '<table>';
            html += '<tr><th>ID</th><th>Prénom</th><th>Nom</th><th>Email</th><th>Téléphone</th><th>Adresse</th><th>Code postal</th><th>Ville</th><th>Classe</th></tr>';
            data.forEach(student => {
                html += `
                    <tr>
                        <td>${student.id}</td>
                        <td>${student.firstname}</td>
                        <td>${student.lastname}</td>
                        <td>${student.email}</td>
                        <td>${student.phone}</td>
                        <td>${student.address}</td>
                        <td>${student.zip}</td>
                        <td>${student.city}</td>
                        <td>${student.class}</td>
                        <td><button class="edit-button edit-student-button" data-id="${student.id}">Modifier</button></td>
                    </tr>
                `;
            });
            html += '</table>';
            document.getElementById('result').innerHTML = html;

            // Attacher les événements après que les boutons soient ajoutés au DOM
            attachEditButtonEvents();
    })
    .catch(error => console.error('Erreur:', error));

}
function displayEditStudentForm(studentId) {
    // Afficher la pop-up de modification
    document.getElementById('editStudentFormContainer').style.display = 'block';
    fetchClassesForDropdown('editStudentClass');

    // Récupérer les données de l'étudiant et préremplir le formulaire
    fetch(apiUrl + 'student/' + studentId)
        .then(response => response.json())
        .then(data => {
            document.getElementById('editStudentId').value = data.id;
            document.getElementById('editStudentFirstname').value = data.firstname;
            document.getElementById('editStudentLastname').value = data.lastname;
            document.getElementById('editStudentEmail').value = data.email;
            document.getElementById('editStudentPhone').value = data.phone;
            document.getElementById('editStudentAddress').value = data.address;
            document.getElementById('editStudentZip').value = data.zip;
            document.getElementById('editStudentCity').value = data.city;
            document.getElementById('editStudentClass').value = data.class;

            // Gérer la soumission du formulaire de modification
            const editStudentForm = document.getElementById('editStudentForm');
            editStudentForm.onsubmit = function(event) {
                event.preventDefault();

                const updatedStudent = {
                    id: document.getElementById('editStudentId').value,
                    firstname: document.getElementById('editStudentFirstname').value,
                    lastname: document.getElementById('editStudentLastname').value,
                    email: document.getElementById('editStudentEmail').value,
                    phone: document.getElementById('editStudentPhone').value,
                    address: document.getElementById('editStudentAddress').value,
                    zip: document.getElementById('editStudentZip').value,
                    city: document.getElementById('editStudentCity').value,
                    class: document.getElementById('editStudentClass').value
                };

                fetch(apiUrl + 'student/' + updatedStudent.id, {
                    method: 'PUT', 
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(updatedStudent)
                })
                .then(response => {
                    if (response.ok) {
                        alert('Étudiant modifié avec succès');
                        closePopup();
                        displayStudents();
                    } else {
                        alert('Erreur lors de la modification de l\'étudiant');
                    }
                })
                .catch(error => console.error('Erreur:', error));
            };
        })
        .catch(error => console.error('Erreur:', error));
}


function attachEditButtonEvents() {
    // Pour les boutons de modification des classes
    const editClassButtons = document.querySelectorAll('.edit-class-button');
    editClassButtons.forEach(button => {
        button.addEventListener('click', function() {
            const classId = this.getAttribute('data-id');
            displayEditClassForm(classId);
        });
    });

    // Pour les boutons de modification des étudiants
    const editStudentButtons = document.querySelectorAll('.edit-student-button');
    editStudentButtons.forEach(button => {
        button.addEventListener('click', function() {
            const studentId = this.getAttribute('data-id');
            displayEditStudentForm(studentId);
        });
    });
}

function closePopup() {
    var classPopup = document.getElementById('editClassFormContainer');
    var studentPopup = document.getElementById('editStudentFormContainer');

    if (classPopup) {
        classPopup.style.display = 'none';
    }
    if (studentPopup) {
        studentPopup.style.display = 'none';
    }
}



var closeButtonClass = document.getElementById('closeButtonClass');
var closeButtonStudent = document.getElementById('closeButtonStudent');

if (closeButtonClass) {
    closeButtonClass.addEventListener('click', closePopup);
}

if (closeButtonStudent) {
    closeButtonStudent.addEventListener('click', closePopup);
}



   // Gestion de la création de classe
   const createClassForm = document.getElementById('createClassForm');
   if (createClassForm) {
       createClassForm.addEventListener('submit', function(event) {
           event.preventDefault();
            const className = document.getElementById('className').value;
            const classLevel = document.getElementById('classLevel').value;

            fetch(apiUrl + 'classe', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: className, level: classLevel})
            })
            .then(response => {
                if (response.status === 201) {
                    alert('Classe ajoutée avec succès');
                    // Optionnel : Rafraîchir la liste des classes ou rediriger
                } else {
                    alert('Erreur lors de l\'ajout de la classe');
                }
            })
            .catch(error => console.error('Erreur:', error));
        });
    }

function fetchClassesForDropdown(dropdownId) {
    fetch(apiUrl + 'classe')
        .then(response => response.json())
        .then(data => {
            const classDropdown = document.getElementById(dropdownId);

            // Efface toutes les options existantes de la liste déroulante
            classDropdown.innerHTML = '';

            // Ajoute chaque classe comme une option dans la liste déroulante
            data.forEach(classe => {
                const option = document.createElement('option');
                option.value = classe.id;
                option.textContent = `${classe.id} - ${classe.name}`;
                classDropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Erreur:', error));
}



    // Gestion de la création d'étudiant
    const createStudentForm = document.getElementById('createStudentForm');




    if (createStudentForm) {
        fetchClassesForDropdown('studentClass');
        
        createStudentForm.addEventListener('submit', function(event) {
            event.preventDefault();
        const studentData = {
            firstname: document.getElementById('studentFirstname').value,
            lastname: document.getElementById('studentLastname').value,
            email: document.getElementById('studentEmail').value,
            phone: document.getElementById('studentPhone').value,
            address: document.getElementById('studentAddress').value,
            zip: document.getElementById('studentZip').value,
            city: document.getElementById('studentCity').value,
            class: document.getElementById('studentClass').value
        };

        fetch(apiUrl + 'student', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(studentData)
        })
        .then(response => {
            if (response.status === 201) {
                alert('Étudiant créé avec succès');
                // Optionnel : Rafraîchir la liste des étudiants ou rediriger
            } else {
                alert('Erreur lors de la création de l\'étudiant');
            }
        })
        .catch(error => console.error('Erreur:', error));
    });
}

function searchClassById() {
    const classId = document.getElementById('classSearch').value;
    if (classId) {
        fetch(apiUrl + 'classe/' + classId)
            .then(response => response.json())
            .then(data => {
                const resultPre = document.getElementById('result');
                resultPre.innerHTML = ''; // Efface le contenu précédent

                // Construit la chaîne de tableau HTML pour la classe trouvée
                const tableHtml = `
                    <table>
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Niveau</th>
                        </tr>
                        <tr>
                            <td>${data.id}</td>
                            <td>${data.name}</td>
                            <td>${data.level}</td>
                            <td><button class="edit-button edit-class-button" data-id="${classe.id}">Modifier</button></td>
                        </tr>
                    </table>
                `;

                // Injecte la chaîne de tableau HTML dans la balise <pre id="result"></pre>
                resultPre.innerHTML = tableHtml;
            })
            .catch(error => console.error('Erreur:', error));
    }
}

function searchStudentById() {
    const studentId = document.getElementById('studentSearch').value;
    if (studentId) {
        fetch(apiUrl + 'student/' + studentId)
            .then(response => response.json())
            .then(data => {
                const resultPre = document.getElementById('result');
                resultPre.innerHTML = ''; // Efface le contenu précédent

                // Construit la chaîne de tableau HTML pour l'étudiant trouvé
                const tableHtml = `
                    <table>
                        <tr>
                            <th>ID</th>
                            <th>Prénom</th>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Téléphone</th>
                            <th>Adresse</th>
                            <th>Code postal</th>
                            <th>Ville</th>
                            <th>Classe</th>
                        </tr>
                        <tr>
                            <td>${data.id}</td>
                            <td>${data.firstname}</td>
                            <td>${data.lastname}</td>
                            <td>${data.email}</td>
                            <td>${data.phone}</td>
                            <td>${data.address}</td>
                            <td>${data.zip}</td>
                            <td>${data.city}</td>
                            <td>${data.class}</td>
                            <td><button class="edit-button edit-student-button" data-id="${student.id}">Modifier</button></td>
                        </tr>
                    </table>
                `;

                // Injecte la chaîne de tableau HTML dans la balise <pre id="result"></pre>
                resultPre.innerHTML = tableHtml;
            })
            .catch(error => console.error('Erreur:', error));
    }
}





    // Écouteurs d'événements pour les boutons
    document.getElementById('fetchClasses').addEventListener('click', displayClasses);
    document.getElementById('fetchStudents').addEventListener('click', displayStudents);
    document.getElementById('searchClass').addEventListener('click', searchClassById);
    document.getElementById('searchStudent').addEventListener('click', searchStudentById);
    
    


    // Affichage initial des classes
    displayClasses();
});
