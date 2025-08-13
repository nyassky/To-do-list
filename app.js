const taskInput = document.getElementById("task");
const dateChoice = document.getElementById("date");
const priorityChoice = document.getElementById("priority");
const typeOfTask = document.getElementById("type_of_task");
const listElement = document.getElementById("list");
const addTask = document.getElementById("add_task");
const btnSuccess = document.querySelector(".success");
const btnDelete = document.querySelector(".delete");
const templateLi = document.querySelector(".template");

function getTask (){
	listElement.insertAdjacentHTML("beforeend", `
        <li class="">
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
addTask.addEventListener("click", function (event){
	event.preventDefault();

	if (!taskInput.value || !dateChoice.value || !priorityChoice.value || !typeOfTask.value) {
    	alert("Пожалуйста, заполните все поля!");
    	return;
  	}

	getTask();

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
		const listItem = target.closest("li");
		listItem.remove();
	}

});

