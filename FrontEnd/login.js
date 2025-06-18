const logApi = "http://localhost:5678/api/users/login";


document.getElementById("login").addEventListener("submit", submitPassword);

async function submitPassword(e)  {

    e.preventDefault(); 

    let user = {
    email: "sophie.bluel@test.tld",
    password: "S0phie"
    
}
try {
let response = await fetch(logApi, {
    method: "POST",
    headers: {
        "Content-Type": 'application/json'
    },
    body: JSON.stringify(user)
});

if (!response.ok) {
   throw new Error('Erreur HTTP: ' + response.status);
}

let result = await response.json();
console.log(result);
alert(result.message);
} catch (error) {
    console.error('Erreur lors de la soumission du mot de passe:', error);
}
}

submitPassword();



