//class for storing Project data
class Project{
	constructor(projectId, title, owner, percentComplete, status, dueDate){
		this.projectId = projectId;
        this.title = title;
		this.owner = owner;
		this.percentComplete = percentComplete;
		this.status = status;
		this.dueDate = dueDate;
	}
	get getProjectID(){
		return this.projectId;
	}
	get getTitle(){
		return this.title;
	}
	get getOwner(){
		return this.owner;
	}
	get getPercentComplete(){
		return this.percentComplete;
	}
	get getStatus(){
		return this.status;
	}
	get getDueDate(){
		return this.dueDate;
	}
}

//class for the list of projects
class ProjectList{
	constructor(){
		this.projects = [];
	}
	addProject(newProject){
			this.projects.push(newProject);
	}
	getProject(index){
		return this.projects[index];
	}
	deleteTrail(index){
		for(var i = index; i < projects.length-1; i++){
			this.projects[i] = this.projects[i+1];
		}
		this.projects.pop();
	}
	get getLength(){
		return this.projects.length;
	}
}

module.exports.Project = Project;
module.exports.ProjectList = ProjectList;