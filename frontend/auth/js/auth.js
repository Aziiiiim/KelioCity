async function safeJson(res) {
  const text = await res.text();
  try { return JSON.parse(text); } catch { return { raw: text }; }
}

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

if (loginForm) {
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
    localStorage.setItem("token", data.token);
    localStorage.setItem("email", email);

    window.location.href = "../index.html";
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/register", {
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
    localStorage.setItem("email", email);

    window.location.href = "../index.html";
  });
}