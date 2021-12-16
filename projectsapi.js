var Project = require('./project.js').Project;
var ProjectList = require('./project.js').ProjectList;
var https = require('https');

class Project_API {
    constructor (latitude, longitude, distance = 10) {
        // User's latitude
        this.latitude = latitude;
        // User's longitude
        this.longitude = longitude;
        // Distance away from user trails will be found
        this.distance = distance;
        // Sarah's Trail Data API key
        this.keys = '200980056-37c2769698383bb98c9b48965aa68f84';
        // The full URL for the request
        this.url = `https://www.hikingproject.com/data/get-trails?lat=${this._latitude}&lon=${this._longitude}&maxDistance=${this._distance}&key=${this._keys}`;
        this.searchTrails()
        .then(console.log("Trails received"))
        .catch(err => console.log(err));
    }

    makeProjectsList(projectData){
        console.log(projectData);
        this.allProjects = new ProjectList();
        for (var i = 0; i < projects.getLength(); i++) {
            // Projects arguments (name, distanceAway, length, elevation, description, latitude, longitude, difficulty)
            var aProject = new Project(projects[i].name,
                0,
                trails[i].length,
                trails[i].height,
                trails[i].summary,
                trails[i].latitude,
                trails[i].longitude,
                trails[i].difficulty)
                this.allProjects.addProject(aProject);
        }
    }
    
    searchProjects(){
        return new Promise((resolve, reject) => {
            https.get(this.url, res => {
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
        // Returns a TrailList object
        
    }

    getProjects(){
        var ProjectArray = [];
        for (var i = 0; i < this.allTrails.getLength(); i++){
            trailArray.append(this.allTrails.getTrail(i));
        }
        return trailArray;
    }

}

module.exports.Project_API = Project_API;