function customAlert(message, buttonText = "OK", callback, ...args) {
    // Set the message
    document.getElementById("customAlertMessage").innerText = message;

    // Set the button text
    document.getElementById("customAlertButton").innerText = buttonText;

    // Display the modal
    document.getElementById("customAlert").style.display = "flex";

    //by default pophiding function for ok button
    if(buttonText == "OK"){
        document.getElementById("customAlertButton").addEventListener("click", function() {
            closeCustomAlert();
        });
    }else{
        if(callback){
            document.getElementById("customAlertButton").addEventListener("click", function() {
                callback(...args);
                closeCustomAlert();
            });
        }else{
            console.log("callback function not defined");
        }   
    }
}

function closeCustomAlert() {
    // Close the modal
    document.getElementById("customAlert").style.display = "none";
}


/*usage : 

customAlert("text Message");
customAlert("textMessage", actionButtonText, actionBttonFunction, actionButtonfunctionParams);

*/