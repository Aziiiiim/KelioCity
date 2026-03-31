export async function safeJson(res) {
  const text = await res.text(); // lit la réponse en texte brut

  try {
    return JSON.parse(text); // tente de parser en JSON
  } catch {
    // si erreur (ex: réponse non JSON), renvoie le texte brut
    return { raw: text };
  }
}