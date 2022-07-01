const taskInput = document.querySelector(".task-input input"),
    filters = document.querySelectorAll(".filters span"),
    clearAll = document.querySelector(".clear-btn"),
    taskBox = document.querySelector(".task-box");

let editId;
let isEditedTask = false;

//Getting local storage todo-list
let todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function showTodo(filter) {
    let li = "";
    if (todos) {
        todos.forEach((todo, id) => {
            //if todo status is completed, set the isCompleted value to checked
            let isCompleted = todo.status == "completed" ? "checked" : "";
            if (filter == todo.status || filter == "all") {
                li += `<li class="task">
                        <label for="${id}">
                          <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                          <p class="${isCompleted}">${todo.name}</p>
                        </label>
                        <div class="settings">
                            <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                            <ul class="task-menu">
                                <li onclick="editTask(${id}, '${todo.name}')"><i class="uil uil-pen"></i>Edit</li>
                                <li onclick="deleteTask(${id})"><i class="uil uil-trash"></i>Delete</li>
                            </ul>
                        </div>
                    </li>`;
            }
        });
    }
    //if li is not empty,insert this value inside taskbox else insert span
    taskBox.innerHTML = li || `<span>You don't have any task here</span>`;
}

showTodo("all");

const showMenu = function (selectedTask) {
    //Getting task menu div
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener("click", e => {
        //Removing show class from the task menu on the document click
        if (e.target.tagName != "I" || e.target != selectedTask) {
            taskMenu.classList.remove("show");
        }
    });
}

//Edit the task
const editTask = function (taskId, taskName) {
    editId = taskId;
    isEditedTask = true;
    taskInput.value = taskName;
}

const deleteTask = function (deleteId) {
    //Removing selected task from the array/todos
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
}

clearAll.addEventListener("click", () => {
    //Removing all items of array/todos
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
});


const updateStatus = function (selectedTask) {
    //Getting paragraph that contains the task name
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed"; //updating the status of the selected task to completed
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";  //updating the status of the selected task to completed
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}


function taskAdd() {
    let taskField = document.getElementById("newTask");
    let inputDate = document.getElementById("due-date").value;
    const taskItem = document.createElement("p");
    let userTask = taskInput.value.trim();
    if (userTask) {
        if (!isEditedTask) {   //If is editedTask is not true
            if (!todos) {      //if todos doesn't exist, pass an empty array to todos
                todos = [];
            }

            //Add the due date of the task to be completed
            if (inputDate != '') {
                userTask = userTask + " by " + inputDate
            }

            let taskInfo = { name: userTask, status: "pending" };
            todos.push(taskInfo);//Adding new task to todos

        } else {
            isEditedTask = false;
            todos[editId].name = userTask;
        }

        //Clear the input
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo("all");

    }
    let addtoTasks = document.createTextNode(taskField);
    taskItem.appendChild(addtoTasks);

}
