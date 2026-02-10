import { safeJson } from "./utils.js";

const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    /*const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        document.getElementById("error").textContent = "Erreur à l'inscription";
        return;
    }

    const data = await safeJson(res);
    localStorage.setItem("token", data.token);
    localStorage.setItem("email", email);*/

    /*sessionStorage.setItem("userData", JSON.stringify({
      firstName,
      lastName,
      email,
      password
    }));*/

    sessionStorage.setItem("firstName",firstName);
    sessionStorage.setItem("lastName",lastName);
    sessionStorage.setItem("email",email);
    sessionStorage.setItem("password",password);

    window.location.href = "../html/genderChoice.html";
});