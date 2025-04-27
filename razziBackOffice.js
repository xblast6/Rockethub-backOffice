const form = document.getElementById("formRazzo")
const inpRocketName = document.getElementById("rocketName")
const inpRocketimage = document.getElementById("rocketimage")
const inpRocketCompany = document.getElementById("rocketCompany")
const inpRocketHeight = document.getElementById("rocketHeight")
const inpRocketDiameter = document.getElementById("rocketDiameter")
const inpRocketMass = document.getElementById("rocketMass")
const inpRocketNumStages = document.getElementById("rocketNumStages")
const inpRocketFirstStage = document.getElementById("rocketFirstStage")
const inpRocketFirstStageEngine = document.getElementById("rocketFirstStageEngine")
const inpRocketFirstStagePropellant = document.getElementById("rocketFirstStagePropellant")
const inpRocketFirstStageThrust = document.getElementById("rocketFirstStageThrust")
const inpRocketSecondStage = document.getElementById("rocketSecondStage")
const inpRocketSecondStageEngine = document.getElementById("rocketSecondStageEngine")
const inpRocketSecondStagePropellant = document.getElementById("rocketSecondStagPropellant")
const inpRocketSecondStageThrust = document.getElementById("rocketSecondStageThrust")
const inpRocketThirdStage = document.getElementById("rocketThirdStage")
const inpRockrocketThirdStageEngine = document.getElementById("rocketThirdStageEngine")
const inpRocketThirdStagePropellant = document.getElementById("rocketThirdStagePropellant")
const inpRocketThirdStageThrust = document.getElementById("rocketThirdStageEngineThrust")
const inpRocketThirdStageOpzionale = document.getElementById("opzionale")
const renderApi = document.getElementById("renderApi")

//variabili Modale
const formModale = document.getElementById("formRazzoModale")
const inpRocketNameModale = document.getElementById("rocketNameModale")
const inpRocketimageModale = document.getElementById("rocketimageModale")
const inpRocketCompanyModale = document.getElementById("rocketCompanyModale")
const inpRocketHeightModale = document.getElementById("rocketHeightModale")
const inpRocketDiameterModale = document.getElementById("rocketDiameterModale")
const inpRocketMassModale = document.getElementById("rocketMassModale")
const inpRocketNumStagesModale = document.getElementById("rocketNumStagesModale")
const inpRocketFirstStageModale = document.getElementById("rocketFirstStageModale")
const inpRocketFirstStageEngineModale = document.getElementById("rocketFirstStageEngineModale")
const inpRocketSecondStageModale = document.getElementById("rocketSecondStageModale")
const inpRocketSecondStageEngineModale = document.getElementById("rocketSecondStageEngineModale")
const inpRocketThirdStageModale = document.getElementById("rocketThirdStageModale")
const inpRocketThirdStageEngineModale = document.getElementById("rocketThirdStageEngineModale")
const inpRocketThirdStageOpzionaleModale = document.getElementById("opzionaleModale")


const urlRockets = "https://rockethub.onrender.com/rockets"
const urlCompanies = "https://rockethub.onrender.com/companies";

document.addEventListener("DOMContentLoaded", () => {
    fetchCompanies()
    fetchRockets()
});

// Fetch upload img
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
            renderRockets(data);
        })
        .catch(err => console.log("Errore: ", err));
}

//fetch aziende
function fetchCompanies() {
    const token = localStorage.getItem("adminToken");
    fetch(urlCompanies, {
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
            rocketCompanyOption(inpRocketCompany, data);
            rocketCompanyOption(inpRocketCompanyModale, data);
        })
        .catch(err => console.log("Errore GET aziende: ", err));
}


function rocketCompanyOption(selectElement, companies) {
    companies.forEach(company => {
        const option = document.createElement("option")
        option.value = company._id
        option.textContent = company.name
        selectElement.appendChild(option);
    });
}

//creazione del razzo
form.addEventListener("submit", async (e) => {
    (e).preventDefault()

    const rocketName = inpRocketName.value.trim()
    const rocketimage = inpRocketimage.files[0]
    const rocketCompany = inpRocketCompany.value
    const rocketHeight = inpRocketHeight.value.trim()
    const rocketDiameter = inpRocketDiameter.value.trim()
    const rocketMass = inpRocketMass.value.trim()
    const rocketNumStages = inpRocketNumStages.value.trim()
    const rocketFirstStage = inpRocketFirstStage.value.trim()
    const rocketFirstStageEngine = inpRocketFirstStageEngine.value.trim()
    const rocketSecondStage = inpRocketSecondStage.value.trim()
    const rocketSecondStageEngine = inpRocketSecondStageEngine.value.trim()
    const rocketThirdStage = inpRocketThirdStage.value.trim()
    const rocketThirdStageEngine = inpRockrocketThirdStageEngine.value.trim()
    const rocketThirdStageOpzionale = inpRocketThirdStageOpzionale.value


    if (!rocketName) {
        alert("Compila il campo nome")
        return
    }

    if (!rocketimage) {
        alert("Inserisci l'immagine del razzo")
        return
    }

    if (!rocketCompany) {
        alert("Scegli tra le aziende disponibili")
        return
    }

    if (!rocketHeight) {
        alert("Compila il campo altezza")
        return
    }

    if (!rocketDiameter) {
        alert("Compila il campo diameter")
        return
    }

    if (!rocketMass) {
        alert("Compila il campo massa")
        return
    }

    if (!rocketNumStages) {
        alert("Inserisci il numero di stadi")
        return
    }

    if (!rocketFirstStage) {
        alert("Compila il campo nome dei motori del primo stadio")
        return
    }

    if (!rocketFirstStageEngine) {
        alert("Inserisci il numero di motori del primo stadio")
        return
    }



    try {
        const imageData = await uploadImage(rocketimage);
        const payload = {
            name: rocketName,
            image: imageData.url,
            company: rocketCompany,
            height: {
                value: Number(rocketHeight),
                unit: "m"
            },
            diameter: {
                value: Number(rocketDiameter),
                unit: "m"
            },
            mass: {
                value: Number(rocketMass),
                unit: "t"
            },
            stages: {
                stageNumber: rocketNumStages,
                firstStageEngine: {
                    engineName: rocketFirstStage,
                    engineCount: rocketFirstStageEngine
                },
                secondStageEngine: {
                    engineName: rocketSecondStage,
                    engineCount: rocketSecondStageEngine
                },
                thirdStageEngine: {
                    engineName: rocketThirdStage,
                    engineCount: rocketThirdStageEngine,
                    opzionale: rocketThirdStageOpzionale
                }
            }
        }
        const token = localStorage.getItem("adminToken");
        const response = await fetch(urlRockets, {
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
        inpRocketName.value = ""
        inpRocketimage.value = ""
        inpRocketCompany.value = ""
        inpRocketHeight.value = ""
        inpRocketDiameter.value = ""
        inpRocketMass.value = ""
        inpRocketNumStages.value = ""
        inpRocketFirstStage.value = ""
        inpRocketFirstStageEngine.value = ""
        inpRocketSecondStage.value = ""
        inpRocketSecondStageEngine.value = ""
        inpRocketThirdStage.value = ""
        inpRockrocketThirdStageEngine.value = ""
        inpRocketThirdStageOpzionale.value = ""

        fetchRockets()
    } catch (error) {
        console.error(error);
    }
})

//render backoffice
function renderRockets(data) {
    renderApi.innerHTML = ""
    data.forEach(razzo => {
        const cardRocket = document.createElement("div")
        cardRocket.classList.add("card-backoffice")
        cardRocket.innerHTML = `
            <p>Name: ${razzo.name}</p>
            <img src="${razzo.image}" alt="${razzo.name}">
            <p>Company: ${razzo.company.name}</p>
            <p>Height: ${razzo.height.value} ${razzo.height.unit}</p>
            <p>Diameter: ${razzo.diameter.value} ${razzo.diameter.unit}</p>
            <p>Mass: ${razzo.mass.value} ${razzo.mass.unit}</p>
            <p>Number of Stage: ${razzo.stages.stageNumber}</p>
            <p>Primo stadio:</p>
            <div class="container-stadi-razzo">
                <p>Engine name: ${razzo.stages.firstStageEngine.engineName}, engine count: ${razzo.stages.firstStageEngine.engineCount}</p>
            </div>
            <p>Secondo stadio:</p>
            <div class="container-stadi-razzo">
                <p>Engine name: ${razzo.stages.secondStageEngine.engineName}, engine count: ${razzo.stages.secondStageEngine.engineCount}</p>
            </div>
            <p>Terzo stadio:</p>
            <div class="container-stadi-razzo">
                <p>Engine name: ${razzo.stages.thirdStageEngine.engineName}, engine count: ${razzo.stages.thirdStageEngine.engineCount}</p>
            </div>
            <div class="container-btn-card-backoffice">
                <button class="btn-backoffice btn-modifica" 
                    data-id="${razzo._id}" 
                    data-name="${razzo.name}" 
                    data-company="${razzo.company}" 
                    data-height-value="${razzo.height.value}" 
                    data-diameter-value="${razzo.diameter.value}" 
                    data-mass-value="${razzo.mass.value}" 
                    data-stages-stage-number="${razzo.stages.stageNumber}"
                    data-first-stage-engine-name="${razzo.stages.firstStageEngine.engineName}"
                    data-first-stage-engine-count="${razzo.stages.firstStageEngine.engineCount}"
                    data-second-stage-engine-name="${razzo.stages.secondStageEngine.engineName}"
                    data-second-stage-engine-count="${razzo.stages.secondStageEngine.engineCount}"
                    data-third-stage-engine-name="${razzo.stages.thirdStageEngine.engineName}"
                    data-third-stage-engine-count="${razzo.stages.thirdStageEngine.engineCount}"
                >Modifica</button>

                <button class="btn-backoffice btn-elimina" data-id="${razzo._id}">Elimina</button>
            </div>
        `
        renderApi.appendChild(cardRocket)
    });
    eventiBtn();
}

//form modale
formModale.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("razziIdModale").value;
    const rocketName = inpRocketNameModale.value.trim();
    const rocketCompany = inpRocketCompanyModale.value;
    const rocketHeight = inpRocketHeightModale.value.trim();
    const rocketDiameter = inpRocketDiameterModale.value.trim();
    const rocketMass = inpRocketMassModale.value.trim();
    const rocketNumStages = inpRocketNumStagesModale.value.trim();
    const rocketFirstStage = inpRocketFirstStageModale.value.trim();
    const rocketFirstStageEngine = inpRocketFirstStageEngineModale.value.trim();
    const rocketSecondStage = inpRocketSecondStageModale.value.trim();
    const rocketSecondStageEngine = inpRocketSecondStageEngineModale.value.trim();
    const rocketThirdStage = inpRocketThirdStageModale.value.trim();
    const rocketThirdStageEngine = inpRocketThirdStageEngineModale.value.trim();
    const rocketThirdStageOpzionale = inpRocketThirdStageOpzionaleModale.value;

    let imageUrl;
    if (inpRocketimageModale.files && inpRocketimageModale.files.length > 0) {
        try {
            const imageData = await uploadImage(inpRocketimageModale.files[0]);
            imageUrl = imageData.url;
        } catch (err) {
            console.error("Errore nell'upload dell'immagine:", err);
            return;
        }
    }

    const payload = {
        name: rocketName,
        company: rocketCompany,
        height: {
            value: Number(rocketHeight),
            unit: "m"
        },
        diameter: {
            value: Number(rocketDiameter),
            unit: "m"
        },
        mass: {
            value: Number(rocketMass),
            unit: "t"
        },
        stages: {
            stageNumber: rocketNumStages,
            firstStageEngine: {
                engineName: rocketFirstStage,
                engineCount: rocketFirstStageEngine
            },
            secondStageEngine: {
                engineName: rocketSecondStage,
                engineCount: rocketSecondStageEngine
            },
            thirdStageEngine: {
                engineName: rocketThirdStage,
                engineCount: rocketThirdStageEngine,
                opzionale: rocketThirdStageOpzionale
            }
        }
    };

    if (imageUrl) {
        payload.image = imageUrl;
    }

    try {
        const token = localStorage.getItem("adminToken");

        const response = await fetch(`${urlRockets}/${id}`, {
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
        document.getElementById("modale").style.display = "none";
        main.classList.remove("blur");
        fetchRockets();
    } catch (error) {
        console.error(error);
    }
});



//eventi modifica ed elimina
function eventiBtn() {
    document.querySelectorAll(".btn-modifica").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const button = e.currentTarget;
            const id = button.dataset.id;
            const name = button.dataset.name;
            const company = button.dataset.company;
            const heightValue = button.dataset.heightValue;
            const diameterValue = button.dataset.diameterValue;
            const massValue = button.dataset.massValue;
            const stageNumber = button.dataset.stagesStageNumber;
            const firstStageEngineName = button.dataset.firstStageEngineName;
            const firstStageEngineCount = button.dataset.firstStageEngineCount;
            const secondStageEngineName = button.dataset.secondStageEngineName;
            const secondStageEngineCount = button.dataset.secondStageEngineCount;
            const thirdStageEngineName = button.dataset.thirdStageEngineName;
            const thirdStageEngineCount = button.dataset.thirdStageEngineCount;

            // campi del modale
            document.getElementById("razziIdModale").value = id;
            inpRocketNameModale.value = name;
            inpRocketCompanyModale.value = company;
            inpRocketHeightModale.value = heightValue;
            inpRocketDiameterModale.value = diameterValue;
            inpRocketMassModale.value = massValue;
            inpRocketNumStagesModale.value = stageNumber;
            inpRocketFirstStageModale.value = firstStageEngineName;
            inpRocketFirstStageEngineModale.value = firstStageEngineCount;
            inpRocketSecondStageModale.value = secondStageEngineName;
            inpRocketSecondStageEngineModale.value = secondStageEngineCount;
            inpRocketThirdStageModale.value = thirdStageEngineName;
            inpRocketThirdStageEngineModale.value = thirdStageEngineCount;

            document.getElementById("modale").style.display = "block";
            main.classList.add("blur")
        });
    });

    document.querySelectorAll(".btn-elimina").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            console.log("ELIMINA: ", id);
            console.log(urlRockets + "/" + id);

            if (confirm("Sei sicuro di voler eliminare questo razzo?")) {
                deleteRocket(id);
            }
        });
    });
}

//chiusura del modale
document.getElementById("chiudiModale").addEventListener("click", () => {
    document.getElementById("modale").style.display = "none";
    main.classList.remove("blur")
})

//Elimina razzo
async function deleteRocket(id) {
    try {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(urlRockets + "/" + id, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(`ERRORE: ${response.status} - ${errorData.error}`)
        }
        fetchRockets()
    } catch (err) {
        console.log("Errore nell'eliminazione: " + err);
    }
}

const btnLogout = document.getElementById("btnLogout")
btnLogout.addEventListener("click", () => {
    localStorage.removeItem('adminToken');
    window.location.href = 'index.html';
})