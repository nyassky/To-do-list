const taskInput = document.getElementById("task");
const dateChoice = document.getElementById("date");
const priorityChoice = document.getElementById("priority");
const typeOfTask = document.getElementById("type_of_task");
const listElement = document.getElementById("list");
const addTask = document.getElementById("add_task");
const btnSuccess = document.getElementById("success");
const btnDelete = document.getElementById("delete");
console.log(taskInput.value)
addTask.onclick = function () {
	if (!taskInput.value || !dateChoice.value || !priorityChoice.value || !typeOfTask.value) {
    	alert("Пожалуйста, заполните все поля!");
    	return;
  	}
	listElement.innerHTML = `
        <li class="">
			<div class="item_content">
				<span>${taskInput.value}</span>
		  		<span>${priorityChoice.value}</span>
				<span>${dateChoice.value}</span>
				<span>${typeOfTask.value}</span>
			</div>
          <div class="item_actions">
            <button id="success">&check;</button>
            <button id="delete">&times;</button>
          </div>
        </li>
	`
}
