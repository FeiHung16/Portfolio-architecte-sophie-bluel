const logApi = "http://localhost:5678/api/users/login";


document.getElementById("login").addEventListener("submit", submitPassword);

async function submitPassword(event)  {

    event.preventDefault(); 

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const user =  {email, password};

try {
let response = await fetch(logApi, {
    method: "POST",
    headers: {
        "Content-Type": 'application/json'
    },
    body: JSON.stringify(user)
});

if (!response.ok) {
   throw new Error('Mot de passe ou email incorrect');
}

const result = await response.json();

localStorage.setItem("token", result.token);

setTimeout(() => {
    window.location.href = "index.html";
}, 1000);


} catch (error) {
    console.error('Erreur lors de la connexion:', error);
}
}




