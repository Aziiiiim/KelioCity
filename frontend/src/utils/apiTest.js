import { apiFetch } from "../utils/apiFetch.js";

const API = "http://localhost:8080/api";

export async function apiTest() {

    console.log("=== 🚀 DÉBUT DES TESTS API ===");

    // Helper
    async function test(name, fn) {
        try {
            console.log(`\n▶️ Test : ${name}`);
            const result = await fn();
            console.log(`✅ Réussite :`, result);
            return result;
        } catch (err) {
            console.error(`❌ Échec : ${name}`, err);
        }
    }

    // ----------------------------
    // ROOM TYPES
    // ----------------------------

    const roomType = await test("Créer RoomType", async () =>
        apiFetch(`${API}/room-types`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                roomtypeName: "TestType",
                lengthX: 10,
                lengthZ: 10
            })
        }).then(res => res.json())
    );

    await test("GET /room-types", async () =>
        apiFetch(`${API}/room-types`).then(res => res.json())
    );

    // ----------------------------
    // ROOMS
    // ----------------------------

    const room = await test("Créer Room", async () =>
        apiFetch(`${API}/rooms`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                roomName: "RoomTest",
                coordX1: 0,
                coordZ1: 0,
                orientationDeg: 0,
                openspaceNumber: 1,
                roomType: { id: roomType.id }
            })
        }).then(res => res.json())
    );

    await test("GET /rooms", async () =>
        apiFetch(`${API}/rooms`).then(res => res.json())
    );

    // ----------------------------
    // DESKS
    // ----------------------------

    const desk = await test("Créer Desk", async () =>
        apiFetch(`${API}/desks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                deskName: "DeskTest",
                coordX: 1,
                coordZ: 1,
                room: { id: room.id }
            })
        }).then(res => res.json())
    );

    await test("GET /desks", async () =>
        apiFetch(`${API}/desks`).then(res => res.json())
    );

    // ----------------------------
    // EMPLOYEES
    // ----------------------------

    const employee = await test("Créer Employee", async () =>
        apiFetch(`${API}/employees`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName: "John",
                lastName: "Doe",
                phoneNumber: "0102030405",
                email: "john.doe@test.com",
                workingHours: "9h-18h",
                inOffice: "OFFICE",
                status: "AVAILABLE",
                sprite: "MAN1",
                desk: { id: desk.id }
            })
        }).then(res => res.json())
    );

    await test("GET /employees", async () =>
        apiFetch(`${API}/employees`).then(res => res.json())
    );

    await test("PATCH employee status", async () =>
        apiFetch(`${API}/employees/${employee.id}/status/OCCUPIED`, {
            method: "PATCH"
        }).then(res => res.json())
    );

    // ----------------------------
    // MEETINGS
    // ----------------------------

    const now = new Date();
    const later = new Date(now.getTime() + 3600000);

    const meeting = await test("Créer Meeting", async () =>
        apiFetch(`${API}/meetings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: "Réunion test",
                description: "Réunion API test",
                startingHour: now.toISOString(),
                endHour: later.toISOString(),
                room: { id: room.id }
            })
        }).then(res => res.json())
    );

    await test("GET /meetings", async () =>
        apiFetch(`${API}/meetings`).then(res => res.json())
    );

    // ----------------------------
    // MEETING PARTICIPANTS
    // ----------------------------

    const participant = await test("Ajouter participant au meeting", async () =>
        apiFetch(`${API}/meeting-participants`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                meeting: { id: meeting.id },
                employee: { id: employee.id },
                present: true,
                remote: false
            })
        }).then(res => res.json())
    );

    await test("GET participants du meeting", async () =>
        apiFetch(`${API}/meeting-participants/meeting/${meeting.id}`)
            .then(res => res.json())
    );

    // ----------------------------
    // CLEANUP : DELETE
    // ----------------------------

    await test("DELETE Meeting", async () =>
        apiFetch(`${API}/meetings/${meeting.id}`, { method: "DELETE" })
    );

    await test("DELETE Employee", async () =>
        apiFetch(`${API}/employees/${employee.id}`, { method: "DELETE" })
    );

    await test("DELETE Desk", async () =>
        apiFetch(`${API}/desks/${desk.id}`, { method: "DELETE" })
    );

    await test("DELETE Room", async () =>
        apiFetch(`${API}/rooms/${room.id}`, { method: "DELETE" })
    );

    await test("DELETE RoomType", async () =>
        apiFetch(`${API}/room-types/${roomType.id}`, { method: "DELETE" })
    );

    console.log("\n FIN DES TESTS");
}
