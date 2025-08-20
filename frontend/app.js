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
	const res = await fetch("http://localhost:5500/tasks");
	const tasks = await res.json();
	listElement.innerHTML = '';
	tasks.forEach(addTaskToDom);
}

async function createTask(tasktext, priority, deadline, tasktype){
	const res = await fetch("http://localhost:5500/tasks", {
		method: "POST",
		headers: {"Content-Type":"application/json"},
		body: JSON.stringify({tasktext, priority, deadline, tasktype}),
	});
	const newTask = await res.json();
	addTaskToDom(newTask);
}

function addTaskToDom (task){
	const completedStyle = task.completed ? 'style="background: #89FC00;"' : '';
	const textStyle = task.completed ? 'style="text-decoration: line-through; color: #484848;"' : '';
	const displayDate = task.deadline ? task.deadline.split('T')[0] : '';
	listElement.insertAdjacentHTML("beforeend", `
        <li data-id="${task.id}"  ${completedStyle}>
			<div class="item_content text_style">
				<span ${textStyle}><u>Task:</u> <strong>${task.tasktext}</strong></span>
		  		<span ${textStyle}><u>Priority:</u> <strong>${task.priority}</strong></span>
				<span ${textStyle}><u>Deadline:</u> <strong>${displayDate}</strong></span>
				<span ${textStyle}><u>Type of task:</u> <strong>${task.tasktype}</strong></span>
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

listElement.addEventListener("click", async (event) => {
	event.preventDefault();
	const target = event.target;

	if (target.classList.contains("success")){
		const listItem = target.closest("li");
		const taskId = listItem.dataset.id;
		try {
			const res = await fetch(`http://localhost:5500/tasks/${taskId}`, {
				method : "PUT",
				headers: {"Content-Type":"application/json"}
			});
			if (res.ok){
				listItem.style.background = "#89FC00";
				const spans = listItem.querySelectorAll(".item_content span");
				spans.forEach(span => {
					span.style.textDecoration = "line-through";
					span.style.color = "#484848";
				});
			}
		}
		catch (err){
			console.error(err);
		}
	}
	if (target.classList.contains("delete")){
		let question = confirm("Are you sure you want to delete this task?");
		if (question){
			const listItem = target.closest("li");
			const taskId = listItem.dataset.id;
			try {
				const res = await fetch(`http://localhost:5500/tasks/${taskId}`, {
					method: "DELETE",
				});
				if (res.ok){
					listItem.remove();
				}
			}
			catch (err){
				console.error(err);
			}
		}
	}

});

function createModal(title, options, callback) {
	const modal = document.createElement("div");
	modal.style.position = "fixed";
	modal.style.top = "0";
	modal.style.left = "0";
	modal.style.width = "100%";
	modal.style.height = "100%";
	modal.style.backgroundColor = "rgba(0,0,0,0.5)";
	modal.style.display = "flex";
	modal.style.justifyContent = "center";
	modal.style.alignItems = "center";
	modal.style.zIndex = "999";

	const modalContent = document.createElement("div");
	modalContent.style.background = "#FF75D1";
	modalContent.style.padding = "20px";
	modalContent.style.borderRadius = "10px";
	modalContent.style.minWidth = "250px";
	modalContent.style.textAlign = "center";
	modalContent.style.position = "relative";

	const closeBtn = document.createElement("span");
	closeBtn.innerHTML = "&times;";
	closeBtn.style.position = "absolute";
	closeBtn.style.top = "10px";
	closeBtn.style.right = "15px";
	closeBtn.style.cursor = "pointer";
	closeBtn.style.fontSize = "20px";

	const h2 = document.createElement("h2");
	h2.innerText = title;

	modalContent.appendChild(closeBtn);
	modalContent.appendChild(h2);


	options.forEach(opt => {
		const btn = document.createElement("button");
		btn.classList.add("success");
		btn.innerText = opt.label;
		btn.style.width = "200px";
		btn.style.display = "block";
		btn.style.margin = "10px auto";
		btn.addEventListener("click", () => {
		callback(opt.value);
		document.body.removeChild(modal);
		});
		modalContent.appendChild(btn);
	});

	modal.appendChild(modalContent);
	document.body.appendChild(modal);

	closeBtn.addEventListener("click", () => document.body.removeChild(modal));
	modal.addEventListener("click", e => {
		if (e.target === modal) document.body.removeChild(modal);
	});
}

const filterBtn = document.querySelector('.filter')
const sortBtn = document.querySelector('.sort');
const downloadTxtBtn = document.querySelector('.download');

filterBtn.addEventListener("click", (event) => {
	event.preventDefault();
	createModal("Filter Tasks", [
		{label: "High priority", value: "High"},
		{label: "Medium priority", value: "Mid"},
		{label: "Low priority", value: "Low"}
	], async (priority) => {
		const result = await fetch(`http://localhost:5500/tasks?priority=${priority}`);
		const tasks = await result.json();
		listElement.innerHTML = '';
		tasks.forEach(addTaskToDom);
	});
});

sortBtn.addEventListener("click", (event) => {
	event.preventDefault();
	createModal("Sort tasks", [
		{label: "By date", value: "date"},
		{label: "By priority", value: "priority"},
		{label: "By Type", value: "type"}
	], async (sortBy) => {
		const result = await fetch(`http://localhost:5500/tasks?sortBy=${sortBy}`);
		const tasks = await result.json();
		listElement.innerHTML = '';
		tasks.forEach(addTaskToDom);
	});
});