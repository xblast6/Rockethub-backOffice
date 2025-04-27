const mainForm = document.getElementById("formAzienda");
const inpCompanyName = document.getElementById("companyName");
const inpCompanyLogo = document.getElementById("companyLogo");
const inpCompanyHeadquarters = document.getElementById("companyHeadquarters");
const inpCompanyWebsite = document.getElementById("companyWebsite");
const renderApi = document.getElementById("renderApi");
const main = document.getElementById("main")

const urlCompanies = "https://rockethub.onrender.com/companies"


document.addEventListener("DOMContentLoaded", fetchCompanies);
// Fetch upload
async function uploadImage(file) {
    const token = localStorage.getItem("adminToken");
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("https://rockethub.onrender.com/upload", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`
        },
        body: formData,
    });
    
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    return await response.json();
}

// Fetch aziende
function fetchCompanies() {
    const token = localStorage.getItem("adminToken"); 
    fetch(urlCompanies, {
      headers: {
        "Authorization": `Bearer ${token}` 
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => Promise.reject(err));
        }
        return res.json();
      })
      .then(data => {
        console.log(data);
        renderCompanies(data);
      })
      .catch(err => console.log("Errore: ", err));
  }
  

// Creazione dell' azienda
mainForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const companyName = inpCompanyName.value.trim();
    const companyLogo = inpCompanyLogo.files[0];
    const companyHeadquarters = inpCompanyHeadquarters.value.trim();
    const companyWebsite = inpCompanyWebsite.value.trim();

    if (!companyName) {
        alert("Compila il campo nome");
        return;
    }

    if (!companyLogo) {
        alert("Inserisci il logo dell'azienda");
        return;
    }

    if (!companyHeadquarters) {
        alert("Inserisci la sede dell'azienda");
        return;
    }

    if (!companyWebsite) {
        alert("Inserisci il sito dell'azienda");
        return;
    }

    try {
        const imageData = await uploadImage(companyLogo);

        const payload = {
            name: companyName,
            logo: imageData.url,
            headquarters: companyHeadquarters,
            website: companyWebsite,
        };

        const token = localStorage.getItem("adminToken");

        const response = await fetch(urlCompanies, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token 
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Errore HTTP: ${response.status} - ${errorData.error}`);
        }

        inpCompanyName.value = "";
        inpCompanyLogo.value = "";
        inpCompanyHeadquarters.value = "";
        inpCompanyWebsite.value = "";

        fetchCompanies();
    } catch (error) {
        console.error(error);
    }
});

//render backoffice
function renderCompanies(companies) {
    renderApi.innerHTML = "";
    companies.forEach((company) => {
        const cardCompany = document.createElement("div");
        cardCompany.classList.add("card-backoffice");
        cardCompany.innerHTML = `
        <p>Nome: <strong>${company.name}</strong></p>
        <img src="${company.logo}" alt="${company.name}" width="100">
        <p>Sede: <strong>${company.headquarters}</strong></p>
        <p>Sito: <strong>${company.website}</strong></p>
        <div class="container-btn-card-backoffice">
            <button class="btn-backoffice btn-modifica" data-id="${company._id}" data-name="${company.name}" data-headquarters="${company.headquarters}" data-website="${company.website}">Modifica</button>
            <button class="btn-backoffice btn-elimina" data-id="${company._id}">Elimina</button>
        </div>
    `;
        renderApi.appendChild(cardCompany);
    });
    eventiBtn();
}

//eventi modifica ed elimina
function eventiBtn() {
    document.querySelectorAll(".btn-modifica").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            const name = e.target.dataset.name
            const headquarters = e.target.dataset.headquarters
            const website = e.target.dataset.website
            console.log("MODIFICA:", id, name, headquarters, website);

            //campi del modale
            document.getElementById("companyIdModale").value = id
            document.getElementById("companyNameModale").value = name
            document.getElementById("companyHeadquartersModale").value = headquarters
            document.getElementById("companyWebsiteModale").value = website

            document.getElementById("modale").style.display = "block";
            main.classList.add("blur")
        });
    });

    document.querySelectorAll(".btn-elimina").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            console.log("ELIMINA: ", id);
            console.log(urlCompanies + "/" + id);

            if (confirm("Sei sicuro di voler eliminare questa azienda?")) {
                deleteCompany(id);
            }
        });
    });
}

// elimina
async function deleteCompany(id) {
    try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(urlCompanies + "/" + id, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(`ERRORE: ${response.status} - ${errorData.error}`)
        }
        fetchCompanies();
    } catch (error) {
        console.error("Errore nell'eliminzazione: " + error)
    }
}

//chiusura del modale
document.getElementById("chiudiModale").addEventListener("click", () => {
    document.getElementById("modale").style.display = "none";
    main.classList.remove("blur")
})

//Form del modale
document.getElementById("formModale").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("companyIdModale").value;
    const name = document.getElementById("companyNameModale").value.trim();
    const headquarters = document.getElementById("companyHeadquartersModale").value.trim();
    const website = document.getElementById("companyWebsiteModale").value.trim();
    const logoFile = document.getElementById("companyLogoModale").files[0];

    const updatedData = { name, headquarters, website };

    if (logoFile) {
        try {
            const imageData = await uploadImage(logoFile);
            updatedData.logo = imageData.url;
        } catch (error) {
            console.error("Errore nel caricamento immagine:", error);
            alert("Errore nel caricamento del logo. Riprova.");
            return;
        }
    }

    updateCompany(id, updatedData);
    document.getElementById("modale").style.display = "none";
});


async function updateCompany(id, updatedData) {
    try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(urlCompanies + "/" + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(updatedData)
        })
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(`ERRORE: ${response.status} - ${errorData.error}`)
        }
        fetchCompanies()
        main.classList.remove("blur")
    } catch (error) {
        console.error("Errore durante la modifica:", error);
    }
}
const btnLogout = document.getElementById("btnLogout")
btnLogout.addEventListener("click", () => {
    localStorage.removeItem('adminToken');
    window.location.href = 'index.html';
})
