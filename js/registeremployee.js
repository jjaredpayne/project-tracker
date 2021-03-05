var nodeURL = 'http://flip3.engr.oregonstate.edu:8916/';
var selectedRole = document.getElementById('inputWorkRole');
var managementStyle = document.getElementById('inputManagementStyle');

//Enables and disableds the Management Style box
document.addEventListener('change', function(){
    console.log("change event triggered ");
    console.log('selectedRole.value ' + selectedRole.value);
    console.log('inputManagementStyle.value ' + managementStyle.disabled);
    if (selectedRole.value === '2'){
        managementStyle.disabled = false;
        console.log("setting false");
        console.log('inputManagementStyle.value 2' + managementStyle.disabled);
    }
    else {
        managementStyle.disabled = true;
        console.log("setting true");
        console.log('inputManagementStyle.value 2' + managementStyle.disabled);
    }
});

// //add listener to event
// document.addEventListener('DOMContentLoaded', () => {
//     enableManagementStyle(); 
// });

// function enableManagementStyle(){
//     var selectedRole = document.getElementById('inputWorkRole');

//     console.log('selectedRole.value ' + selectedRole.value);
//     console.log('inputManagementStyle.value ' + managementStyle.disabled);
//     selectedRole.onChange = function() {
//         if (this.value === 2){
//             managementStyle.disabled = false;
//         }
//         else {
//             managementStyle.disabled = false;
//         }
//     };
// };

function registerEmployee(){
    return new Promise(function(resolve, reject){
        var req = new XMLHttpRequest();
        //get zipCode from form
        //get countryCode from form
        let payload = {firstName: null, lastName: null, managementStyle: null};
        payload.workRole = document.getElementById('inputWorkRole').value;
        payload.firstName = document.getElementById('inputFirstName').value;
        payload.lastName = document.getElementById('inputLastName').value;
        payload.managementStyle = document.getElementById('inputManagementStyle').value;
        console.log(payload);
        
        //Name can't be empty.
        if (payload.name === ''){ console.log ('Name cannot be empty!');}
        else{
            // reqURL = nodeURL + 'insertemployee' + '?firstName=' + payload.firstName + '&lastName=' + payload.lastName;
            // console.log(reqURL);
            // req.open('GET', reqURL, true);
            // req.addEventListener("load", function () {
            //     if (req.status >= 200 && req.status < 400) {
            //         if (req.responseText !== '') {
            //             console.log(JSON.parse(req.responseText));
            //             let response = JSON.parse(req.responseText);
            //             console.log('response: ' + response.results);
            //             showTable();
            //         } else {
            //         }
            //     } else {
            //         console.log("Error! " + req.statusText);
            //     }
            // });
            // req.send(null);
            console.log("attemptingn to insert manager/developer")
            if(payload.workRole === '1'){
                console.log("attemptingn to insert developer");
                insertDeveloper();
            }
            else if(payload.workRole === '2'){
                console.log("attemptingn to insert manager");
                insertManager();
            }
        }
    });
};

function insertDeveloper(){
    console.log("registerdeveloper");
    return new Promise(function(resolve, reject){
        var req = new XMLHttpRequest();
        //get zipCode from form
        //get countryCode from form
        let payload = {firstName: null, lastName: null, managementStyle: null};
        payload.workRole = document.getElementById('inputWorkRole').value;
        payload.firstName = document.getElementById('inputFirstName').value;
        payload.lastName = document.getElementById('inputLastName').value;
        payload.managementStyle = document.getElementById('inputManagementStyle').value;
        console.log(payload);
        
        reqURL = nodeURL + 'insertdeveloper' + '?firstName=' + payload.firstName + '&lastName=' + payload.lastName;
        console.log(reqURL);

        //Name can't be empty.
        console.log(reqURL);
        req.open('GET', reqURL, true);
        req.addEventListener("load", function () {
            if (req.status >= 200 && req.status < 400) {
                if (req.responseText !== '') {
                    console.log(JSON.parse(req.responseText));
                    let response = JSON.parse(req.responseText);
                    console.log('response: ' + response.results);
                    showTable();
                } else {
                }
            } else {
                console.log("Error! " + req.statusText);
            }
        });
        req.send(null);
    });
};

function insertManager(){
    console.log("registermanager")
    return new Promise(function(resolve, reject){
        var req = new XMLHttpRequest();
        //get zipCode from form
        //get countryCode from form
        let payload = {firstName: null, lastName: null, managementStyle: null};
        payload.workRole = document.getElementById('inputWorkRole').value;
        payload.firstName = document.getElementById('inputFirstName').value;
        payload.lastName = document.getElementById('inputLastName').value;
        payload.managementStyle = document.getElementById('inputManagementStyle').value;
        console.log(payload);
        
        reqURL = nodeURL + 'insertmanager' + '?firstName=' + payload.firstName + '&lastName=' + payload.lastName + '&managementStyle=' + payload.managementStyle;
        console.log(reqURL);
        req.open('GET', reqURL, true);
        req.addEventListener("load", function () {
            if (req.status >= 200 && req.status < 400) {
                if (req.responseText !== '') {
                    console.log(JSON.parse(req.responseText));
                    let response = JSON.parse(req.responseText);
                    console.log('response: ' + response.results);
                } else {
                }
            } else {
                console.log("Error! " + req.statusText);
            }
        });
        req.send(null);
    });
};