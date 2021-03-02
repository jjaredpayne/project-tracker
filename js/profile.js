var nodeURL = 'http://flip3.engr.oregonstate.edu:8916/';

function deleteRow(idButton) {
    //    console.log('idButton ' + idButton);
    return new Promise(function (resolve, reject) {
        document.getElementById('deleteButton' + idButton).addEventListener('click', function (event) {
            var req = new XMLHttpRequest();
            
            reqURL = nodeURL + 'deleteRow' + '?rowId=' + idButton;
            console.log('reqURL:', reqURL);
            req.open('GET', reqURL, true);
            req.addEventListener("load", function () {
                if (req.status >= 200 && req.status < 400) {
                    if (req.responseText !== '') {
                        console.log(JSON.parse(req.responseText));
                        let response = JSON.parse(req.responseText);
                        console.log('response: ' + response.results);
                        showTable();
                    } else {
                        console.log('error');
                    }
                } else {
                    console.log("Error! " + req.statusText);
                }
            });
            req.send(null);
        });
    });
};

function displayEmployees(){
    nodeURL = 'http://flip3.engr.oregonstate.edu:8916/'
    console.log("displayEmployees");
    return new Promise(function(resolve, reject){
        var req = new XMLHttpRequest();
        //get zipCode from form
        //get countryCode from form
        let payload = {firstName: null, lastName: null, workRole: null};
        payload.workRole = document.getElementById('inputWorkRole').value;
        payload.firstName = document.getElementById('inputFirstName').value;
        payload.lastName = document.getElementById('inputLastName').value;
        console.log(payload);
        
        reqURL = nodeURL + 'displayProfile' + '?firstName=' + payload.firstName + '&lastName=' + payload.lastName + '&workRole=' + payload.workRole;

        //Name can't be empty.
        console.log(reqURL);
        req.open('GET', reqURL, true);
        req.addEventListener("load", function () {
            if (req.status >= 200 && req.status < 400) {
                if (req.responseText !== '') {
                    console.log('response' + req.responseText);
                    let response = req;
                }
            } else {
                console.log("Error! " + req.statusText);
            }
        });
        req.send(null);
    });
};

