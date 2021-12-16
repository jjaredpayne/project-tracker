//class for storing Project data
class Task{
	constructor(taskId, title, taskDetails, developerID, owner, satisfaction, dueDate){
		this.taskId = taskId;
        this.title = title;
        this.taskDetails = taskDetails;
		this.developerID = developerID;
        this.owner = owner;
		this.satisfaction = satisfaction;
		this.dueDate = dueDate;
	}
	get getTaskID(){
		return this.taskId;
	}
	get getTitle(){
		return this.title;
	}
	get getTaskDetails(){
		return this.taskDetails;
	}
	get getDeveloperIC(){
		return this.developerID;
	}
	get getOwner(){
		return this.owner;
	}
    get getSatisfaction(){
        return this.satisfaction;
    }
	get getDueDate(){
		return this.dueDate;
	}
}

//class for the list of projects
class TaskList{
	constructor(){
		this.tasks = [];
	}
	addTask(newTask){
			this.tasks.push(newTask);
	}
	getTask(index){
		return this.tasks[index];
	}
	deleteTask(index){
		for(var i = index; i < tasks.length-1; i++){
			this.tasks[i] = this.tasks[i+1];
		}
		this.tasks.pop();
	}
	get getLength(){
		return this.tasks.length;
	}
}

module.exports.Task = Task;
module.exports.TaskList = TaskList;