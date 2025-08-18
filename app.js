const taskInput = document.getElementById("task");
const dateChoice = document.getElementById("date");
const priorityChoice = document.getElementById("priority");
const typeOfTask = document.getElementById("type_of_task");
const listElement = document.getElementById("list");
const addTask = document.getElementById("add_task");
const btnSuccess = document.querySelector(".success");
const btnDelete = document.querySelector(".delete");
const templateLi = document.querySelector(".template");

const menu = document.querySelector(".menu");
const burgerMenuBtn = document.querySelector(".menu_toggle");
const menuItems = document.querySelectorAll(".menu_item");
const burgerMenuOpen = document.querySelector(".menu_icon");
const burgerMenuClose = document.querySelector(".close_icon");

function toggleMenu() {
	menu.classList.toggle("showMenu");

	const isOpen = menu.classList.contains("showMenu");
	burgerMenuClose.style.display = isOpen ? "block" : "none";
	burgerMenuOpen.style.display = isOpen ? "none" : "block";
}
burgerMenuBtn.addEventListener("click", toggleMenu);
menuItems.forEach(menuItem => {
	menuItem.addEventListener("click", toggleMenu);
});


async function fetchTasks() {
	const res = await fetch("http://localhost:5500");
	const tasks = await res.json();
	listElement.innerHTML = '';
	tasks.forEach(addTaskToDom);
}

async function createTask(taskText, priority, deadline, taskType){
	const res = await fetch("http://localhost:5500", {
		method: "POST",
		headers: {"Content-Type":"application/json"},
		body: JSON.stringify({tasktext, priority, deadline, taskType}),
	});
	const newTask = await res.json();
	addTaskToDom(newTask);
}

function addTaskToDom (){
	listElement.insertAdjacentHTML("beforeend", `
        <li data-id=@${task.id}"class="">
			<div class="item_content text_style">
				<span><u>Task:</u> <strong>${taskInput.value}</strong></span>
		  		<span><u>Priority:</u> <strong>${priorityChoice.value}</strong></span>
				<span><u>Deadline:</u> <strong>${dateChoice.value}</strong></span>
				<span><u>Type of task:</u> <strong>${typeOfTask.value}</strong></span>
			</div>
          	<div class="item_actions">
            	<button class="success">&check;</button>
            	<button class="delete">&times;</button>
          	</div>
        </li>
	`)
}
function clearAll() {
	taskInput.value = '';
    dateChoice.value = '';
    priorityChoice.value = '';
    typeOfTask.value = '';
}
fetchTasks();
addTask.addEventListener("click", async function (event){
	event.preventDefault();

	if (!taskInput.value || !dateChoice.value || !priorityChoice.value || !typeOfTask.value) {
    	alert("Please fill in all fields!");
    	return;
  	}

	await createTask(taskInput.value, priorityChoice.value, dateChoice.value, typeOfTask.value);

	clearAll();
});

listElement.addEventListener("click", (event) => {
	event.preventDefault();
	const target = event.target;

	if (target.classList.contains("success")){
		const listItem = target.closest("li");
		listItem.style.background = "#89FC00";
		const spans = listItem.querySelectorAll(".item_content span");
		spans.forEach(span => {
			span.style.textDecoration = "line-through";
			span.style.color = "#484848";
		});
	}
	if (target.classList.contains("delete")){
		let question = confirm("Are you sure you want to delete this task?");
		if (question){
			const listItem = target.closest("li");
			listItem.remove();
		}
	}

});

const filterBtn = document.querySelector('.filter')
const sortBtn = document.querySelector('.sort');
const downloadTxtBtn = document.querySelector('.download');

filterBtn.addEventListener("click", (event) => {
	event.preventDefault();
	
})