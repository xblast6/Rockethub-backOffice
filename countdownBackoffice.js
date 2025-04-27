const countdownForm = document.getElementById("countdownForm")
const inpRocket = document.getElementById("inpRocket")
const inpLaunchSite = document.getElementById("inpLaunchSite")
const inpStatus = document.getElementById("inpStatus")
const inpLaunchDate = document.getElementById("inpLaunchDate")
const inpDescription = document.getElementById("inpDescription")
const inpLiveStreamUrl = document.getElementById("inpLiveStreamUrl")
const btnFormCountdown = document.getElementById("btnFormCountdown")

//modale
const formModale = document.getElementById("formCountdownModale")
const inpRocketModale = document.getElementById("inpRocketModale")
const inplaunchSiteModale = document.getElementById("inplaunchSiteModale")
const inpStatusModale = document.getElementById("inpStatusModale")
const inpLaunchDateModale = document.getElementById("inpLaunchDateModale")
const inpDescriptionModale = document.getElementById("inpDescriptionModale")
const inpLiveStreamUrlModale = document.getElementById("inpLiveStreamUrlModale")


const urlCountdown = "http://localhost:5010/countdowns"
const urlRockets = "http://localhost:5010/rockets"

document.addEventListener("DOMContentLoaded", () => {
    fetchRockets()
    fetchCountdown()
});

//fetch countdown
function fetchCountdown() {
    const token = localStorage.getItem("adminToken");
    fetch(urlCountdown, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) return res.json().then(err => Promise.reject(err));
        return res.json();
      })
      .then(data => {
        console.log(data);
        renderCountdowns(data);
      })
      .catch(err => console.log("Errore: ", err));
  }
  

//fetch razzi
function fetchRockets() {
    const token = localStorage.getItem("adminToken");
    fetch(urlRockets, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) return res.json().then(err => Promise.reject(err));
        return res.json();
      })
      .then(data => {
        console.log(data);
        rocketOption(inpRocket, data);
        rocketOption(inpRocketModale, data);
      })
      .catch(err => console.log("Errore: " + err));
  }
  

function rocketOption(inpRocket, rockets) {
    inpRocket.innerHTML = "";
    rockets.forEach(razzo => {
        const option = document.createElement("option")
        option.value = razzo._id
        option.textContent = razzo.name
        inpRocket.appendChild(option)
    });
}

//creazione countdown
countdownForm.addEventListener("submit", async (e) => {
    (e).preventDefault()

    const rocket = inpRocket.value
    const launchSite = inpLaunchSite.value.trim()
    const status = inpStatus.value
    const launchDate = inpLaunchDate.value.trim()
    const description = inpDescription.value.trim()
    const liveStreamUrl = inpLiveStreamUrl.value.trim()

    if (!rocket) {
        alert("Seleziona il razzo")
    }

    if (!launchSite) {
        alert("Compila il campo sito di lancio")
    }

    if (!launchDate) {
        alert("Seleziona la data di lancio")
    }

    if (!description) {
        alert("Seleziona la data di lancio")
    }

    try { 
        const payload = {
            rocket,
            launchSite,
            status,
            launchDate,
            description,
            liveStreamUrl
        }
        const token = localStorage.getItem("adminToken");
        const response = await fetch(urlCountdown, {
            method: "POST",
            headers: {"Content-Type": "application/json",
                    "Authorization": "Bearer " + token
             },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Errore HTTP: ${response.status} - ${errorData.error}`);
        }
        inpRocket.value=""
        inpLaunchSite.value=""
        inpStatus.value=""
        inpLaunchDate.value=""
        inpDescription.value=""
        inpLiveStreamUrl.value=""

        fetchCountdown()
    } catch (error) {
        console.log(error);
    }
})

//render backoffice
function renderCountdowns(data) {
    renderApi.innerHTML = ""
    data.forEach(countdown => {
        const cardCountdown = document.createElement("div")
        cardCountdown.classList.add("card-backoffice")
        cardCountdown.innerHTML = `
            <div class="container-info-card">
                <p>${countdown.rocket.name}</p>
                <p>${countdown.rocket.company.name}</p>
            </div>
            <img src="${countdown.rocket.image}" alt="${countdown.rocket.name}">
            <p>Data di lancio: ${countdown.launchDate}</p>
            <p>Sito di lancio: ${countdown.launchSite}</p>
            <p>Stato: ${countdown.status}</p>
            <p>Descrizione: ${countdown.description}</p>
            <a href="${countdown.liveStreamUrl}" target="_blank">Link alla live</a>
            <div class="container-btn-card-backoffice">
                <button id="" class="btn-backoffice btn-modifica"
                data-id="${countdown._id}"
                data-rocket="${countdown.rocket.name}"
                data-launch-site="${countdown.launchSite}"
                data-status="${countdown.status}"
                data-launch-date="${countdown.launchDate}"
                data-description="${countdown.description}"
                data-live-stream-url="${countdown.liveStreamUrl}"
                >Modifica</button>
                <button id="" class="btn-backoffice btn-elimina" data-id="${countdown._id}">Elimina</button>
            </div>
        `
        renderApi.appendChild(cardCountdown)
    });
    eventiBtn()
}

//eventi modifica ed elimina
function eventiBtn() {
    document.querySelectorAll(".btn-modifica").forEach( btn => {
        btn.addEventListener("click", (e) => {
            const button = e.currentTarget;
            const id = button.dataset.id;
            const rocket = button.dataset.rocket.name;
            const launchSite = button.dataset.launchSite;
            const status = button.dataset.status;
            const launchDate = button.dataset.launchDate;
            const description = button.dataset.description;
            const liveStreamUrl = button.dataset.liveStreamUrl;

            // campi del modale
            document.getElementById("countdownIdModale").value = id;
            inpRocketModale.value = rocket
            inplaunchSiteModale.value = launchSite
            inpStatusModale.value = status
            inpLaunchDateModale.value = launchDate
            inpDescriptionModale.value = description
            inpLiveStreamUrlModale.value = liveStreamUrl    
            
            document.getElementById("modaleCountdown").style.display = "block";
            main.classList.add("blur")
        })
    })

    document.querySelectorAll(".btn-elimina").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            console.log("ELIMINA: ", id);
            console.log(urlRockets + "/" + id);

            if (confirm("Sei sicuro di voler eliminare questo countdown?")) {
                deleteRocket(id);
            }
        });
    });
}

//chiusura del modale
document.getElementById("chiudiModale").addEventListener("click", () => {
    document.getElementById("modaleCountdown").style.display = "none";
    main.classList.remove("blur")
})

//form modale
formModale.addEventListener("submit", async (e) => {
    e.preventDefault()
    const id = document.getElementById("countdownIdModale").value
    const rocket = inpRocketModale.value
    const launchSite= inplaunchSiteModale.value.trim()
    const status= inpStatusModale.value.trim()
    const launchDate= inpLaunchDateModale.value.trim()
    const description= inpDescriptionModale.value.trim()
    const liveStreamUrl= inpLiveStreamUrlModale.value.trim()

    const payload = {
        rocket,
        launchSite,
        status,
        launchDate,
        description,
        liveStreamUrl
    }

    try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`${urlCountdown}/${id}`, {
            method: "PATCH",
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
        formModale.reset();
        document.getElementById("modaleCountdown").style.display = "none";
        main.classList.remove("blur");
        fetchCountdown();
    } catch (error) {
        console.error(error);
    }
})

//elimina countdown
async function deleteRocket(id) {
    try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(urlCountdown + "/" + id, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(`ERRORE: ${response.status} - ${errorData.error}`)
        }
        fetchCountdown()
    } catch (err) {
        console.log("Errore nell'eliminazione: " + err);
    }
}

const btnLogout = document.getElementById("btnLogout")
btnLogout.addEventListener("click", () => {
    localStorage.removeItem('adminToken');
    window.location.href = 'index.html';
})