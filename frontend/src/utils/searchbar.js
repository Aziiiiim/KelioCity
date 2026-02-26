import { selectObject } from "../core/scene.jsx";
import { apiFetch } from "./apiFetch.js";

window.addEventListener("DOMContentLoaded", () => {
  const searchbar = document.getElementsByClassName("search-bar")[0];
  searchbar.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        setTimeout(() => dropdown.classList.add('hidden'), 150);
        window.search();
    }
  });

  const dropdown = document.getElementsByClassName("search-dropdown")[0];
  searchbar.addEventListener('input', () => {
    const dropdown = document.getElementsByClassName("search-dropdown")[0];
    dropdown.innerHTML = "";
    dropdown.classList.remove('hidden');
    showResults();
  });
  searchbar.addEventListener('blur', () => {
    setTimeout(() => dropdown.classList.add('hidden'), 150);
  });
})

window.selectFilter = function(btn) {
    if (btn.classList.contains("active")) {
        btn.classList.remove("active");
    } else {
        const btns = document.getElementsByClassName("filter-btn");
        for (let i=0; i<btns.length; i++) {
            btns[i].classList.remove("active");
        }
        btn.classList.add("active");
    }
}

function showResults() {
    let btnType = "";
    const floorId = document.getElementsByClassName("select-floor")[0].value;
    if (document.getElementsByClassName("filter-btn active")[0]) {
        btnType = document.getElementsByClassName("filter-btn active")[0].dataset.type;
    }
    const searchContent = document.getElementsByClassName("search-bar")[0].value;
    if (searchContent === "") {
        document.getElementsByClassName("search-dropdown")[0].classList.add("hidden");
    } else {
        if (btnType === "employee") {
            apiFetch("/api/employees/search/" + searchContent)
                .then(res => res.json())
                .then(results => {
                    const dropdown = document.getElementsByClassName("search-dropdown")[0];
                    dropdown.innerHTML = "";
                    if (results.length === 0) {
                        let no_result = document.createElement("li");
                        no_result.classList.add("search-item");
                        no_result.textContent = "Aucun Résultat";
                        no_result.onclick = () => {
                            document.getElementsByClassName("search-bar")[0].value = "";
                            const btns = document.getElementsByClassName("filter-btn");
                            for (let i=0; i<btns.length; i++) {
                                btns[i].classList.remove("active");
                            }
                        };
                        dropdown.appendChild(no_result);
                    }
                    for (let i = 0; i < results.length; i++) {
                        let li_result = document.createElement("li");
                        li_result.classList.add("search-item");
                        li_result.addEventListener("pointerdown", (e) => {
                            e.preventDefault(); 
                            goToResult(li_result);
                        });
                        li_result.textContent = results[i]["firstName"] + " " + results[i]["lastName"];
                        li_result.dataset.id = results[i]["id"];
                        li_result.dataset.type = "employee";
                        li_result.dataset.floorId = results[i]["desk"]["room"]["floor"]["id"];
                        dropdown.appendChild(li_result);
                    }
                });
        } else if (btnType === "room") {
            apiFetch("/api/rooms/search/" + searchContent)
                .then(res => res.json())
                .then(results => {
                    const dropdown = document.getElementsByClassName("search-dropdown")[0];
                    dropdown.innerHTML = "";
                    if (results.length === 0) {
                        let no_result = document.createElement("li");
                        no_result.classList.add("search-item");
                        no_result.textContent = "Aucun Résultat";
                        no_result.onclick = () => {
                            document.getElementsByClassName("search-bar")[0].value = "";
                            const btns = document.getElementsByClassName("filter-btn");
                            for (let i=0; i<btns.length; i++) {
                                btns[i].classList.remove("active");
                            }
                        };
                        dropdown.appendChild(no_result);
                    }
                    for (let i = 0; i < results.length; i++) {
                        let li_result = document.createElement("li");
                        li_result.classList.add("search-item");
                        li_result.addEventListener("pointerdown", (e) => {
                            e.preventDefault();
                            goToResult(li_result);
                        });
                        li_result.textContent = results[i]["roomName"];
                        li_result.dataset.id = results[i]["id"];
                        li_result.dataset.type = "room";
                        li_result.dataset.floorId = results[i]["floor"]["id"];
                        dropdown.appendChild(li_result);
                    }
                });
        } else if (btnType === "desk") {
            apiFetch("/api/desks/search/" + searchContent)
                .then(res => res.json())
                .then(results => {
                    const dropdown = document.getElementsByClassName("search-dropdown")[0];
                    dropdown.innerHTML = "";
                    if (results.length === 0) {
                        let no_result = document.createElement("li");
                        no_result.classList.add("search-item");
                        no_result.textContent = "Aucun Résultat";
                        no_result.onclick = () => {
                            document.getElementsByClassName("search-bar")[0].value = "";
                            const btns = document.getElementsByClassName("filter-btn");
                            for (let i=0; i<btns.length; i++) {
                                btns[i].classList.remove("active");
                            }
                        };
                        dropdown.appendChild(no_result);
                    }
                    for (let i = 0; i < results.length; i++) {
                        let li_result = document.createElement("li");
                        li_result.classList.add("search-item");
                        li_result.addEventListener("pointerdown", (e) => {
                            e.preventDefault();
                            goToResult(li_result);
                        });
                        li_result.textContent = results[i]["deskName"];
                        li_result.dataset.id = results[i]["id"];
                        li_result.dataset.type = "desk";
                        li_result.dataset.floorId = results[i]["room"]["floor"]["id"];
                        dropdown.appendChild(li_result);
                    }
                });
        } else if (btnType === "") {
            Promise.all([
                apiFetch("/api/employees/search/" + searchContent).then(r => r.json()),
                apiFetch("/api/rooms/search/" + searchContent).then(r => r.json()),
                apiFetch("/api/desks/search/" + searchContent).then(r => r.json())
            ]).then(([employees, rooms, desks]) => {
                const dropdown = document.getElementsByClassName("search-dropdown")[0];
                dropdown.innerHTML = "";
                let no_result_found = true;
                for (let i = 0; i < employees.length; i++) {
                    no_result_found = false;
                    let li_result = document.createElement("li");
                    li_result.classList.add("search-item");
                    li_result.addEventListener("pointerdown", (e) => {
                        e.preventDefault();
                        goToResult(li_result);
                    });
                    li_result.textContent = employees[i]["firstName"] + " " + employees[i]["lastName"];
                    li_result.dataset.id = employees[i]["id"];
                    li_result.dataset.type = "employee";
                    li_result.dataset.floorId = employees[i]["desk"]["room"]["floor"]["id"];
                    dropdown.appendChild(li_result);
                }
                for (let i = 0; i < rooms.length; i++) {
                    no_result_found = false;
                    let li_result = document.createElement("li");
                    li_result.classList.add("search-item");
                    li_result.addEventListener("pointerdown", (e) => {
                        e.preventDefault();
                        goToResult(li_result);
                    });
                    li_result.textContent = rooms[i]["roomName"];
                    li_result.dataset.id = rooms[i]["id"];
                    li_result.dataset.type = "room";
                    li_result.dataset.floorId = rooms[i]["floor"]["id"];
                    dropdown.appendChild(li_result);
                }
                for (let i = 0; i < desks.length; i++) {
                    no_result_found = false;
                    let li_result = document.createElement("li");
                    li_result.classList.add("search-item");
                    li_result.addEventListener("pointerdown", (e) => {
                        e.preventDefault();
                        goToResult(li_result);
                    });
                    li_result.textContent = desks[i]["deskName"];
                    li_result.dataset.id = desks[i]["id"];
                    li_result.dataset.type = "desk";
                    li_result.dataset.floorId = desks[i]["room"]["floor"]["id"];
                    dropdown.appendChild(li_result);
                }
                if (no_result_found) {
                    let no_result = document.createElement("li");
                    no_result.classList.add("search-item");
                    no_result.textContent = "Aucun Résultat";
                    no_result.onclick = () => {
                        document.getElementsByClassName("search-bar")[0].value = "";
                        const btns = document.getElementsByClassName("filter-btn");
                        for (let i=0; i<btns.length; i++) {
                            btns[i].classList.remove("active");
                        }
                    };
                    dropdown.appendChild(no_result);
                }
            });
        }
    }
}

window.search = function() {
    const dropdown = document.getElementsByClassName("search-dropdown")[0];
    if (dropdown.children.length === 1 && dropdown.children[0].textContent !== "Aucun Résultat") {
        goToResult(dropdown.children[0]);
    }
}

function goToResult(elem) {
    let objectId = elem.dataset.id;
    let objectType = elem.dataset.type;
    let objectFloorId = elem.dataset.floorId;
    console.log(elem.dataset);

    if (window.floorId != objectFloorId) {
        window.floorId = objectFloorId; 

        window.scene.updateFloor(window.floorId);
        // Attendre que les assets et employés soient chargés (environ 500-800ms)
        setTimeout(() => {
            selectObject(objectType, objectId);

            const select = document.getElementsByClassName("select-floor")[0];
            if (select) {
                select.value = window.floorId;
            }
        }, 600);
    } else {
        selectObject(objectType, objectId);
    }
    
    document.getElementsByClassName("search-bar")[0].value = "";
    const dropdown = document.getElementsByClassName("search-dropdown")[0];
    dropdown.innerHTML = "";
    dropdown.classList.add("hidden");
    const btns = document.getElementsByClassName("filter-btn");
    for (let i=0; i<btns.length; i++) {
        btns[i].classList.remove("active");
    }
}