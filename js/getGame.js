let player;
let serial;
let elo;

function selectColor(selectedPlayer) {
    player = selectedPlayer;
}

function setSerialNumber(inputSerial) {
    serial = inputSerial;
    console.log(serial);
}

function setElo(inputElo) {
    elo = inputElo;
}

function showCollectedData() {
    console.log(player, serial, elo);
}
function submitData(event) {
    event.preventDefault();
    if (!player || !serial || !elo) {
        alert("Please select your specifications before proceeding.");
    } else {
        console.log("validated");
        // Send the data to the backend
        // Once complete, then redirect
        // window.location.href = "chessgame.html";
    }
}

