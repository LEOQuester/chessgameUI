let player;
let serial;
let elo;

function selectColor(selectedPlayer) {
  player = selectedPlayer;
}

function setSerialNumber(inputSerial) {
  serial = inputSerial;
  console.log(serial);

  //change the button text
  var submitBtn = document.querySelector(".submit");
  if(serial == ""){
    submitBtn.value = "Play a Quick Game";
  }else{
    submitBtn.value = `Start Robot ${serial} & Monitor`;
  }
}

function setElo(inputElo) {
  elo = inputElo;
}
function showCollectedData() {
  console.log(player, serial, elo);
}

function submitData(event) {
  event.preventDefault();
  if (!player || !elo) {
    customAlert("Please select your specifications before proceeding.");
  } else {
    if (!serial){
      serial = null
    }
    console.log("validated");

    const postData = {
      sn: serial,
      elo: elo,
      player: player
    };
    console.log(postData);

    // Send the data to the backend
    fetch('http://localhost:5000/api/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
    .then(response => {
      // Check if the response status is OK 200?
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      // Assume the response is a plain text string
      return response.json();
    })
    .then(data => {
      // Handle the string data as needed
      console.log('Server response:', data);
      if (data == "offline or in use" || data == "offline : Robot Not found") {
        customAlert("Robot you requested is not available at the moment!");
      }else if(data.mesage === "robot is staged for a match" || data.message === "robot is playing"){
        customAlert("Robot already playing a game, reset game from robot's reset button or proceed to monitor current game", "Monitor", openMonitorMode, data);
      }else {
        //if robot avalable then proceed to monitor
        if(serial){
          openMonitorMode(data);
        }else{
          const queryParams = Object.entries(data)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&');
        
          // Construct the full URL
          const fullUrl = `chessgame.html?${queryParams}&mode=play`;
          window.location.href = fullUrl;
        }
      }
    })
    .catch(error => {
      console.error('Error during fetch operation:', error);
    });
  }
}

function openMonitorMode(data){
  const queryParams = Object.entries(data)
  .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
  .join('&');
  // Construct the full URL
  const fullUrl = `chessgame.html?${queryParams}&mode=monitor`;
  console.log(fullUrl)
  window.location.href = fullUrl;
}
