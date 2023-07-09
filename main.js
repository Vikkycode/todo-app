const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoSearchInput = document.getElementById('searchInput')
const todoList = document.getElementById('todoList');
const deleteBtn = document.getElementById('deleteTask');

let tasks = [];

const renderTask = ()=>{    
    todoList.innerHTML = '';

    const filteredTasks = tasks.filter(task =>
        task.text.toLowerCase().includes(todoSearchInput.value.toLowerCase())
    );
    
    filteredTasks.forEach((task,index)=>{
        const listItem = document.createElement('li')
        const checkbox = document.createElement('input')
        checkbox.type='checkbox';
        checkbox.checked= task.completed;
        checkbox.addEventListener('change',() => toggleTodoComplete(index));

        const taskText = document.createElement('span');
        taskText.textContent = task.text;

        if(task.completed){
            listItem.classList.add('completed')
        }

        
        listItem.appendChild(checkbox)
        listItem.appendChild(taskText)
        todoList.appendChild(listItem)
    })
}

function addTask(taskText){
    const newTask = {
        text:taskText,
        completed:false
    }

    tasks.push(newTask)
    renderTask()
    saveTaskToLocalStorage()
}

function deleteTask(index){
    tasks.splice(index,1)
    renderTask()
    saveTaskToLocalStorage()
}

function toggleTodoComplete(index){
    tasks[index].completed = !tasks[index].completed;
 
    if(tasks[index].completed){
        const listItem = todoList.childNodes[index];
        if(listItem.classList.contains('completed')){
            deleteTask(index);
        }else{
            listItem.classList.add('completed')
        }
    }else{
        const listItem = todoList.childNodes[index];
        if(listItem.classList.contains('completed')){
            listItem.classList.remove('completed')
        }
    }

    saveTaskToLocalStorage()
}

function saveTaskToLocalStorage(){
    localStorage.setItem('tasks',JSON.stringify(tasks))
}

function retrieveTaskFromLocalStorage(){
    const storedTasks = localStorage.getItem('tasks');
    if(storedTasks){
        tasks = JSON.parse(storedTasks)
        renderTask()
    }
}

todoForm.addEventListener('submit',(e)=>{
    e.preventDefault()

    const taskText = todoInput.value.trim()
    if(taskText !== ''){
        addTask(taskText)
        todoInput.value = '';
    }
})

todoSearchInput.addEventListener('input', renderTask)

deleteBtn.addEventListener('click',()=> {
    const checkboxes = Array.from(todoList.querySelectorAll('input[type="checkbox"]'))
    const checkedIndexes = checkboxes
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.parentElement.parentElement.children) 
    
    checkedIndexes.sort((a,b)=> b -a);

    checkedIndexes.forEach(index =>{
        deleteTask(index)
    })
})

retrieveTaskFromLocalStorage()