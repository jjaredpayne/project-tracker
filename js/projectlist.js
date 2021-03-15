const baseURL = 'http://flip2.engr.oregonstate.edu:48157/projectlist.html';

  //Inserts a row below the row to be edited. Populates with fields to capture
//update data. Then, allows the data updates to be submitted.
function bindEditButton(projectID, title, percentComplete, status, dueDate) {
    console.log("edit button " + projectID + " " + title);
    //Bind Edit Button and manipulate DOM fields to create 'edit' row.
    document.getElementById('editButton' + projectID).addEventListener('click', function (event) {
        console.log("edit button");
        var editButton = document.getElementById('editButton'+projectID);
        editButton.disabled = true;
        
        //specifies which row to edit
        var tRow = document.getElementById('row'+projectID);
        //Insert Edit Fields

        var createForm = "<form action='/updateProject' id='updateProject' method='put'>"
        var createTitleCell = "<td><input type='text' form='updateProject' class='form-control' id='editTitle' name='title' value='" + title + "'></input></td>"
        var createPercentCompleteCell = "<td><input type='text' form='updateProject' class='form-control' id='editPercentComplete' name='percentComplete' value='" + percentComplete + "'></input></td>"
        var createStatusCell = "<td><input type='text' form='updateProject' class='form-control' id='editStatus' name='status' value='" + status + "'></input></td>"
        var createDueDateCell = "<td><input type='date' form='updateProject' class='form-control' id='editDueDate' name='dueDate' value='" + dueDate+ "'></input></td>"
        var removeDelete = "<td></td>"
        var createSubmit = "<Button form='updateProject' type='submit' class='btn btn-outline-secondary mb-2 btn-sm tableButton'  name='submitID' id='submitButton" + projectID + "' value='" + projectID + "'>Submit</button>";
        // tRow.innerHTML = createForm + createFirstNameCell + createLastNameCell + createCurrentTasksCell + removeDelete + createSubmit;
        tRow.innerHTML = createForm + createTitleCell+ createPercentCompleteCell + createStatusCell + createDueDateCell + removeDelete + createSubmit;

        // firstNameCell.innerHTML = "<input type='text' class='form-control' id='editFirstName' name='firstName' placeholder='" + firstName + "'>";
        // lastNameCell.innerHTML = "<input type='text' class='form-control' id='editLastName' name='lastName' placeholder='" + lastName + "'>";
        // editCell.innerHTML = "<button type='button' class='btn btn-outline-secondary mb-2 btn-sm tableButton' name='submitEdit' id='submitEditButton" + employeeID + "'> Submit </button>";
    });
}
;
