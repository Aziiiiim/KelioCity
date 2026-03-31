import { safeJson } from "./utils.js"; // (pas utilisé ici mais importé)

const registerForm = document.getElementById("register-form");

// écoute l'envoi du formulaire
registerForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // empêche le refresh

    // récupère les champs du formulaire
    const firstName = document.getElementById("firstName").value.trim();
    const lastName  = document.getElementById("lastName").value.trim();
    const email     = document.getElementById("email").value.trim();
    const password  = document.getElementById("password").value;
    const phoneNumber = document.getElementById("phoneNumber").value;

    // sauvegarde temporaire dans sessionStorage
    sessionStorage.setItem("firstName", firstName);
    sessionStorage.setItem("lastName", lastName);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("password", password);
    sessionStorage.setItem("phoneNumber", phoneNumber);

    // redirection vers étape suivante (choix du genre)
    window.location.href = "../html/genderChoice.html";
});