import { safeJson } from "./utils.js";

// récupère le formulaire
const loginForm = document.getElementById("login-form");

// écoute l'envoi du formulaire
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // empêche le rechargement de la page

    // récupère les valeurs des champs
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // envoie requête login à l'API
    const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    // si erreur → message
    if (!res.ok) {
        document.getElementById("error").textContent = "Login invalide";
        return;
    }

    // récupère réponse JSON sécurisée
    const data = await safeJson(res);

    // stocke infos en session
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("employeeId", String(data.employeeId));

    // redirection après login
    window.location.href = "/index.html?mode=NORMAL";
});