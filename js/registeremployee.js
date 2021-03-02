var nodeURL = 'http://flip3.engr.oregonstate.edu:8916/';

function registerEmployee(){
    console.log("registeremployee")
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
            reqURL = nodeURL + 'insertemployee' + '?firstName=' + payload.firstName + '&lastName=' + payload.lastName;
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
            console.log("attemptingn to insert manager/developer")
            if(payload.workRole === '1'){
                console.log("attemptingn to insert manager");
                insertManager();
            }
            else if(payload.workRole === '2'){
                console.log("attemptingn to insert developer");
                insertDeveloper();
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