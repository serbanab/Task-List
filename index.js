
const taskInput = document.getElementById("task-input"),
form = document.querySelector("#form"),
deleteAllBtn = document.querySelector("#btn"),
filterTasks = document.querySelector("#filter-input"),
lista = document.getElementById("list");

class StorageUse{

	constructor(){

	}

	add_to_local_storage(task){

		let vector;
		
		if(localStorage.getItem("task") === null){

			vector = []

		}else {

			vector = JSON.parse(localStorage.getItem("task"));

		}

		vector.push(task.value);
		console.log(vector);
		localStorage.setItem("task",JSON.stringify(vector));

	}

	get_from_local_storage(){

		let vector = [];

		vector =  JSON.parse(localStorage.getItem("task"));

		return vector;

	}

	delete_single_local_storage(vector){

		localStorage.setItem("task",JSON.stringify(vector));

	}

	delete_all_local_storage(){

		const vector = [];
		localStorage.setItem("task",JSON.stringify(vector));

	}

}

class Ui extends StorageUse{

	constructor(){
		super();
	}


	filter_list(filterTasks){

		let vector = [];

const t =  Array.from(lista.children).find(val => {
			
if(val.textContent === filterTasks.value){

	val.className = "list-group-item  d-flex  justify-content-between";

	vector =  Array.from(lista.children).forEach((val2) => {

		if(val2 !== val){
			val2.className = "list-group-item  d-none  justify-content-between";
	
		}
	});

	return val;
}
});

if(!t){

Array.from(lista.children).forEach(val => {

if(!val.textContent.includes(filterTasks.value)){
	
	val.className = "list-group-item  d-none  justify-content-between";

}else{
	
	val.className = "list-group-item  d-flex  justify-content-between"

}
});
}

	}

	build_li(task){

		const li = document.createElement("li");
		const a = document.createElement("a");
		const i = document.createElement("i");
		li.textContent = task.value;
		li.className = "list-group-item  d-flex  justify-content-between";
		i.className = "fa-solid fa-x";
		i.style.color = "red";
		i.style.cursor = "pointer";
		a.appendChild(i);
		li.appendChild(a);
		lista.appendChild(li);

	}

	show_alert(message,classAlert,classIcon){
			
		this.delete_existing_alert(document.querySelector(".alert"));

			const alertBox = document.createElement("div");
			const messageBox = document.createElement("div");
			const i2 = document.createElement("i")

			messageBox.className = "mx-auto";
			messageBox.textContent = `${message} `;
			i2.className = classIcon;
			alertBox.className = ` alert alert-${classAlert} d-flex align-items-center `;

			alertBox.appendChild(messageBox);
			messageBox.appendChild(i2);

			document.querySelector(".card").insertBefore(alertBox,document.querySelector(".card-body"));

			this.delete_alert(alertBox);
			
	}

	load_from_localStorage(vector){
		let output = "";
		vector.forEach(element => {

			const li = `<li class="list-group-item  d-flex  justify-content-between ">${element}<a href=""><i class="fa-solid fa-x" style="color:red" ></i></a></li>`
			output += li;
			
		});
		console.log("LOADING");
		lista.innerHTML = output;
	}

	remove_task(e){
		
		if(e.target.classList.contains("fa-solid")){

			e.target.parentElement.parentElement.remove();

			this.delete_single();
			
		}
	}

	delete_all_tasks(){

		while( Array.from(lista.children).length > 0){

			lista.firstElementChild.remove();
			
		}

	}

	clear_input(task){

		task.value = "";

	}

	delete_alert(alertBox){

		setTimeout(() => {
			alertBox.remove();
		},3000);

	}

	delete_existing_alert(alertBox){

		if(alertBox){

			alertBox.remove();

		}
	}
}


class Control extends Ui {

	constructor(input){

		super();
		this.input = input;
		
	}

	check_if_existing(){

		if(lista.children.length === 0){
			
			return true;

		}else {
			const vector = Array.from(lista.children);
			
			return	vector.every(val => {
					
					if(this.input.value !== val.textContent ){
						return val
					}
			});
		}
	}

	validation(task){

		let re = /^\s{1,}$/;
		
		if(task.value !== "" && !re.test(task.value) && this.check_if_existing()){

			this.build_li(task);
			this.show_alert("Element adaugat cu succes","success","bi bi-check-circle-fill");
			this.add_to_local_storage(task);

		}else{

			this.show_alert("Eroare de completare a campului","danger","bi bi-exclamation-circle-fill");

		}

		this.clear_input(task);

	}

	delete_single(){

		const vector = [];

		Array.from(lista.children).forEach(element => {

			vector.push(element.textContent);

		});

		this.delete_single_local_storage(vector);
	}

	delete_all_tasks_c(){

		this.delete_all_local_storage();
		this.delete_all_tasks();

	}

	init(){

		const vector =  this.get_from_local_storage();
		vector !== null && this.load_from_localStorage(vector);

	}
}

const control = new Control(taskInput);

form.addEventListener("submit",AddTask);

function AddTask(e){

	e.preventDefault();

	control.validation(taskInput);
	
}

lista.addEventListener("click" , DeleteTask);

function DeleteTask(e){

	e.preventDefault();

	control.remove_task(e);
	
}

deleteAllBtn.addEventListener("click" , DeleteAllTasks);

function DeleteAllTasks(e){

	e.preventDefault();

	control.delete_all_tasks_c();

}

filterTasks.addEventListener("keyup", FilterTask);

function FilterTask(e){

e.preventDefault();

control.filter_list(filterTasks);

}

control.init();


