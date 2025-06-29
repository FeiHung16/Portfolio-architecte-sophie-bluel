const gallery = document.querySelector('.gallery');
const categoriesContainer = document.querySelector('.categories');
const modalContainer = document.querySelector('.modal-container');
const modalTriggers = document.querySelectorAll('.modal-trigger');
const galleryModal = document.querySelector('.gallery-modal');
const login = document.querySelector('#loginProfile');

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
        console.log("Ensemble des works",worksFetched);
        for (let work of worksFetched) {
            const figure = createFigure(work);
            gallery.appendChild(figure);
            galleryModal.appendChild(figure.cloneNode(true)); // Ajouter les mêmes figures à la modale
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
    editBanner.forEach( a  => {
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


modalTriggers.forEach(trigger => trigger.addEventListener('click', toggleModal));

function toggleModal() {
  modalContainer.classList.toggle('active');
    const overlay = document.querySelector('.overlay');
    overlay.style.display = modalContainer.classList.contains('active') ? 'block' : 'none';
}


