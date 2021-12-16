var nodeURL = 'http://flip3.engr.oregonstate.edu:8916/';

//Inserts a row below the row to be edited. Populates with fields to capture
//update data. Then, allows the data updates to be submitted.
function bindEditButtonDeveloper(employeeID, firstName, lastName, totalTasks) {
    console.log("edit button " + employeeID + " " + firstName);
    //Bind Edit Button and manipulate DOM fields to create 'edit' row.
    document.getElementById('editButton' + employeeID).addEventListener('click', function (event) {
        console.log("edit button");
        var editButton = document.getElementById('editButton'+employeeID);
        editButton.disabled = true;
        
        //specifies which row to edit
        var table = document.getElementById('profileTable');
        var tRow = document.getElementById('row'+employeeID);

        var firstNameCell = document.getElementById('cellFirstName'+employeeID)
        var lastNameCell = document.getElementById('cellLastName'+employeeID)
        var editCell = document.getElementById('cellEditButton'+employeeID)
        //Insert Edit Fields

        var createForm = "<form action='/updateEmployee' id='updateEmployee' method='post'>"
        var createFirstNameCell = "<td><input type='text' form='updateEmployee' class='form-control' id='editFirstName' name='firstName' value='" + firstName + "'></input></td>"
        var createLastNameCell = "<td><input type='text' form='updateEmployee' class='form-control' id='editLastName' name='lastName' value='" + lastName + "'></input></td>"
        var createCurrentTasksCell = "<td><input type='text' form='updateEmployee' class='form-control' id='editTotalTasks' name='totalTasks' value='" + totalTasks + "'></input></td>"
        var removeDelete = "<td></td>"
        var createSubmit = "<Button form='updateEmployee' type='submit' class='btn btn-outline-secondary mb-2 btn-sm tableButton'  name='submitID' id='submitButton" + employeeID + "' value='" + employeeID + "'>Submit</button>";
        // tRow.innerHTML = createForm + createFirstNameCell + createLastNameCell + createCurrentTasksCell + removeDelete + createSubmit;
        tRow.innerHTML = createForm + createFirstNameCell + createLastNameCell + createCurrentTasksCell + removeDelete + createSubmit;

        // firstNameCell.innerHTML = "<input type='text' class='form-control' id='editFirstName' name='firstName' placeholder='" + firstName + "'>";
        // lastNameCell.innerHTML = "<input type='text' class='form-control' id='editLastName' name='lastName' placeholder='" + lastName + "'>";
        // editCell.innerHTML = "<button type='button' class='btn btn-outline-secondary mb-2 btn-sm tableButton' name='submitEdit' id='submitEditButton" + employeeID + "'> Submit </button>";
    });
}
;

function bindEditButtonManager(employeeID, firstName, lastName, managementStyle) {
    console.log("edit button " + employeeID + " " + firstName);
    //Bind Edit Button and manipulate DOM fields to create 'edit' row.
    document.getElementById('editButton' + employeeID).addEventListener('click', function (event) {
        console.log("edit button");
        var editButton = document.getElementById('editButton'+employeeID);
        editButton.disabled = true;
        
        //specifies which row to edit
        var table = document.getElementById('profileTable');
        var tRow = document.getElementById('row' + employeeID);

        var firstNameCell = document.getElementById('cellFirstName'+employeeID)
        var lastNameCell = document.getElementById('cellLastName'+employeeID)
        var editCell = document.getElementById('cellEditButton'+employeeID)
        //Insert Edit Fields

        var createForm = "<form action='/updateEmployee' id='updateEmployee' method='post'>"
        var createFirstNameCell = "<td><input type='text' form='updateEmployee' class='form-control' id='editFirstName' name='firstName' value='" + firstName + "'></input></td>"
        var createLastNameCell = "<td><input type='text' form='updateEmployee' class='form-control' id='editLastName' name='lastName' value='" + lastName + "'></input></td>"
        var createManagementStyleCell = "<td>" + managementStyle + "</td>"
        // var createManagementStyleCell = "<select class='form-select' id='managementStyle' name='managementStyle'> <option value='1' selected>" + managmentTex + "</option> <option value='2'>Nurturer</option> <option value='3'>Anything Goes!</option> </select>"


        // var createManagementStyleCell = "<td><input type='text' form='updateEmployee' class='form-control' id='editLastName' name='managementStyle' placeholder='" + managementStyle + "'></input></td>"

        

        var removeDelete = "<td></td>"
        var createSubmit = "<Button form='updateEmployee' type='submit' class='btn btn-outline-secondary mb-2 btn-sm tableButton'  name='submitID' id='submitButton" + employeeID + "' value='" + employeeID + "'>Submit</button>";
        console.log(lastName)
        tRow.innerHTML = createForm + createFirstNameCell + createLastNameCell + createManagementStyleCell + removeDelete + createSubmit;

        // firstNameCell.innerHTML = "<input type='text' class='form-control' id='editFirstName' name='firstName' placeholder='" + firstName + "'>";
        // lastNameCell.innerHTML = "<input type='text' class='form-control' id='editLastName' name='lastName' placeholder='" + lastName + "'>";
        // editCell.innerHTML = "<button type='button' class='btn btn-outline-secondary mb-2 btn-sm tableButton' name='submitEdit' id='submitEditButton" + employeeID + "'> Submit </button>";
    });
}
;





// function deleteRow(employeeID) {
//     //    console.log('employeeID ' + employeeID);
//     return new Promise(function (resolve, reject) {
//         document.getElementById('deleteButton' + employeeID).addEventListener('click', function (event) {
//             var req = new XMLHttpRequest();
            
//             reqURL = nodeURL + 'deleteRow' + '?rowId=' + employeeID;
//             console.log('reqURL:', reqURL);
//             req.open('GET', reqURL, true);
//             req.addEventListener("load", function () {
//                 if (req.status >= 200 && req.status < 400) {
//                     if (req.responseText !== '') {
//                         console.log(JSON.parse(req.responseText));
//                         let response = JSON.parse(req.responseText);
//                         console.log('response: ' + response.results);
//                         showTable();
//                     } else {
//                         console.log('error');
//                     }
//                 } else {
//                     console.log("Error! " + req.statusText);
//                 }
//             });
//             req.send(null);
//         });
//     });
// };

// function displayEmployees(){
//     nodeURL = 'http://flip3.engr.oregonstate.edu:8916/'
//     console.log("displayEmployees");
//     return new Promise(function(resolve, reject){
//         var req = new XMLHttpRequest();
//         //get zipCode from form
//         //get countryCode from form
//         let payload = {firstName: null, lastName: null, workRole: null};
//         payload.workRole = document.getElementById('inputWorkRole').value;
//         payload.firstName = document.getElementById('inputFirstName').value;
//         payload.lastName = document.getElementById('inputLastName').value;
//         console.log(payload);
        
//         reqURL = nodeURL + 'displayProfile' + '?firstName=' + payload.firstName + '&lastName=' + payload.lastName + '&workRole=' + payload.workRole;

//         //Name can't be empty.
//         console.log(reqURL);
//         req.open('GET', reqURL, true);
//         req.addEventListener("load", function () {
//             if (req.status >= 200 && req.status < 400) {
//                 if (req.responseText !== '') {
//                     console.log('response' + req.responseText);
//                     let response = req;
//                 }
//             } else {
//                 console.log("Error! " + req.statusText);
//             }
//         });
//         req.send(null);
//     });
// };


