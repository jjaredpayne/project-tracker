var nodeURL = 'http://flip3.engr.oregonstate.edu:8916/';
//add listener to event
document.addEventListener('DOMContentLoaded', () => {
    bindButtons();
    showTable();
});

//makes AJAX request to retrieve all SQL table data to the API server.
//Builds DOM table structure based on SQL data. Called on page load and after
//each button is pressed to ensure an up-to-date data is being displayed
function showTable() {
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        reqURL = nodeURL + 'show';
        console.log(reqURL);
        console.log("making profile table")
        //Make asynchronous request for all SQL data
        req.open('GET', reqURL, true);
        req.addEventListener("load", function () {
            if (req.status >= 200 && req.status < 400) {
                if (req.responseText !== '') {
                    let response = JSON.parse(req.responseText);
                    console.log("making profile table")
                    //div inner html is replaced each time to table does not grow with each request
                    divToClear = document.getElementById('tableDiv');
                    divToClear.innerHTML = "<thead><tr><th scope='col'>First Name</th><th scope='col'>Last Name</th><th scope='col'>Efficiency</th><th scope='col'>Current Tasks</th><th scope='col'>Delete</th><th scope='col'>Edit</th></tr></thead>";
                    
                    //creates tables structure
                    for (var i in response) {
                        var table = document.getElementById('profile-table');
                        var tRow = table.insertRow(-1); //inserts Row at last position
                        tRow.id = 'row'+response[i].id;

                        //Formats data as appropriate for type
                        for (var j in response[i]) {
                            var cell = tRow.insertCell(-1);
                            cell.style.border = 'thin solid black';
                            cell.innerText = response[i][j];                                     
                            
                            //Adds edit and Delete button at end of row
                            if (j === 'date') {
                                formatDate = new Date(response[i].date);
                                cell.innerText = formatDate.toLocaleDateString();
                                var cell = tRow.insertCell(-1);
                                cell.innerHTML = "<button type='button' name='Edit Exercise' id='editButton" + response[i].id + "'> Edit </button>";
                                bindEditButton(response[i].id, response[i].name, response[i].weight, response[i].reps, response[i].units, response[i].date);
                                var cell = tRow.insertCell(-1);
                                cell.innerHTML = "<button type='button' name='Delete Button' id='deleteButton" + response[i].id + "'> Delete</button>";
                                bindDeleteButton(response[i].id);
                            }
                        }
                    }
                } else {
                    console.log('Error');
                }
            } else {
                console.log("Error! " + req.statusText);
            }
        });
        req.send(null);
    });
}

//Just binds the Add button. The AJAX request is made in the addItem() function.
//It's formatted thisway because of expirements with Promises. Pay no mind. Will fix in later release ;)
function bindButtons() {
    document.getElementById('addExercise').addEventListener('click', function (event) {
        return(addItem());
//        var req = new XMLHttpRequest();
//        //get zipCode from form
//        //get countryCode from form
//        let payload = {name: null, reps: null, weight: null, unit: null, date: null};
//        payload.name = document.getElementById('name').value;
//        payload.reps = document.getElementById('reps').value;
//        payload.weight = document.getElementById('weight').value;
//        payload.unit = document.getElementById('unit').value;
//        payload.date = document.getElementById('date').value;
//        console.log(payload);
//        if (payload.name === ''){ console.log ('Name cannot be empty!');}
//        else{
//            reqURL = nodeURL + 'insert' + '?name=' + payload.name + '&reps=' + payload.reps + '&weight=' + payload.weight + '&unit=' + payload.unit + '&date=' + payload.date;
//            console.log(reqURL);
//
//            console.log('add exercise button bound');
//            req.open('GET', reqURL, true);
//            req.addEventListener("load", function () {
//                if (req.status >= 200 && req.status < 400) {
//                    if (req.responseText !== '') {
//                        console.log(JSON.parse(req.responseText));
//                        let response = JSON.parse(req.responseText);
//                        console.log('response' + response);
//                        console.log('response name' + response.name);
//                        showTable();
//                    } else {
//                        console.log('error');
//                    }
//                } else {
//                    console.log("Error! " + req.statusText);
//                }
//            });
//            req.send(JSON.stringify(payload));
//            showTable();
//            event.preventDefault(); //prevents submission "on click" and stops webpage from reloading
//        }
    });
}
;

//Makes asynchronous AJAX request to insert row into the SQL table. Passes
//HTML field data and provides some light logic to prevent the Name field from
//ebing empty
function addItem(){
    return new Promise(function(resolve, reject){
        var req = new XMLHttpRequest();
        //get zipCode from form
        //get countryCode from form
        let payload = {name: null, reps: null, weight: null, unit: null, date: null};
        payload.name = document.getElementById('name').value;
        payload.reps = document.getElementById('reps').value;
        payload.weight = document.getElementById('weight').value;
        payload.unit = document.getElementById('unit').value;
        payload.date = document.getElementById('date').value;
        console.log(payload);
        //Name can't be empty.
        if (payload.name === ''){ console.log ('Name cannot be empty!');}
        else{
            reqURL = nodeURL + 'insert' + '?name=' + payload.name + '&reps=' + payload.reps + '&weight=' + payload.weight + '&unit=' + payload.unit + '&date=' + payload.date;
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
                        console.log('error');
                    }
                } else {
                    console.log("Error! " + req.statusText);
                }
            });
            req.send(null);

            showTable();
        }
    });
};


//Binds AJAX request to the Delete button. Requests the server to delete the row
//with matching ID
function bindDeleteButton(idButton) {
//    console.log('idButton ' + idButton);
    return new Promise(function (resolve, reject) {
        document.getElementById('deleteButton' + idButton).addEventListener('click', function (event) {
            var req = new XMLHttpRequest();
            
            reqURL = nodeURL + 'delete' + '?rowId=' + idButton;
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
            showTable();
        });
    });
}
;

//Inserts a row below the row to be edited. Populates with fields to capture
//update data. Then, allows the data updates to be submitted.
function bindEditButton(idButton, name, weight, reps, unit, date) {
    //var editButton = getElementById = 'editButton' + idButton;
    
    //Bind Edit Button and manipulate DOM fields to create 'edit' row.
    document.getElementById('editButton' + idButton).addEventListener('click', function (event) {

        var editButton = document.getElementById('editButton'+idButton);
        editButton.disabled = true;
        
        //specifies which row to edit
        var table = document.getElementById('table');
        var currentRow = document.getElementById('row'+idButton);
        var tRow = table.insertRow(currentRow.rowIndex+1); //inserts Row at last position
        tRow.style.border = 'thick solid black';
        tRow.id = 'editRow';
        var cell = tRow.insertCell(-1);

        //Insert Edit Fields
        cell.innerHTML = "<input type='text' style='width:96px' id='editName' placeholder='" + name + "'>";
        var cell = tRow.insertCell(-1);
        cell.innerHTML = "<input type='number' style='width:75px' id='editReps' placeholder='" + reps + "'>";
        var cell = tRow.insertCell(-1);
        cell.innerHTML = "<input type='number' style='width:45px' id='editWeight' placeholder='" + weight + "'>";
        var cell = tRow.insertCell(-1);
        cell.innerHTML = "<select id='editUnit' placeholder = '" + unit + "'><option value = 1> lbs </option><option value = 0> kg </option></select>";
        var cell = tRow.insertCell(-1);
        cell.innerHTML = "<input type='date' style='width:125px' id='editDate' placeholder='" + date.slice(0,10) + "'>";
        var cell = tRow.insertCell(-1);

        //Insert Edit Submit button
        cell.innerHTML = "<button type='button' name='Submit Edit' id='submitEditButton" + idButton + "'> Submit Edit </button>";

        //Bind request to UPDATE SQL table to AJAX Request and make request
        document.getElementById('submitEditButton' + idButton).addEventListener('click', function (event) {
            editName = document.getElementById('editName').value;
            editReps = document.getElementById('editReps').value;
            editWeight = document.getElementById('editWeight').value;
            editUnit = document.getElementById('editUnit').value;
            editDate = document.getElementById('editDate').value;
            editButton.id = 'editButton'+idButton;

            var req = new XMLHttpRequest();
//            reqURL = nodeURL + 'delete' + '?rowId=' + idButton;

            reqURL = nodeURL + 'edit' +'?name=' + editName + '&reps=' + editReps + '&weight=' + editWeight + '&unit=' + editUnit + '&date=' + editDate + '&id=' + idButton;
            console.log('reqURL:', reqURL);

            //Make AJAX Request
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
        showTable();
        });
    });
}
;