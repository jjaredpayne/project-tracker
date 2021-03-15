const baseURL = 'http://flip2.engr.oregonstate.edu:48157/projectlist.html';
const table = document.getElementById('projectTable');

table.addEventListener('click', async (event) => {
  const target = event.target.closest('button');

  if (!target) return;

  let row = target.parentNode.parentNode;

  if (target.id == "edit") {
      console.log(row.id);
      console.log("Registered you hit the edit button");
      let str = {
          title: row.querySelector('[name="title"]').value,
          percentComplete: row.querySelector('[name="percentComplete"]').value,
          status: row.querySelector('[name="status"]').value,
          dueDate: row.querySelector('[name="dueDate"]').value,
          id: row.id
      }
      
      console.log(str);
          
      let response = await fetch('/projectlist.html', {
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

  else if (target.id == "delete") {
      console.log("Registered you hit the delete button");
      let payload = {
          id: row.id
      };

      console.log(typeof payload);

      let response = await fetch('/projectlist.html', {
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
;
