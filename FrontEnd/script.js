const gallery = document.querySelector('.gallery');
const categoriesContainer = document.querySelector('.categories');
const login = document.querySelector('#loginProfile');
const modal1 = document.querySelector('.modal-1');
const galleryModal = document.querySelector('.galleryModal');
const iconClose = document.querySelector('.modal-icon');
const overlay = document.querySelector('.overlay');
const btnTrigger = document.querySelector('.modal-trigger'); //Bouton ajouter une image
const fileInput = document.querySelector('#fileInput'); // Input pour ajouter une image
const buttonFile = document.querySelector('.button-file'); // Bouton pour ajouter une image
const iconeImage = document.querySelector('.fa-image')
const scrollCategories = document.querySelector('#categorieDrop');




const BASE_URL = 'http://localhost:5678';

let worksFetched = [];
let categoriesFetched = [];


export const fetchWorks = async () => {
    try {
        let response = await fetch(`${BASE_URL}/api/works`);
        // Gérer les erreurs API
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let works = await response.json();
        //Vérifier si le tableau est vide au départ
        worksFetched.length = 0;
        worksFetched = works;
        console.log("Ensemble des works", worksFetched);
        for (let work of worksFetched) {
            const figure = createFigure(work);
            gallery.appendChild(figure);
        }
    } catch (error) {
        console.error('Error fetching works:', error);
    }
}

fetchWorks();

const createFigure = (work) => {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;
    figure.appendChild(img);
    const figcaption = document.createElement('figcaption');
    figcaption.textContent = work.title;
    figure.appendChild(figcaption);
    return figure;
}

// Fonction pour récupérer les catégories
export const fetchCategories = async () => {
    try {
        let response = await fetch(`${BASE_URL}/api/categories`);
        // Gérer les erreurs API
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let categories = await response.json();
        categories.unshift({ id: 0, name: 'Tous' }); // Ajouter la catégorie "Tous" au début du tableau
        //Vérifier si le tableau est vide au départ
        categoriesFetched.length = 0;
        console.log("Ensemble des catégories", categories);
        categoriesFetched = categories;
        createCategoryButtons(); // Appeler la fonction pour créer les boutons de catégorie
        categoriesDrop(); // Appeler la fonction pour créer les options de catégorie dans le select
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}
fetchCategories();

// Fonction pour créer les boutons de catégorie
export const createCategoryButtons = () => {
    categoriesContainer.innerHTML = ''; // Vider les catégories existantes
    for (let category of categoriesFetched) {
        const button = document.createElement('button');
        button.textContent = category.name;
        button.setAttribute('data-category-id', category.id); // Ajouter l'ID de la catégorie comme attribut de données
        button.classList.add('category-button');
        categoriesContainer.appendChild(button);
    }
}



categoriesContainer.addEventListener('click', (event) => {
    // Au clic sur un bouton on l'active avec le style "active"
    const clickedButton = event.target.closest('.category-button');
    if (!clickedButton) return; // Si le clic n'est pas sur un bouton, on sort de la fonction
    const allButtons = document.querySelectorAll('.category-button');
    allButtons.forEach(button => {
        button.classList.remove('active-filter');
    });
    event.target.classList.add('active-filter'); // Ajouter la classe active au bouton cliqué
    // Filtrer les oeuvres en fonction de la catégorie sélectionnée
    const selectedCategoryId = parseInt(event.target.getAttribute('data-category-id'), 10);
    gallery.innerHTML = ''; // Vider la galerie existante
    let filteredWorks = worksFetched; // Par défaut, tous les oeuvres

    if (selectedCategoryId !== 0) { // Si la catégorie n'est pas "Tous"
        filteredWorks = worksFetched.filter(work => work.categoryId === selectedCategoryId);
    }

    console.log("Filtered works:", filteredWorks);

    for (let work of filteredWorks) {
        const figure = createFigure(work);
        gallery.appendChild(figure);
    }
});

const token = localStorage.getItem("token");
if (token) {
    const editBanner = document.querySelectorAll('.hide');
    editBanner.forEach(a => {
        a.style.display = 'flex'; // Afficher les éléments avec la classe "edit"
    });

    login.textContent = "logout";

}

if (login.textContent === "logout") {
    login.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        window.location.href = "index.html";
    });
}

// Method pour créer photo avec une icône de suppression

const createPhotoWithDeleteIcon = (work) => {
    const figure = document.createElement('figure');
    figure.setAttribute('data-work-id', work.id); // Ajouter l'ID de l'oeuvre comme attribut de données
    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;
    const deleteIcon = document.createElement('div');
    deleteIcon.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteIcon.classList.add('delete-icon');
    deleteIcon.style.cursor = 'pointer'; // Changer le curseur pour indiquer que c'est cliquable
    figure.appendChild(img);
    figure.appendChild(deleteIcon);
    return figure;
}

//Récupère et affiche les travaux dans une modal depuis l'API
const getWorksModal = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/works`);
        const works = await response.json();
        //on vérifie que le tableau est vide d'abord
        worksFetched.length = 0;
        worksFetched = works;
        console.log("L'ensemble des works est :", works);
        for (let work of works) {
            const figure = createPhotoWithDeleteIcon(work);
            galleryModal.appendChild(figure);
        }
    } catch (error) {
        console.error('Erreur dans la récupération de works', error);
    }
};
getWorksModal();

// Modale 1 apparition 

btnTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    modal1.style.display = 'block'; // Afficher la modale 1
    overlay.style.display = 'block'; // Afficher l'overlay



    window.addEventListener('click', (event) => {
        if (event.target === overlay) {
            modal1.style.display = 'none'; // Fermer la modale 1 si on clique en dehors
            overlay.style.display = 'none'; // Fermer l'overlay
        }
    }
    );
});


iconClose.addEventListener('click', () => {
    modal1.style.display = 'none'; // Fermer la modale 1
    modal2.style.display = 'none'; // Fermer la modale 2 si elle est ouverte
    overlay.style.display = 'none'; // Fermer l'overlay

});


// Delete work from modal
galleryModal.addEventListener('click', async (event) => {
    event.preventDefault(); // Empêcher le comportement par défaut du clic
    const clickedDelete = event.target.closest('.delete-icon');
    if (!clickedDelete) return; // Si le clic n'est pas sur une icône de suppression, on sort de la fonction
    const resultSuppress = confirm('Voulez-vous vraiment supprimer cette oeuvre ?');
    if (!resultSuppress) {
        return; // Si l'utilisateur annule, on sort de la fonction
    }

    const workId = clickedDelete.parentElement.getAttribute('data-work-id'); // Récupérer l'ID de l'oeuvre
    console.log("ID de l'oeuvre à supprimer :", workId);

    try {
        const response = await fetch(`${BASE_URL}/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Supprimer l'élément de la galerie
        clickedDelete.parentElement.remove();
        alert('L\'oeuvre a été supprimée avec succès.'); // Afficher un message de succès
        console.log(`Oeuvre avec ID ${workId} supprimée avec succès.`);
        gallery.innerHTML = ''; // Vider la galerie modale pour mettre à jour les travaux
        await fetchWorks();
        modal1.style.display = 'none'; // Fermer la modale 1
        overlay.style.display = 'none'; // Fermer l'overlay
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'oeuvre:', error);
    }
});


// Modale 2 apparition
const modal2 = document.querySelector('.modal-2');
const btnTrigger2 = document.querySelector('.modal-button-add'); //Bouton modifier

btnTrigger2.addEventListener('click', (e) => {
    e.preventDefault();
    modal2.style.display = 'block'; // Afficher la modale 2
    modal1.style.display = 'none'; // Fermer la modale 1

    const modalArrow = document.querySelector('.modal-arrow');
    modalArrow.addEventListener('click', () => {
        modal2.style.display = 'none'; // Fermer la modale 2
        modal1.style.display = 'block'; // Réafficher la modale 1
    });




    window.addEventListener('click', (event) => {
        if (event.target === overlay) {
            modal2.style.display = 'none'; // Fermer la modale 1 si on clique en dehors
            overlay.style.display = 'none'; // Fermer l'overlay
        }
    }
    );
});

document.querySelector('.button-file button').addEventListener('click', (event) => {
    event.preventDefault(); // Empêcher le comportement par défaut du bouton
    fileInput.click(); // Simuler un clic sur l'input file pour ouvrir le sélecteur de fichiers
});

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const ALLOWED_EXTENSIONS = ['png', 'jpg']// Extensions autorisées
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();

    if (file && ALLOWED_EXTENSIONS.includes(fileExtension) && file.size <= 4 * 1024 * 1024) { // Vérifier la taille du fichier (max 4 Mo)
        // Si le fichier est valide, on affiche l'aperçu de l'image dans la modale
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.querySelector('#preview');
            img.src = e.target.result; // Afficher l'image sélectionnée dans la modale
            img.style.display = 'block'; // Afficher l'aperçu de l'image
            document.querySelector('.button-file button').style.display = 'none'; // Cacher le bouton "Ajouter une image"
            document.querySelector('.button-file i').style.display = 'none'; // Cacher l'icône d'image
            document.querySelector('.button-file p').style.display = 'none'; // Afficher le conteneur du bouton
        };
        reader.readAsDataURL(file);
    } else {
        console.error('Fichier invalide. Veuillez sélectionner une image au format PNG ou JPG et de taille inférieure à 4 Mo.');
        alert('Fichier invalide. Veuillez sélectionner une image au format PNG ou JPG et de taille inférieure à 4 Mo.');
        fileInput.value = ''; // Réinitialiser l'input file
    }
});

export const categoriesDrop = () => {
    categoriesContainer.innerHTML = ''; // Vider les catégories existantes
    // Option vide par défaut
        const defaultOption = document.createElement('option');
        scrollCategories.appendChild(defaultOption);
    for (let category of categoriesFetched) {
        
        const option = document.createElement('option');
        if (category.id === 0) continue; // On ajoute pas l'option "Tous" dans le select
        option.textContent = category.name;
        option.value = category.id; // Utiliser l'ID de la catégorie comme valeur
        option.classList.add('category-option');
        scrollCategories.appendChild(option);
    }
}

const galleryForm = document.querySelector('#modalForm');
galleryForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêcher le comportement par défaut du formulaire
    const formData = new FormData(); // FormData pour envoyer les données du formulaire
    const titleInput = document.querySelector('#title');
    const validationElement = document.querySelector('#input-color-validation');



    const title = titleInput.value.trim();
    const categoryId = parseInt(scrollCategories.value, 10);
    const file = fileInput.files[0];

    if (!title || !file || isNaN(categoryId)) {
        validationElement.classList.remove('valid-input');
        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Veuillez remplir tous les champs du formulaire.';
        galleryForm.appendChild(errorMessage);
        setTimeout(() => errorMessage.remove(), 3000); // Supprimer après 3 secondes
        return;
    }

    validationElement.classList.add('valid-input');

    // Ajouter les données du formulaire à FormData
    formData.append('image', file);
    formData.append('title', title);
    formData.append('category', categoryId.toString());


    try {
        const response = await fetch(`${BASE_URL}/api/works/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const newWork = await response.json();
        console.log("Nouvelle oeuvre ajoutée :", newWork);

        // Réinitialiser le formulaire et l'aperçu de l'image
        galleryForm.reset();
        fileInput.value = ''; // Réinitialiser l'input file
        document.querySelector('#preview').style.display = 'none'; // Cacher l'aperçu de l'image
        document.querySelector('.button-file button').style.display = 'block'; // Afficher le bouton "Ajouter une image"
        document.querySelector('.button-file i').style.display = 'block'; // Afficher l'icône d'image
        document.querySelector('.button-file p').style.display = 'block'; // Afficher le conteneur du bouton

        // Mettre à jour la galerie avec la nouvelle oeuvre
        const figure = createFigure(newWork);
        gallery.appendChild(figure);
        galleryModal.innerHTML = ''; // Vider la galerie modale pour mettre à jour les travaux
        await getWorksModal(); // Récupérer les travaux mis à jour dans la modale

        modal2.style.display = 'none'; // Fermer la modale 2
        overlay.style.display = 'none'; // Fermer l'overlay

    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'oeuvre:', error);
        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Une erreur est survenue lors de l\'ajout de l\'œuvre. Veuillez réessayer.';
        galleryForm.appendChild(errorMessage);
        setTimeout(() => errorMessage.remove(), 3000); // Supprimer après 3 secondes
        return;
    }
});




// // Fonction de validation en temps réel
// function validateForm() {
//     const title = titleInput.value.trim();
//     const file = fileInput.files[0];
//     const categoryId = parseInt(scrollCategories.value, 10);

//     const isValid = title && file && !isNaN(categoryId);

//     inputValidation.disabled = !isValid;

//     if (isValid) {
//         inputValidation.classList.remove('disabled');
//     } else {
//         inputValidation.classList.add('disabled');
//     }
// }

// // Écouteurs pour surveiller tous les champs
// titleInput.addEventListener('input', validateForm);
// fileInput.addEventListener('change', validateForm);
// scrollCategories.addEventListener('change', validateForm);




// Test pour vérifier la validité du formulaire et l'apparence du bouton de validation

// const galleryForm = document.querySelector('#modalForm');
// const validationButton = document.querySelector('#input-color-validation');
// const titleInput = document.querySelector('#title');

// // Fonction pour vérifier la validité du formulaire
// function isFormValid() {
//     const title = titleInput.value.trim();
//     const categoryId = parseInt(scrollCategories.value, 10);
//     const file = fileInput.files[0];
//     return title && file && !isNaN(categoryId);
// }

// // Fonction pour mettre à jour l'apparence du bouton
// function updateButtonState() {
//     if (!validationButton) return; // Éviter les erreurs si l'élément est manquant
//     if (isFormValid()) {
//         validationButton.classList.add('valid-input');
//         validationButton.classList.remove('invalid-input');
//     } else {
//         validationButton.classList.remove('valid-input');
//         validationButton.classList.add('invalid-input');
//     }
// }

// // Vérification des éléments DOM
// if (!galleryForm || !titleInput || !scrollCategories || !fileInput || !validationButton) {
//     console.error('Un ou plusieurs éléments DOM sont introuvables.');
// } else {
//     // Écouteurs pour mise à jour dynamique
//     titleInput.addEventListener('input', updateButtonState);
//     scrollCategories.addEventListener('change', updateButtonState);
//     fileInput.addEventListener('change', updateButtonState);
//     updateButtonState(); // Initialiser l'état du bouton
//     }

//     // Gestion de la soumission
//     galleryForm.addEventListener('submit', async (event) => {
//         event.preventDefault();

//         const preview = document.querySelector('#preview');
//         const fileButton = document.querySelector('.button-file button');
//         const fileIcon = document.querySelector('.button-file i');
//         const fileText = document.querySelector('.button-file p');
//         const gallery = document.querySelector('#gallery');
//         const galleryModal = document.querySelector('#galleryModal');
//         const modal2 = document.querySelector('#modal2');
//         const overlay = document.querySelector('#overlay');

//         // Vérification des éléments supplémentaires
//         if (!preview || !fileButton || !fileIcon || !fileText || !gallery || !galleryModal || !modal2 || !overlay) {
//             console.error('Un ou plusieurs éléments DOM sont introuvables.');
//             const errorMessage = document.createElement('p');
//             errorMessage.className = 'error-message';
//             errorMessage.textContent = 'Erreur : éléments de l\'interface manquants.';
//             errorMessage.setAttribute('role', 'alert');
//             galleryForm.appendChild(errorMessage);
//             setTimeout(() => errorMessage.remove(), 3000);
//             return;
//         }

//         const formData = new FormData();
//         const title = titleInput.value.trim();
//         const categoryId = parseInt(scrollCategories.value, 10);
//         const file = fileInput.files[0];

//         // Validation
//         if (!isFormValid()) {
//             validationButton.classList.remove('valid-input');
//             validationButton.classList.add('invalid-input');
//             const errorMessage = document.createElement('p');
//             errorMessage.className = 'error-message';
//             errorMessage.textContent = 'Veuillez remplir tous les champs du formulaire.';
//             errorMessage.setAttribute('role', 'alert');
//             galleryForm.appendChild(errorMessage);
//             setTimeout(() => errorMessage.remove(), 3000);
//             return;
//         }

//         // Ajout des données à FormData
//         formData.append('image', file);
//         formData.append('title', title);
//         formData.append('category', categoryId.toString());

//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 throw new Error('Aucun token d\'authentification trouvé.');
//             }

//             const response = await fetch(`${BASE_URL}/api/works/`, {
//                 method: 'POST',
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: formData
//             });

//             if (!response.ok) {
//                 throw new Error(`Erreur ${response.status}: ${response.statusText}`);
//             }

//             const newWork = await response.json();
//             console.log('Nouvelle œuvre ajoutée :', newWork);

//             // Réinitialisation du formulaire
//             galleryForm.reset();
//             fileInput.value = '';
//             preview.style.display = 'none';
//             fileButton.style.display = 'block';
//             fileIcon.style.display = 'block';
//             fileText.style.display = 'block';

//             // Mise à jour de la galerie
//             const figure = createFigure(newWork); // Assurez-vous que createFigure est défini
//             gallery.appendChild(figure);
//             galleryModal.innerHTML = '';
//             await getWorksModal(); // Assurez-vous que getWorksModal est défini

//             // Fermeture de la modale
//             modal2.style.display = 'none';
//             overlay.style.display = 'none';

//             // Réinitialiser l'état du bouton
//             updateButtonState();

//         } catch (error) {
//             console.error('Erreur lors de l\'ajout de l\'œuvre :', error);
//             const errorMessage = document.createElement('p');
//             errorMessage.className = 'error-message';
//             errorMessage.textContent = 'Une erreur est survenue lors de l\'ajout de l\'œuvre. Veuillez réessayer.';
//             errorMessage.setAttribute('role', 'alert');
//             galleryForm.appendChild(errorMessage);
//             setTimeout(() => errorMessage.remove(), 3000);
//         }
//     });