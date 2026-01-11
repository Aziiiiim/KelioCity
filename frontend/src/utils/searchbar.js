window.addEventListener("DOMContentLoaded", () => {
  const searchbar = document.getElementsByClassName("search-bar")[0];
  searchbar.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        setTimeout(() => dropdown.classList.add('hidden'), 150);
        search();
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

function selectFilter(btn) {
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
    console.log("to be implemented");
    let btnType = "";
    if (document.getElementsByClassName("filter-btn active")[0]) {
        btnType = document.getElementsByClassName("filter-btn active")[0].dataset.type;
    }
    const searchContent = document.getElementsByClassName("search-bar")[0].value;
    if (searchContent === "") {
        document.getElementsByClassName("search-dropdown")[0].classList.add("hidden");
    } else {
        if (btnType === "employee") {
            fetch("http://localhost:8080/api/employees/search/" + searchContent)
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
                        li_result.onclick = () => goToResult(li_result);
                        li_result.textContent = results[i]["firstName"] + " " + results[i]["lastName"];
                        dropdown.appendChild(li_result);
                    }
                });
        } else if (btnType === "room") {
            fetch("http://localhost:8080/api/rooms/search/" + searchContent)
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
                        li_result.onclick = () => goToResult(li_result);
                        li_result.textContent = results[i]["roomName"];
                        dropdown.appendChild(li_result);
                    }
                });
        } else if (btnType === "desk") {
            fetch("http://localhost:8080/api/desks/search/" + searchContent)
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
                        li_result.onclick = () => goToResult(li_result);
                        li_result.textContent = results[i]["deskName"];
                        dropdown.appendChild(li_result);
                    }
                });
        } else if (btnType === "") {
            const dropdown = document.getElementsByClassName("search-dropdown")[0];
            dropdown.innerHTML = "";
            fetch("http://localhost:8080/api/employees/search/" + searchContent)
                .then(res => res.json())
                .then(results => {
                    for (let i = 0; i < results.length; i++) {
                        let li_result = document.createElement("li");
                        li_result.classList.add("search-item");
                        li_result.onclick = () => goToResult(li_result);
                        li_result.textContent = results[i]["firstName"] + " " + results[i]["lastName"];
                        dropdown.appendChild(li_result);
                    }
                    fetch("http://localhost:8080/api/rooms/search/" + searchContent)
                        .then(res => res.json())
                        .then(results => {
                            for (let i = 0; i < results.length; i++) {
                                let li_result = document.createElement("li");
                                li_result.classList.add("search-item");
                                li_result.onclick = () => goToResult(li_result);
                                li_result.textContent = results[i]["roomName"];
                                dropdown.appendChild(li_result);
                            }
                            fetch("http://localhost:8080/api/desks/search/" + searchContent)
                                .then(res => res.json())
                                .then(results => {
                                    for (let i = 0; i < results.length; i++) {
                                        let li_result = document.createElement("li");
                                        li_result.classList.add("search-item");
                                        li_result.onclick = () => goToResult(li_result);
                                        li_result.textContent = results[i]["deskName"];
                                        dropdown.appendChild(li_result);
                                    }
                                    if (dropdown.children.length === 0) {
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
                        });
                });
        }
    }
}

function search() {
    console.log("to be implemented");
    // check if the current value exists -> if yes call goToResult, if no send an error msg
    let objectName = document.getElementsByClassName("search-bar")[0].value;
    goToResult(null, objectName);
}

function goToResult(elem, objectName=null) {
    document.getElementsByClassName("search-bar")[0].value = "";
    const btns = document.getElementsByClassName("filter-btn");
    for (let i=0; i<btns.length; i++) {
        btns[i].classList.remove("active");
    }

    if (!objectName) {
        objectName = elem.textContent;
    }
    console.log("to be implemented");
}