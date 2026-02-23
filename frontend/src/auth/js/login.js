import { safeJson } from "./utils.js";

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        document.getElementById("error").textContent = "Login invalide";
        return;
    }
    const data = await safeJson(res);
    sessionStorage.setItem("token", data.token);
    sessionStorage.setItem("email", email);
    sessionStorage.setItem("employeeId", String(data.employeeId));
    window.location.href = "/index.html?mode=NORMAL";
});