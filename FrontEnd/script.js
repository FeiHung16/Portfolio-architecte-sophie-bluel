const gallery = document.querySelector('.gallery');
const categoriesContainer = document.querySelector('.categories');
const login = document.querySelector('#loginProfile');
const modal1 = document.querySelector('.modal-1');
const galleryModal = document.querySelector('.galleryModal');
const iconClose = document.querySelector('.modal-icon');
const overlay = document.querySelector('.overlay');
const btnTrigger = document.querySelector('.modal-trigger'); //Bouton modifier

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

    iconClose.addEventListener('click', () => {
        modal1.style.display = 'none'; // Fermer la modale 1
        overlay.style.display = 'none'; // Fermer l'overlay
    });

    window.addEventListener('click', (event) => {
        if (event.target === overlay) {
            modal1.style.display = 'none'; // Fermer la modale 1 si on clique en dehors
            overlay.style.display = 'none'; // Fermer l'overlay
        }
    }
    );
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


    iconClose.addEventListener('click', () => {

        modal2.style.display = 'none'; // Fermer la modale 2
        overlay.style.display = 'none'; // Fermer l'overlay
    });

    window.addEventListener('click', (event) => {
        if (event.target === overlay) {
            modal2.style.display = 'none'; // Fermer la modale 1 si on clique en dehors
            overlay.style.display = 'none'; // Fermer l'overlay
        }
    }
    );
});

