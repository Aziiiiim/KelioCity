import { createScene } from "../core/scene";

// display the floor list in the select box
window.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementsByClassName("select-floor")[0];
    fetch ("/api/floors")
        .then(res => res.json())
        .then (listFloors => {
            for (let i=0; i<listFloors.length; i++){
                var option = new Option(listFloors[i]["floorName"], listFloors[i]["id"]);
                select.appendChild(option);
            }
        }) 
        
    select.addEventListener("change", updateFloor)

})

function updateFloor() {
    const select = document.getElementsByClassName("select-floor")[0];
    window.floorId = select.value; 
    window.scene.updateFloor(window.floorId);
}




