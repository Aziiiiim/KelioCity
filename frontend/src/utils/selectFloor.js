import { createScene } from "../core/scene";

// display the floor list in the select box
window.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementsByClassName("select-floor")[0];
    fetch ("/api/floors")
        .then(res => res.json())
        .then (listFloors => {
            for (let i=0; i<listFloors.length; i++){
                var option = new Option(listFloors[i]["floorName"], listFloors[i]["id"]);
                //option.setAttribute('id', 'option-floor'+listFloors[i]["id"]);
                select.appendChild(option);
            }
            select.value = window.floorId;
        }) 
        
    select.addEventListener("change", updateFloor)

})

/// Note: utiliser optgroup pour faire des sous catégories ex Bat 1, Bat 2

function updateFloor() {
    const select = document.getElementsByClassName("select-floor")[0];
    window.floorId = select.value; 
    window.scene.updateFloor(window.floorId);
}

export function updateFloorByStairs(floorId) {
    window.floorId = floorId;
    window.scene.updateFloor(window.floorId);
    document.getElementsByClassName("select-floor")[0].value = window.floorId;
}




