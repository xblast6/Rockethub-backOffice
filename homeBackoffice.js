const formHome = document.getElementById("formHome");
const inpVideo = document.getElementById("video");
const inpVideoCta = document.getElementById("videoCta");
const inpFirstImage = document.getElementById("firstImage");
const inpSecondImage = document.getElementById("secondImage");
const inpThirdImage = document.getElementById("thirdImage");
const renderApi = document.getElementById("renderApi");

const modaleHome = document.getElementById("modaleHome");
const chiudiModaleHome = document.getElementById("chiudiModaleHome");
const formHomeModale = document.getElementById("formHomeModale");
const modaleContent = document.getElementById("modaleContent");
const modaleTitle = document.getElementById("modaleTitle");

let editingType = null;
let editingIndex = null;

const homeUrl = "http://localhost:5010/home";

document.addEventListener("DOMContentLoaded", () => {
  fetchHome();
});

chiudiModaleHome.addEventListener("click", () => {
  modaleHome.style.display = "none";
});

function fetchHome() {
  const token = localStorage.getItem("adminToken");
  fetch(homeUrl, {
    headers: { "Authorization": `Bearer ${token}` }
  })
    .then(res => {
      if (!res.ok) return res.json().then(err => Promise.reject(err));
      return res.json();
    })
    .then(data => renderHome(data))
    .catch(err => console.error("Errore fetchHome:", err));
}

formHome.addEventListener("submit", async (e) => {
  e.preventDefault();

  const videoFile = inpVideo.files[0];
  const firstImageFile = inpFirstImage.files[0];
  const secondImageFile = inpSecondImage.files[0];
  const thirdImageFile = inpThirdImage.files[0];

  const formData = new FormData();
  const method = editingType ? "PATCH" : "POST";

  if (videoFile) formData.append("video", videoFile);
  if (firstImageFile) formData.append("firstImage", firstImageFile);
  if (secondImageFile) formData.append("secondImage", secondImageFile);
  if (thirdImageFile) formData.append("thirdImage", thirdImageFile);

  try {
    const response = await fetch(homeUrl, {
      method,
      headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` },
      body: formData,
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      const errorData = contentType && contentType.includes("application/json")
        ? await response.json()
        : { error: await response.text() };
      throw new Error(`Errore: ${errorData.error || errorData.message}`);
    }

    const data = await response.json();
    alert("Contenuto della homepage salvato con successo!");
    formHome.reset();
    editingType = null;
    editingIndex = null;
    document.getElementById("btnCrea").textContent = "Crea";
    fetchHome();
  } catch (error) {
    console.error("Errore submit formHome:", error);
    alert("Si è verificato un errore durante il salvataggio.");
  }
});

// Render backoffice
function renderHome(homeContent) {
  renderApi.innerHTML = "";
  const homeCard = document.createElement("div");
  homeCard.classList.add("card-backoffice");

  if (homeContent.video) {
    homeCard.innerHTML = `
      <div class="home-video">
        <video width="320" height="240" controls autoplay>
          <source src="${homeContent.video}" type="video/mp4">
          Il tuo browser non supporta il video.
        </video>
      </div>
      <button class="btn-backoffice btn-modifica" data-type="video">Modifica</button>
      <button class="btn-backoffice btn-elimina" data-type="video">Elimina</button>
    `;
  }

  if (homeContent.sections && homeContent.sections.length > 0) {
    const sectionsHTML = homeContent.sections.map((section, i) => `
      <div class="home-section">
        <img src="${section.image}" alt="Immagine Sezione ${i + 1}" width="320" height="240">
        <p>CTA: ${section.cta || "Nessuna CTA"}</p>
        <button class="btn-backoffice btn-modifica" data-type="section" data-index="${i}">Modifica</button>
        <button class="btn-backoffice btn-elimina" data-type="section" data-index="${i}">Elimina</button>
      </div>
    `).join("");
    homeCard.innerHTML += `<div class="home-sections">${sectionsHTML}</div>`;
  }

  homeCard.innerHTML += `
    <div class="home-countdown">
      <p>Countdown: ${homeContent.countdown || "Nessun countdown associato."}</p>
    </div>
  `;

  renderApi.appendChild(homeCard);
}

// Modifica home
document.addEventListener('click', (e) => {
  if (e.target.classList.contains("btn-modifica")) {
    editingType = e.target.dataset.type;
    editingIndex = e.target.dataset.index || null;
    modaleTitle.textContent = editingType === 'video'
      ? 'Modifica Video'
      : `Modifica Sezione ${parseInt(editingIndex, 10) + 1}`;
    modaleContent.innerHTML = editingType === 'video' ? `
      <div class="container-voce-form">
        <label for="modaleVideo">Nuovo Video:</label>
        <input type="file" name="modaleVideo" id="modaleVideo">
      </div>
    ` : `
      <div class="container-voce-form">
        <label for="modaleSectionImage">Nuova Immagine:</label>
        <input type="file" name="modaleSectionImage" id="modaleSectionImage">
      </div>
      <div class="container-voce-form">
        <label for="modaleSectionCTA">Nuova CTA:</label>
        <input type="text" name="modaleSectionCTA" id="modaleSectionCTA" placeholder="Inserisci una nuova CTA...">
      </div>
    `;
    document.getElementById("btnCrea").textContent = "Modifica";
    modaleHome.style.display = "block";
  }
});

// Submit Modale (PATCH)
formHomeModale.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData();
  if (editingType === 'video') {
    const file = document.getElementById("modaleVideo").files[0];
    if (file) formData.append("video", file);
  } else if (editingType === 'section') {
    const file = document.getElementById("modaleSectionImage").files[0];
    const cta = document.getElementById("modaleSectionCTA").value;
    const fields = ["firstImage", "secondImage", "thirdImage"];
    const ctas = ["firstCTA", "secondCTA", "thirdCTA"];
    if (file) formData.append(fields[editingIndex], file);
    if (cta) formData.append(ctas[editingIndex], cta);
  }
  try {
    const res = await fetch(homeUrl, {
      method: 'PATCH',
      headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` },
      body: formData
    });
    if (!res.ok) throw await res.json();
    alert("Modifica effettuata con successo!");
    modaleHome.style.display = "none";
    fetchHome();
  } catch (err) {
    console.error("Errore PATCH:", err);
    alert("Errore durante la modifica.");
  }
});

// Gestione Delete
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-elimina")) {
    const type = e.target.dataset.type;
    const index = e.target.dataset.index;
    let url = homeUrl;
    if (type === "video") url += "/video";
    else if (type === "section") url += `/sections/${index}`;
    if (!confirm("Sei sicuro di voler eliminare?")) return;
    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` }
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Errore eliminazione");
      }
      alert("Eliminazione avvenuta con successo!");
      fetchHome();
    } catch (error) {
      console.error("Errore DELETE:", error);
      alert("Errore durante l'eliminazione.");
    }
  }
});

const btnLogout = document.getElementById("btnLogout")
btnLogout.addEventListener("click", () => {
    localStorage.removeItem('adminToken');
    window.location.href = 'index.html';
})