const logApi = "http://localhost:5678/api/users/login";


document.getElementById("login").addEventListener("submit", submitPassword);

async function submitPassword(event)  {

    event.preventDefault(); 

    let user = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
    };
    const messageError = document.getElementById("messageError");

try {
let response = await fetch(logApi, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
});

if (!response.ok) {
        messageError.textContent = "Identifiant ou mot de passe incorrect";
        throw new Error('Identifiant ou mot de passe incorrect');
   }
   
const result = await response.json();

localStorage.setItem("token", result.token);

    window.location.href = "index.html";

} catch (error) {
    console.error('Erreur lors de la connexion:', error);
}
}




