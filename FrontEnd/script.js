const gallery = document.querySelector('.gallery');
const categories = document.querySelector('.categories');

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
    categories.innerHTML = ''; // Vider les catégories existantes
    for (let category of categoriesFetched) {
        const button = document.createElement('button');
        button.textContent = category.name;
        button.setAttribute('data-category-id', category.id); // Ajouter l'ID de la catégorie comme attribut de données
        button.classList.add('category-button');
        categories.appendChild(button);
        }
}

const filterWorksByCaterogy = (categories);

filterWorksByCaterogy.addEventListener('click', () => {
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

// Fonction pour filtrer les œuvres par catégorie
    // export const filterWorksByCategory = (categories) => {
    // try {
//     gallery.innerHTML = ''; // Vider la galerie existante
//     let filteredWorks = worksFetched; // Par défaut, afficher toutes les œuvres

//     if (categories !== 0) { // Si la catégorie n'est pas "Tous"
//         filteredWorks = worksFetched.filter(work => work.categories === categories);
//     }
//     console.log("Filtered works:", filteredWorks);
// } catch (error) {
//     console.error('Error filtering works:', error);
// }
// };



 // categories.addEventListener('click', () => {
//     if (categories === '0') {
//         gallery.innerHTML = ''; // Vider la galerie existante
//         fetchWorks(); // Récup toutes les œuvres
//         console.log("Affichage de toutes les œuvres");
//     }



// });