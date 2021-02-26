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
            if(payload.workRole === 'Manager'){
                reqURL = nodeURL + 'insertmanager' + '?firstName=' + payload.firstName + '&lastName=' + payload.lastName + '&managementStyle=' + payload.managementStyle;
                console.log(reqURL);
            }
            else if(payload.workRole === 'Developer'){
                reqURL = nodeURL + 'insertdeveloper' + '?firstName=' + payload.firstName + '&lastName=' + payload.lastName;
                console.log(reqURL);
            }
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
        }
    });
};
