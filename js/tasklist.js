const baseURL = 'http://flip2.engr.oregonstate.edu:48157/projectlist.html';
const table = document.getElementById('taskTable');
const completeTable = document.getElementById('completeTaskTable')

table.addEventListener('click', async (event) => {
  const target = event.target.closest('button');

  if (!target) return;

  let row = target.parentNode.parentNode;

  if (target.id == "create-row"){
      createAddRow(row);
  }

  if (target.id == "edit") {
      console.log(row.id);
      console.log("Registered you hit the edit button");
      let str = {
          title: row.querySelector('[name="title"]').value,
          comments: row.querySelector('[name="taskDetails"]').value,
          dueDate: row.querySelector('[name="dueDate"]').value,
          id: target.value
      }
      
      console.log(str);
          
      let response = await fetch('/tasklist.html', {
          method: "PUT",
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(str)
      });
      let result = await response.json();
      console.log(result);

      location.reload();
  }

  else if(target.id =="add"){
      console.log("Registered you hit the submit button!");

      let str = {
          title: row.querySelector('[name="title"]').value,
          comments: row.querySelector('[name="comments"]').value,
          project: row.querySelector('[name="project"]').value,
          dueDate: row.querySelector('[name="dueDate"]').value,
      }


      let response = await fetch('tasklist.html', {
          method: "POST",
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(str)
      });
      let result = await response.json();
      console.log(result);

      location.reload();
  }

  else if (target.id == "complete"){
      location.reload();
  }

  else if (target.id == "delete") {
      console.log("Registered you hit the delete button");
      let payload = {
          id: target.value
      };

      console.log(payload);

      let response = await fetch('/tasklist.html', {
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

async function createAddRow(row) {

    let projects = await getData("project");

    console.log(developers);
    console.log(projects);

    let newForm = createNewForm(projects, developers);

    row.innerHTML = newForm;
}

async function getData(path)
{
    if (path == "project"){
        let response = await fetch('/getProjects', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let results = await response.json();

        var data = results;
        console.log(data);
        return data;
    }

    else {
        return;
    }
}

function createNewForm(projects){

    var createForm = "<form action='/tasklist.html' id='addTask' method='post'>"
    var createTitle = "<td><input type='text' id='title' name='title'></input></td>"
    var createCommentsCell = "<td><input type='text' id = 'comments' name='comments'></input></td>"
    let createProjectCell = "<td>"+makeDropDown("project", projects)+"</td>"
    var createDueDateCell = "<td><input type='Date' name='dueDate'></input></td>"
    var createSubmit = "<td><button type='submit' class='btn btn-outline-secondary mb-2 btn-sm tableButton' id='add'>Submit Task</button></td>";

    var newRow = createForm + createTitle + createCommentsCell + createProjectCell + createDueDateCell + createSubmit

    return newRow;
}

function makeDropDown(path, data) {
    var newSelect = "<select name='"+path+"' id='"+path;
        if (path == "project"){
            newSelect = newSelect+" required";
        }

    newSelect = newSelect+">"

    for (const key in data) {
        option = "<option value='"+data[key].id+"'>"+data[key].name+"</option>";
        newSelect = newSelect + option;
    }

    newSelect = newSelect + "</select>"

    console.log(newSelect);

    return newSelect;
}