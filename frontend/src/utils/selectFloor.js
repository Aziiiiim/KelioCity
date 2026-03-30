import { apiFetch } from "./apiFetch.js";

// display the floor list in the select box
window.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementsByClassName("select-floor")[0];
    apiFetch ("/api/floors")
        .then(res => res.json())
        .then (listFloors => {
            for (let i=0; i<listFloors.length; i++){
                var option = new Option(listFloors[i]["floorName"], listFloors[i]["id"]);
                select.appendChild(option);
            }
            select.value = window.floorId;
        }) 
        
    select.addEventListener("change", updateFloor)

})

/// Note: Use optgroup to create subcategories, e.g., Bat 1, Bat 2

function updateFloor() {
    // update the variable floorID stored in the window
    const select = document.getElementsByClassName("select-floor")[0];
    window.floorId = select.value; 
    window.scene.updateFloor(window.floorId);
}

export function updateFloorByStairs(floorId) {
    // function used externally to update the floor when clicking on stairs
    window.floorId = floorId;
    window.scene.updateFloor(window.floorId);
    document.getElementsByClassName("select-floor")[0].value = window.floorId;
}




