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
    dropdown.classList.remove('hidden');
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