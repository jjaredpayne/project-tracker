const baseURL = 'http://flip3.engr.oregonstate.edu:8157/';
const table = document.getElementById('projectTable');

var nodeURL = 'http://flip3.engr.oregonstate.edu:8916/';


const toggleButton = (makeUpdate, id) => {
    var parentCell = makeUpdate.parentNode;
    var text = document.createTextNode("Submit");

    var newButton = document.createElement("button")
    newButton.setAttribute("id", id);
    newButton.appendChild(text);

    parentCell.replaceChild(newButton, parentCell.firstChild);
};

const enableFields = (row) => {

    row.querySelector('[name="name"]').disabled = false;
    row.querySelector('[name="reps"]').disabled = false;
    row.querySelector('[name="weight"]').disabled = false;
    row.querySelector('[name="unit"]').disabled = false;
    row.querySelector('[name="date"]').disabled = false;
};

table.addEventListener('click', async (event) => {
    const target = event.target.closest('button');

    if (!target) return;

    let row = target.parentNode.parentNode;

    if (target.id == "update"){
        toggleButton(target, "edit");
        enableFields(row);
    }

    if (target.id == "edit") {
        console.log(row.id);
        console.log("Registered you hit the delete button");
        let str = {
            title: row.querySelector('[name="title"]').value,
            owner: row.querySelector('[name="owner"]').value,
            percentComplete: row.querySelector('[name="percentComplete"]').value,
            status: row.querySelector('[name="status"]').value,
            dueDate: row.querySelector('[name="dueDate"]').value,
            id: row.id
        }
        
        console.log(str);
            
        let response = await fetch(baseURL, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(str)
        });
        let result = await response.json();

        location.reload();
    }

    else if (target.id == "delete") {
        console.log("Registered you hit the delete button");
        let payload = {
            id: target.value
        };

        console.log(typeof payload);

        let response = await fetch(baseURL, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        event.preventDefault();

        location.reload();
    }

    return;
});

// adds a project
function addProject(){
    console.log("addProject")
    return new Promise(function(resolve, reject){
        var req = new XMLHttpRequest();
        //get zipCode from form
        //get countryCode from form
        let payload = {title: null, owner: null, status: null, dueDate: null};
        payload.title = document.getElementById('inputProjectTitle').value;
        payload.percentComplete = 0;
        payload.dueDate = document.getElementById('inputDuedate').value;
        payload.status = document.getElementById('inputStatus').value;
        payload.owner = document.getElementById('inputOwner').value;
        console.log(payload);
        
        //Owner can't be empty.
        if (payload.owner === ''){ console.log ('Owner cannot be empty!');}
        else{
            reqURL = nodeURL + 'insertemployee' + '?firstName=' + payload.firstName + '&lastName=' + payload.lastName;
            console.log(reqURL);
            req.open('POST', reqURL, true);
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
        }
    });

    location.reload();
};

//displays projects
function displayProjects(){
    nodeURL = 'http://flip3.engr.oregonstate.edu:8157/'
    console.log("displayProjects");
    return new Promise(function(resolve, reject){
        var req = new XMLHttpRequest();
        //get zipCode from form
        //get countryCode from form
        let payload = {projectId: null, title: null, owner: null, percentComplete: null, status: null, dueDate: null};

        console.log(payload);

        //Name can't be empty.
        console.log(nodeURL);
        req.open('GET', nodeURL, true);
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