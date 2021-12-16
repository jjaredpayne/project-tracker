//modifying code for new project, pls don't take as final product
var Project = require('./project.js').Project;
var ProjectList = require('./project.js').ProjectList;
var https = require('https');
const baseURL = 'http://flip2.engr.oregonstate.edu:####/projectlist.html';

makeProjectList(projectData){
    console.log(projectData);
    var allProjects = new ProjectList();
    for (var i = 0; i < projects.getLength(); i++) {
        // Project arguments (projectId, title, owner, percentComplete, status, dueDate)
        var aProject = new Project(projects[i].projectId,
            projects[i].title,
            projects[i].owner,
            projects[i].percentComplete,
            projects[i].status,
            projects[i].dueDate)
            allProjects.addTrail(aProject);
    }
}

//getting the data to load the page
const getData = async () => {
    return new Promise((resolve, reject) => {
        https.get(baseURL, res => {
            var data = '';
            
            res.on('data', chunk => {
                data += chunk;
            });

            res.on('end', ()=> {
                console.log(data);
                this.makeProjectList(data);
                resolve();
            });         
        }).end();
    })
    // Returns a ProjectList object
    
}


/*if (document.cookie) {
    let userInfo = JSON.parse(document.cookie.slice(12, document.cookie.length));
    let currentUser = new User(userInfo.first, userInfo.last, userInfo.age, userInfo.height, userInfo.weight, 
        userInfo.exercise_time, userInfo.exercise_days, userInfo.hiking_exp, userInfo.health_assess);

    // Make the dropdown filter the Trails
    let dropDown = document.getElementById("forYouDropDown")
    dropDown.addEventListener("change", ()=>{
        let choice = dropDown.value;
        let allTheTrails = document.getElementsByClassName("trail");
        let currentFilter = new ForYouFilter(allTheTrails, currentUser.userRec);
        currentFilter.filterList(choice);
    });
}*/