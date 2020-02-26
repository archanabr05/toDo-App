let toDoList = [
    {
        listID: 1,
        listName: "List-1",
        listTasks: [
            {
                taskID: 1,
                taskName: "Task-1",
                taskStatus: "completed"
            },
            {
                taskID: 2,
                taskName: "Task-2",
                taskStatus: "pending"
            }
        ]
    },
    {
        listID: 2,
        listName: "List-2",
        listTasks: [
            {
                taskID: 1,
                taskName: "Task-1",
                taskStatus: "pending"
            },
            {
                taskID: 2,
                taskName: "Task-2",
                taskStatus: "completed"
            },
            {
                taskID: 3,
                taskName: "Task-3",
                taskStatus: "pending"
            }
        ]
    }
]
let activeListID = 0;
document.getElementsByClassName('listOfTodoTasksDiv')[0].style.display = 'none';


/* function populateTasks: to populate all the tasks in a list */
let populateTasks = (id) => {
    var obj = toDoList.find(i => i.listID == id);   
    if(obj) {
        document.getElementById('task').innerHTML = '';
        for(let i = 0; i < obj.listTasks.length; i++) {
            createNodeLi(obj.listTasks[i], 'task');
        }
    } 
}

/* function setListID: to populate all the tasks in the list */
/* When any list is clicked the event is fired and callback the function setListID, this will get the ID of the list item clicked
 and populates all the tasks from that list and sets the current active list ID*/
let setListID = (objDOM) => {
    let obj = objDOM.target.parentNode;
    document.getElementsByClassName('listOfTodoTasksDiv')[0].style.display = 'block';
    activeListID = obj.id;
    populateTasks(obj.id);
    document.getElementsByClassName('taskListDisplay')[0].style.display = 'block';
}

/* function prepareToDoListTable: preparing the todo app table with all the list data and setting the activeListID */
let prepareToDoListTable = (updateActiveListID) => {
    document.getElementById('list').innerHTML = '';
    let toDoListVariable = toDoList;
    for(let i = 0; i < toDoListVariable.length; i++) {
        let li = createNodeLi(toDoListVariable[i], 'list');
    }
    if(toDoList.length != 0 && updateActiveListID) {
        activeListID = toDoList[0].listID;
    }
}

function createNodeLi(item, parent) {
    if (parent === 'list') {
        if ('content' in document.createElement('template')) {
            const template = document.querySelector('#listRow');

            let ul = document.querySelector("#list");
            let clone = template.content.cloneNode(true);
            let li = clone.querySelectorAll("li");
            li[0].id = item.listID;
            li[0].children[0].innerText =  item.listName;
            ul.appendChild(clone);
        }
    } else if (parent === 'task') {
        if ('content' in document.createElement('template')) {
            const template = document.querySelector('#listTaskRow');

            let ul = document.querySelector("#task");
            let clone = template.content.cloneNode(true);
            let li = clone.querySelectorAll("li");
            li[0].id = item.taskID;
            if(createNodeLi.caller.name == 'populateTasks') {
                if(item.taskStatus == 'completed') {
                    li[0].children[0].checked = true;
                } 
                else if(item.taskStatus == 'pending') {
                    li[0].children[0].checked = false;
                }
            }
            li[0].children[1].innerText =  item.taskName;
            ul.appendChild(clone);
        }
    }
}


class ToDoList {
}

ToDoList.prototype.createNewListItem = () => {
    let listObj;
    let listName = document.getElementsByClassName("addListInput")[0].value;
    if(listName.length == 0) {
        alert('Enter List Name');
    } else {
        let listID = (Math.random() * 1000).toFixed(0);
        while(toDoList.find(i => i.listID == listID)) {
            listID = (Math.random() * 1000).toFixed(0);
        }

        listObj = {
            listID: listID,
            listName: listName,
            listTasks: []
        }

        toDoList.push(listObj);
        let copyOfToDoList = [...toDoList];
        let newListItem = copyOfToDoList.pop();
        createNodeLi(newListItem, 'list');
        document.getElementsByClassName("addListInput")[0].value = '';
    }
};

ToDoList.prototype.createNewTask = () => {
    let taskObj;
    let taskName = document.getElementsByClassName("addTaskInput")[0].value;
    if(taskName.length == 0) {
        alert('Enter Task Name');
    } else {
        let taskID = (Math.random() * 1000).toFixed(0);
        let listObj = toDoList.find(listObjItem => listObjItem.listID == activeListID);

        while(listObj.listTasks.find(i => i.taskID == taskID)) {
            taskID = (Math.random() * 1000).toFixed(0);
        }

        taskObj = {
            taskID: taskID,
            taskName: taskName,
            taskStatus: 'pending'
        }

        listObj.listTasks.push(taskObj);
        document.getElementById('task').innerHTML = '';
        populateTasks(activeListID);
        document.getElementsByClassName("addTaskInput")[0].value = '';
    }
}

ToDoList.prototype.updateTaskStatus = (e) => {
    let taskID = e.target.parentNode.id;

    let listIndex = toDoList.findIndex(listObjItem => listObjItem.listID == activeListID);
    let taskIndex = toDoList[listIndex].listTasks.findIndex(taskObjItem => taskObjItem.taskID == taskID);
      
    if(e.target.checked) {  
        toDoList[listIndex].listTasks[taskIndex].taskStatus = "completed";
    } else {
        toDoList[listIndex].listTasks[taskIndex].taskStatus = "pending";
    }
    populateTasks(activeListID); 
}

ToDoList.prototype.removeList = (e) => {
    let listIndex = toDoList.findIndex(listObjItem => listObjItem.listID == e.target.parentNode.id);
    toDoList.splice(listIndex, 1);
    prepareToDoListTable(false);
    populateTasks(activeListID);
    if(e.target.parentNode.id == activeListID || toDoList.length == 0) {
        document.getElementsByClassName('listOfTodoTasksDiv')[0].style.display = 'none';
        document.getElementsByClassName('taskListDisplay')[0].style.display = 'none';
    } 
}

ToDoList.prototype.removeTask = (e) => {
    let listIndex = toDoList.findIndex(listObjItem => listObjItem.listID == activeListID);
    let taskIndex = toDoList[listIndex].listTasks.findIndex(taskObjItem => taskObjItem.taskID == e.target.parentNode.id);
    toDoList[listIndex].listTasks.splice(taskIndex, 1);
    populateTasks(activeListID);
}

function addEditable(e) {
    checkOtherEditable();
    e.target.contentEditable = true;
    e.target.focus();
    e.target.classList.add('span-edit');
    e.target.nextElementSibling.classList.remove('edit-hide');
    e.target.nextElementSibling.classList.add('edit-show');
}

function checkOtherEditable() {
    let li = document.getElementById('task').children;
    for(i = 0; i < li.length; i++) {
        if(li[i].children[1].contentEditable) {
            li[i].children[1].contentEditable = false;
            li[i].children[1].classList.remove('span-edit');
            li[i].children[2].classList.remove('edit-show');
            li[i].children[2].classList.add('edit-hide');
        }
    }
}

ToDoList.prototype.editTask = (e) => {
    let newTaskName = e.target.previousElementSibling.innerHTML;
    let currentTaskID = e.target.parentNode.id;

    let listIndex = toDoList.findIndex(listObjItem => listObjItem.listID == activeListID);
    let taskObj = toDoList[listIndex].listTasks.find(taskObjItem => taskObjItem.taskID == currentTaskID);
    taskObj.taskName = newTaskName;
    populateTasks(activeListID);
}

let newList = new ToDoList();

prepareToDoListTable(true);




