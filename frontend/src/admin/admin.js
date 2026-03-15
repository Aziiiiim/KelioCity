const sheets = [
    {
        sheetName: 'Floors',
        resetTable: false,
        minDimensions:[3,10],
        columns: [
            {type: 'text', title: 'floorName', name: 'floorName', width:200},
            {type: 'numeric', title: 'lengthX', name: 'lengthX', width:100},
            {type: 'numeric', title: 'lengthZ', name: 'lengthZ', width:100}]
    },
    {
        sheetName: 'Rooms',
        resetTable: false,
        minDimensions:[7,10],
        columns: [
            {type: 'text', title: 'roomName', name: 'roomName', width:150},
            {type: 'dropdown', title: 'roomType', name: 'roomType', width:150, source: ["MeetingRoom", "Office1Desk", "Office2Desks", "Office4Desks", "Office6Desks", "Openspace", "Stairs", "Office1DeskB2", "Office2DesksB2", "Office3DesksB2", "Office4DesksB2", "Office5DesksB2", "MeetingRoomB2", "StairwellB2", "StairsB2", "Local", "LocalB2", "Toilets", "SmallAmphi", "BigAmphi", "B2Access"]},
            {type: 'text', title: 'floorName', name: 'floorName', width:140},
            {type: 'numeric', title: 'coordX1', name: 'coordX1', width:80},
            {type: 'numeric', title: 'coordZ1', name: 'coordZ1', width:80},
            {type: 'numeric', title: 'orientationDeg', name: 'orientationDeg', width:140},
            {type: 'numeric', title: 'openspaceNumber', name: 'openspaceNumber', width:160},
            {type: 'dropdown', title: 'position', name: 'position', width:100, source: ["up", "down"]},
            {type: 'text', title: 'nextFloor', name: 'nextFloor', width:120}]
    },
    {
        sheetName: 'Desks',
        resetTable: false,
        minDimensions:[3,10],
        columns: [
            {type: 'text', title: 'deskName', name: 'deskName', width:160},
            {type: 'text', title: 'roomName', name: 'roomName', width:160},
            {type: 'numeric', title: 'deskNumber', name: 'deskNumber', width:110}]
    },
    {
        sheetName: 'Employees',
        resetTable: false,
        minDimensions:[11,10],
        columns: [
            {type: 'text', title: 'lastName', name: 'lastName', width:100},
            {type: 'text', title: 'firstName', name: 'firstName', width:100},
            {type: 'text', title: 'roomName', name: 'roomName', width:100},
            {type: 'numeric', title: 'deskNumber', name: 'deskNumber', width:100},
            {type: 'text', title: 'deskName', name: 'deskName', width:100},
            {type: 'text', title: 'phoneNumber', name: 'phoneNumber', width:110},
            {type: 'text', title: 'email', name: 'email', width:100},
            {type: 'text', title: 'workingHours', name: 'workingHours', width:110},
            {type: 'dropdown', title: 'inOffice', name: 'inOffice', width:100, source: ["OFFICE", "REMOTE"]},
            {type: 'dropdown', title: 'status', name: 'status', width:100, source: ["AVAILABLE", "OCCUPIED", "ABSENT"]},
            {type: 'dropdown', title: 'sprite', name: 'sprite', width:100, source: ["MAN1", "WOMAN1","MAN2", "WOMAN2","MAN3", "WOMAN3","MAN4", "WOMAN4"]}]
    },
    {
        sheetName: 'Accounts',
        resetTable: false,
        minDimensions:[3,10],
        columns: [
            {type: 'text', title: 'email', name: 'email', width:160},
            {type: 'text', title: 'lastName', name: 'lastName', width:160},
            {type: 'text', title: 'firstName', name: 'firstName', width:160},
            {type: 'dropdown', title: 'role', name: 'role', width:110, source: ["USER", "ADMIN"]},
            {type: 'text', title: 'password', name: 'password', width:160}]
    },
    {
        sheetName: 'Meetings',
        resetTable: false,
        minDimensions:[7,10],
        columns: [
            {type: 'text', title: 'title', name: 'title', width:150},
            {type: 'text', title: 'roomName', name: 'roomName', width:120},
            {type: 'numeric', title: 'deskNumber', name: 'deskNumber', width:110},
            {type: 'text', title: 'deskName', name: 'deskName', width:120},
            {type: 'text', title: 'startingHour', name: 'startingHour', width:110},
            {type: 'text', title: 'endHour', name: 'endHour', width:100},
            {type: 'text', title: 'description', name: 'description', width:250}]
    },
    {
        sheetName: 'MeetingEmployees',
        resetTable: false,
        minDimensions:[5,10],
        columns: [
            {type: 'text', title: 'meetingTitle', name: 'meetingTitle', width:200},
            {type: 'text', title: 'employeeLastName', name: 'employeeLastName', width:200},
            {type: 'text', title: 'employeeFirstName', name: 'employeeFirstName', width:200},
            {type: 'checkbox', title: 'present', name: 'present', width:100},
            {type: 'checkbox', title: 'remote', name: 'remote', width:110}]
    }
];

let spreadsheet = jspreadsheet.tabs(document.getElementById('spreadsheet'), sheets);
const tabs = document.getElementsByClassName("jexcel_tab_link")
tabs[0].click();

// reset checkboxes
const containers = document.querySelectorAll('.jexcel_container');
containers.forEach((container, index) => {
    const resetDiv = document.createElement('div');
    resetDiv.className = 'individual-reset-container';
    resetDiv.innerHTML = `
        <label class="checkbox-container small">
            <input type="checkbox" class="reset-tab" data-index="${index}"/>
            <span class="checkmark"></span>
            Réinitialiser cette table
        </label>`;
    container.insertBefore(resetDiv, container.firstChild);
});

// link general checkbox and individual checkboxes
const globalReset = document.getElementById("reset");
const tabResets = document.querySelectorAll(".reset-tab");

globalReset.addEventListener('change', (e) => {
    tabResets.forEach(checkbox => {
        checkbox.checked = e.target.checked;
    });
});

tabResets.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const allChecked = Array.from(tabResets).every(c => c.checked);
        const noneChecked = Array.from(tabResets).every(c => !c.checked);
        if (allChecked) globalReset.checked = true;
        else if (!allChecked) globalReset.checked = false;
    });
});

tabs[tabs.length-1].addEventListener("click", () => {
    document.getElementsByClassName("spreadsheet-wrapper")[0].style.height = "356px";
})

for (let i=0; i<tabs.length; i++) {
    let px;
    if (i === tabs.length-1) {
        px = "370px";
    } else {
        px = "356px";
    }
    tabs[i].addEventListener("click", () => {
        document.getElementsByClassName("spreadsheet-wrapper")[0].style.height = px;
    })
}

function send() {
    const auth = "AUTH_PR0C0M_k3l10c1ty";
    let json = getCleanedJson();
    json["auth"] = auth;

    fetch(`/api/database-filler`, {
        method: 'POST',
        headers: {"Content-Type": "application/json", "Authorization": `Bearer ${sessionStorage.getItem("token")}`},
        body: JSON.stringify(json)
    }).then((response) => {
        if (!response.ok) {
            console.log(response);
            alert("Echec de la requête. Vérifiez le tableur");
        }
        document.getElementById("reset").checked = false;
        const excels = document.getElementById("spreadsheet").jexcel;
        excels.forEach((sheet) => {
            sheet.setData([]);
        });
        tabResets.forEach(checkbox => {
            checkbox.checked = false;
        });
        tabs[0].click();
    }).catch((error) => {
        console.log(error);
        alert("Echec de la requête. Vérifiez le tableur.");
    });
}

const tables = ["floors", "rooms", "desks", "employees", "accounts", "meetings", "meetingEmployees"];
function getCleanedJson() {
    let excel = document.getElementById("spreadsheet").jexcel;
    let json = {"reset": {}};
    for (let i=0; i<excel.length; i++) {
        const columns = excel[i].getConfig().columns;
        json["reset"][tables[i]] = tabResets[i].checked;
        json[tables[i]] = excel[i].getJson().map(row => {
           let hasContent = false;
           let processedRow = {};
           Object.entries(row).forEach(([key,value]) => {
               const colConfig = columns.find(c => c.name === key);
               const type = colConfig ? colConfig.type : 'text';

               if (type === 'numeric') {
                   if (value === "" || value === null || value === undefined) {
                       processedRow[key] = null;
                   } else {
                       const num = Number(value);
                       processedRow[key] = isNaN(num) ? value : num;
                   }
               } else if (type === 'checkbox') {
                   processedRow[key] = !!value;
               } else {
                   processedRow[key] = value === "" ? null : value;
               }

               if (type !== 'checkbox' && processedRow[key] !== null) {
                   hasContent = true;
               }
           });
           return hasContent ? processedRow : null;
        }).filter(row => row !== null);
    }
    return json;
}

document.getElementById("file-import").addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (!file) return;

    document.getElementById("reset").checked = false;
    const excels = document.getElementById("spreadsheet").jexcel;
    excels.forEach((sheet) => {
        sheet.setData([]);
    });
    tabs[0].click();

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        workbook.SheetNames.forEach(sheetName => {
           const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
           let targetSheet = null;
           for (let i=0; i<tables.length; i++) {
               if (tables[i].toLowerCase() === sheetName.toLowerCase()) {
                   targetSheet = document.getElementById("spreadsheet").jexcel[i];
               }
           }
           if (targetSheet && jsonData.length > 0) {
               targetSheet.setData(jsonData.slice(1));
           }
        });
        document.getElementById("file-import").value = '';
    };
    reader.readAsArrayBuffer(file);
});

function downloadSpreadsheet() {
    const data = getCleanedJson();
    const workbook = XLSX.utils.book_new();
    const hasData = Object.values(data).some(sheet => sheet.length > 0);
    if (!hasData) {
        alert("Pas de données à télécharger");
        return;
    }

    Object.keys(data).forEach(sheetName => {
        const sheetRows = data[sheetName];
        if (sheetRows.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(sheetRows);
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        }
    });
    const fileName = `KelioCity_Export_${new Date().toISOString()}.ods`;
    XLSX.writeFile(workbook, fileName, { bookType: 'ods' });
}