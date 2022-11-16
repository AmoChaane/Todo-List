import isEqual from 'date-fns/isEqual';
import isToday from 'date-fns/isToday';
import parseISO from 'date-fns/parseISO';
import isTomorrow from 'date-fns/isTomorrow';
import isThisWeek from 'date-fns/isThisWeek';
import isYesterday from 'date-fns/isYesterday';
import isBefore from 'date-fns/isBefore';
import './style.css';

const height = document.body.scrollHeight;
document.body.style.height = `${height}px`;

// const width = document.body.scrollWidth;
// document.body.style.width = `${width}px`;

// ----------------------------------------------------------------------------------------------------------------------------------
// This function holds all dom elements on initial page load. Only the ones that will be needed. There are also some elements with a display of none

function elems() {
    const content = document.querySelector('#content');
    const overlay = document.querySelector('.overlay');
    const overlay2 = document.querySelector('.overlay2');
    const add_task = document.querySelector('.add-task');
    const close_task = document.querySelector('#close-task-form');
    const close_project = document.querySelector('#close-project-form');
    const plus = document.querySelector('.plus');
    const today = document.querySelector('.today');
    const tomorrow = document.querySelector('.tomorrow');
    const this_week = document.querySelector('.this-week');
    const completed_tasks = document.querySelector('.completed-tasks');
    const submit_project = document.querySelector('.add-project');
    const add_project_btn = document.querySelector('.add');
    const task_input_text = document.querySelector('#task-input-text');
    const task_input_date = document.querySelector('#task-input-date');
    const task_input_textarea = document.querySelector('#task-input-textarea');
    const task_input_priority = document.querySelector('#task-input-priority');
    const task_input_project = document.querySelector('#task-input-project');
    const project_input_text = document.querySelector('#project-input-text');
    const h2 = document.querySelector('#tasks-section-h2');
    const tasks_section = document.querySelector('.tasks-section');
    const projects = document.querySelector('.projects');
    const all_tasks = document.querySelector('.all-tasks');
    const todays_date = new Date();

    return {
        content,
        todays_date,
        all_tasks,
        projects,
        tasks_section,
        project_input_text,
        task_input_project,
        task_input_priority,
        task_input_priority,
        task_input_textarea,
        task_input_date,
        task_input_text,
        add_project_btn,
        submit_project,
        completed_tasks,
        this_week,
        tomorrow,
        today,
        plus,
        close_project,
        close_task,
        add_task,
        overlay2,
        overlay,
        h2
    }
}

// ---------------------------------------------------------------------------------------------------------------------------

const tasks = []; // All tasks created will be pushed to this array
const completed = []; // All completed tasks will go here
const projectsCreated = []; // All projects' names(strings) will go here
const task_names = []; // All task names(strings) will go here

// --------------------------------------------------------------------------------------------------------------

function Task(title, due_date, desc, priority, project) {
    this.title = title;
    this.desc = desc;
    this.due = due_date;
    this.priority = priority;
    this.project = project;
}

// --------------------------------------------------------------------------------------------------------
// The first two if statements of this event listener prevent duplicate task names and invalid dates
// After the add task button is clicked, the task created will be added to the tasks array
// If the current page is e.g Today, only the tasks of Today will be appended to the DOM


elems().add_task.addEventListener('click', e => {
    if(!task_names.includes(elems().task_input_text.value)) {
        if(!(isBefore(parseISO(elems().task_input_date.value), elems().todays_date)) || isToday(parseISO(elems().task_input_date.value))) {
            if(elems().task_input_text.value == '' || elems().task_input_date.value == '' || elems().task_input_textarea.value == '') {
                alert('Please complete all fields');
            } else {
                const task = new Task(elems().task_input_text.value, elems().task_input_date.value, elems().task_input_textarea.value, elems().task_input_priority.value, elems().task_input_project.value);
                tasks.push(task);
                console.log(tasks);
                task_names.push(task.title);
                elems().overlay.style.display = `none`;
                const t = document.querySelector('.tasks');
                const new_task = taskCreation(task);
        
                if(task.project == elems().h2.textContent) {
                    t.append(new_task);
                }
                else if(isToday(parseISO(task.due)) && elems().h2.textContent == ' Today') {
                    t.append(new_task);
                }
                else if(isTomorrow(parseISO(task.due)) && elems().h2.textContent == ' Tomorrow') {
                    t.append(new_task);
                }
                else if(isThisWeek(parseISO(task.due)) && elems().h2.textContent == ' This Week') {
                    t.append(new_task);
                }
            }
        } else {
            alert('The date you have chosen has already passed');
        }
    } else {
        alert('The task name is already in use');
    }
    

});

// ----------------------------------------------------------------------------------------------------------------------------------
// Immediately when the page is loaded, The Inbox default project will be created and pushed to the projectsCreated array

window.addEventListener('DOMContentLoaded', e => {
    elems().today.click();
    elems().h2.textContent = elems().today.textContent;
    // elems().projects.append(projectCreation('Inbox'));
    // projectsCreated.push('Inbox');
    elems().task_input_project.innerHTML += `<option value="Inbox" selected>N/A</option>`;
    a();
    appendTasks(tasks, e.target.textContent);
});

// ----------------------------------------------------------------------------------------------------------------------------------
// When we click on All Tasks, all tasks created will be appended to the DOM, same goes for the below event listeners.

elems().all_tasks.addEventListener('click', e => {
    appendTasks(tasks, e.target.textContent);
    d(e.target, elems().today, elems().tomorrow, elems().this_week, elems().completed_tasks);
});

elems().today.addEventListener('click', e => {
    d(e.target, elems().all_tasks, elems().tomorrow, elems().this_week, elems().completed_tasks);
    appendTasks(tasks, e.target.textContent);
});

elems().tomorrow.addEventListener('click', e => {
    appendTasks(tasks, e.target.textContent);
    d(e.target, elems().all_tasks, elems().today, elems().this_week, elems().completed_tasks);
});

elems().this_week.addEventListener('click', e => {
    appendTasks(tasks, e.target.textContent);
    d(e.target, elems().all_tasks, elems().today, elems().tomorrow, elems().completed_tasks);
});

elems().completed_tasks.addEventListener('click', e => {
    appendTasks(completed, e.target.textContent);
    d(e.target, elems().today, elems().tomorrow, elems().this_week, elems().all_tasks);
});

// ----------------------------------------------------------------------------------------------------------------------------------



elems().plus.addEventListener('click', e => { // The plus icon on the header
    elems().task_input_project.innerHTML = `<option value="" selected>N/A</option>`;
    for(let i = 0; i < projectsCreated.length; i++) {
        elems().task_input_project.innerHTML += `<option value="${projectsCreated[i]}">${projectsCreated[i]}</option>`;
    }
    elems().overlay.style.display = `flex`;
});

elems().add_project_btn.addEventListener('click', e => { // The Add Project Button
    elems().overlay2.style.display = `flex`;
});

// ------------------------------------------------------------------------------------------------------------------------------------
// When we click on Add Project, a project will be created

elems().submit_project.addEventListener('click', e => {
    if(!projectsCreated.includes(elems().project_input_text.value)) {
        elems().projects.append(projectCreation(elems().project_input_text.value));
        projectsCreated.push(elems().project_input_text.value);
        elems().overlay2.style.display = `none`;
        for(let i = projectsCreated.indexOf(projectsCreated[projectsCreated.length - 1]); i < projectsCreated.length; i++) {
            elems().task_input_project.innerHTML += `<option value="${projectsCreated[i]}">${projectsCreated[i]}</option>`;
        }
        a();
    } else {
        alert('Project already exists');
    }
});

// ----------------------------------------------------------------------------------------------------------------------------------


elems().close_task.addEventListener('click', e => { // closes the Add Task Div
    elems().overlay.style.display = `none`;
});

elems().close_project.addEventListener('click', e => { // closes the Add Project Div
    elems().overlay2.style.display = `none`;
});

// ----------------------------------------------------------------------------------------------------------------------------------
// This function populates the Task created to the DOM along with its event listeners

function taskCreation(task) {
    const span = document.createElement('div');
    span.classList.add('task');
    task.priority == 'Low' ? span.style.borderLeft = `14px solid blue`:
    task.priority == 'Medium' ? span.style.borderLeft = `14px solid orange`: span.style.borderLeft = `14px solid red`;

    const info = document.createElement('div');
    info.classList.add('info');
    const radio = document.createElement('div');
    radio.classList.add('radio');
    const input = document.createElement('input');
    input.type = 'radio';
    radio.append(input);
    info.append(radio);
    const title_desc = document.createElement('div');
    title_desc.classList.add('title-desc');
    const h3 = document.createElement('h3');
    h3.classList.add('h3');
    h3.textContent = task.title;
    const p = document.createElement('p');
    p.classList.add('p');
    p.textContent = task.desc;
    title_desc.append(h3, p);
    info.append(title_desc);

    const icons = document.createElement('div');
    icons.classList.add('icons');
    const span2 = document.createElement('div');
    span2.classList.add('date');
    span2.textContent = task.due;
    icons.append(span2);
    const pencil = document.createElement('i');
    pencil.classList.add('fa-solid', 'fa-pencil');
    const trash = document.createElement('i');
    trash.classList.add('fa-solid', 'fa-trash-can');
    icons.append(pencil, trash);

    span.append(info, icons);


    input.addEventListener('click', e => {  // The radio button that completes a task
        setTimeout(() => {
            span.remove();
        }, 150);
        tasks.splice(tasks.indexOf(task), 1);
        completed.push(task);
        task_names.splice(task_names.indexOf(task.title), 1);
    });


    h3.addEventListener('click', e => { // We click on this when we want to know more about the task
        if(completed.includes(task)) {
            elems().content.append(view(task, h3, p, span2, 'none').overlay3);
        } else {
            elems().content.append(view(task, h3, p, span2, 'flex').overlay3);
        }
    });


    trash.addEventListener('click', e => { // Deleting a task
        span.remove();
        tasks.splice(tasks.indexOf(task), 1);
        completed.splice(completed.indexOf(task), 1);
        task_names.splice(task_names.indexOf(task.title), 1);
    });


    pencil.addEventListener('click', e => { // Editing a task
        elems().content.append(edit(task, h3, p, span2).overlay_edit);
    });

    if(completed.includes(task)) { // If the radio button has been clicked, meaning the task has been completed, we can no longer edit the 
        // task or complete again with the radio button which would cause problems. These option disappear after we complete a task
        pencil.style.display = 'none';
        input.style.display = 'none';
        title_desc.style.paddingLeft = '15px';
    }


    return span
}

// ----------------------------------------------------------------------------------------------------------------------------------
// This function looks through the tasks array which has all tasks created and populates only the ones needed

function appendTasks(arr, e) {
    // It starts by removing all content on the page and then appending only the needed content
    const tasks = document.querySelector('.tasks');
    tasks.remove();
    const t = document.createElement('div');
    t.classList.add('tasks');
    elems().tasks_section.append(t);

    for(let i = 0; i < arr.length; i++){
        if(isToday(parseISO(arr[i].due)) && e == ' Today') {
            t.append(taskCreation(arr[i]));
        }
        else if(isTomorrow(parseISO(arr[i].due)) && e == ' Tomorrow') {
            t.append(taskCreation(arr[i]));
        }
        else if(isThisWeek(parseISO(arr[i].due)) && e == ' This Week') {
            t.append(taskCreation(arr[i]));
        } else if(e == ' Completed Tasks') {
            t.append(taskCreation(arr[i]));
        } else if(e == ' All Tasks') {
            t.append(taskCreation(arr[i]));
        }
    }
}

// ----------------------------------------------------------------------------------------------------------------------------------
// This populates the project created on the sidebar

function projectCreation(proj) {
    const project = document.createElement('div');
    project.classList.add('project');
    const p = document.createElement('p');
    p.textContent = proj;
    
    const trash = document.createElement('i');
    trash.classList.add('fa-solid', 'fa-trash-can');
    project.append(p, trash);

    project.addEventListener('mouseover', e => {
        trash.style.display = 'flex';
    });

    project.addEventListener('mouseout', e => {
        trash.style.display = 'none';
    });

    trash.addEventListener('click', e => {  //  deleting a project along with its tasks
        elems().h2.textContent = '';
        console.log('Projects Created', projectsCreated);
        console.log('Tasks Created', tasks);
        project.remove();
        projectsCreated.splice(projectsCreated.indexOf(p.textContent), 1);
        for(let i = 0; i < tasks.length; i++) {
            for(let u in tasks[i]) {
                if(tasks[i][u] == p.textContent) {
                    tasks.splice(tasks.indexOf(tasks[i]), 1);
                    task_names.splice(task_names.indexOf(tasks[i].title), 1);
                }
            }
        }
        console.log('Projects Created', projectsCreated);
        console.log('Tasks Created', tasks);
    });

    return project
}

// ----------------------------------------------------------------------------------------------------------------------------------
// This function creates an event listener for all future projects that will be created. Everytime we click on a project, only that project's 
// tasks will be appended to the DOM

function a() {
    const y = document.querySelectorAll('.project p');
    y.forEach((p) => {
        p.addEventListener('click', e => {
            elems().h2.textContent = p.innerText;
            elems().today.style.backgroundColor = '';
            elems().tomorrow.style.backgroundColor = '';
            elems().this_week.style.backgroundColor = '';
            elems().completed_tasks.style.backgroundColor = '';
            // elems().h2.textContent = proj.textContent;
            const tas = document.querySelector('.tasks');
            tas.remove();
            const new_tasks_div = document.createElement('div');
            new_tasks_div.classList.add('tasks');
            elems().tasks_section.append(new_tasks_div);
            for(let i = 0; i < tasks.length; i++) {
                if(tasks[i].project == e.target.textContent) {
                    const task = taskCreation(tasks[i]);
                    new_tasks_div.append(task);
                }
            }
        });
    });
}

// ----------------------------------------------------------------------------------------------------------------------------------
// This is the edit box that will pop up when we want to edit a task

function edit(task, h3, p, span2) {
    const overlay_edit = document.createElement('div');
    overlay_edit.classList.add('overlay-edit');

    const info_box = document.createElement('div');
    info_box.classList.add('info-box');
    overlay_edit.append(info_box);

    const heading = document.createElement('div');
    heading.classList.add('heading');
    const h2 = document.createElement('h2');
    h2.textContent = 'Edit Task';
    heading.append(h2);
    info_box.append(heading);
    const hr = document.createElement('hr');
    info_box.append(hr);

    // -------------------form------------------------------

    const form = document.createElement('form');
    form.id = 'form';
    info_box.append(form);

    const title = document.createElement('div');
    title.classList.add('title');
    const label = document.createElement('label');
    label.textContent = 'Title:';
    const br = document.createElement('br');
    const input = document.createElement('input');
    input.classList.add('overlay-input');
    input.type = 'text';
    input.id = 'task-input-text4';
    title.append(label, br, input);
    form.append(title);

    // ----------------------------------------

    const due_date = document.createElement('div');
    due_date.classList.add('due-date');
    const label2 = document.createElement('label');
    label2.textContent = 'Due Date:';
    const br2 = document.createElement('br');
    const input2 = document.createElement('input');
    input2.classList.add('overlay-input');
    input2.type = 'date';
    input2.id = 'task-input-date4';
    due_date.append(label2, br2, input2);
    form.append(due_date);

    // ------------------------------------------

    const description = document.createElement('div');
    description.classList.add('description');
    const label3 = document.createElement('label');
    label3.textContent = 'Description:';
    const br3 = document.createElement('br');
    const textarea = document.createElement('textarea');
    textarea.id = 'task-input-textarea4';
    description.append(label3, br3, textarea);
    form.append(description);

    // ------------------------------------------

    const priority = document.createElement('div');
    priority.classList.add('priority');
    const label4 = document.createElement('label');
    label4.textContent = 'Priority:';
    const br4 = document.createElement('br');
    const select = document.createElement('select');
    select.classList.add('overlay-select');
    select.id = 'task-input-priority4';
    select.innerHTML = `<option value="Low" selected>Low</option>
    <option value="Medium" selected>Medium</option>
    <option value="High" selected>High</option>`;
    priority.append(label4, br4, select);
    form.append(priority);

    // --------------------------------------------

    const project = document.createElement('div');
    project.classList.add('select-project');

    const label5 = document.createElement('label');
    label5.textContent = 'Project:';
    const br5 = document.createElement('br');
    const select2 = document.createElement('select');
    select2.classList.add('overlay-select');
    select2.id = 'task-input-project4';

    select2.innerHTML += `<option value="" selected>N/A</option>`;

    // console.log(projectsCreated);
    for(let i = 0; i < projectsCreated.length; i++) {
        select2.innerHTML += `<option value="${projectsCreated[i]}">${projectsCreated[i]}</option>`;
    }

    project.append(label5, br5, select2);
    form.append(project);
    
    // -----------------------------------------------------

    const buttons = document.createElement('div');
    buttons.classList.add('buttons');
    const btn1 = document.createElement('button');
    btn1.id = 'close-edit-form';
    btn1.classList.add('close');
    btn1.textContent = 'Close';
    const btn2 = document.createElement('button');
    btn2.id = 'finish-edit';
    btn2.classList.add('add-task');
    btn2.textContent = 'Finish Edit';
    buttons.append(btn1, btn2);
    info_box.append(buttons);


    btn1.addEventListener('click', e => { //  Close button
        overlay_edit.remove();
    });

    btn2.addEventListener('click', e => { // Finish Edit button
        task.title = input.value;
        task.desc = textarea.value;
        task.due = input2.value;
        task.project = select2.value;
        task.priority = select.value;
        
        h3.textContent = task.title;
        p.textContent = task.desc;
        span2.textContent = task.due;

        appendTasks(tasks, document.querySelector('#tasks-section-h2').textContent);
        overlay_edit.remove();
        console.log(tasks);

        for(let i = 0; i < tasks.length; i++) {
            if(tasks[i].project == document.querySelector('#tasks-section-h2').textContent) {
                document.querySelector('.tasks').append(taskCreation(tasks[i]));
            }
        }
    });

    input.value = task.title;
    input2.value = task.due;
    textarea.value = task.desc;
    select.value = task.priority;
    select2.value = task.project;
    
    
    return {
        overlay_edit,
        input,
        input2,
        textarea,
        select,
        select2,
        btn1,
        btn2
    }
}

// ----------------------------------------------------------------------------------------------------------------------------------
// This is the box that will pop up when we click on the title of a task, it also has an edit task option in it

function view(task, h3, p, span2, f) {
    const overlay3 = document.createElement('div');
    overlay3.classList.add('overlay3');

    const info_box = document.createElement('div');
    info_box.classList.add('info-box');
    overlay3.append(info_box);

    const heading = document.createElement('div');
    heading.classList.add('heading');
    heading.style.textAlign = 'center';
    const h2 = document.createElement('h2');
    h2.classList.add('overlay3-title');
    h2.textContent = task.title;
    heading.append(h2);
    info_box.append(heading);
    const hr = document.createElement('hr');
    info_box.append(hr);

    // -------------------Task Info------------------------------

    const task_info = document.createElement('div');
    task_info.classList.add('task-info');
    info_box.append(task_info);

    // ----------------------------------------

    const due_date = document.createElement('div');
    due_date.classList.add('due-date');
    due_date.style.paddingBottom = '10px'; 
    const h3_1 = document.createElement('h3');
    h3_1.classList.add('h3ForTaskInfo');
    h3_1.textContent = 'Due Date:';
    const p_1 = document.createElement('p');
    p_1.classList.add('overlay3-date');
    p_1.textContent = task.due;
    due_date.append(h3_1, p_1);
    task_info.append(due_date);

    // ------------------------------------------

    const description = document.createElement('div');
    description.classList.add('description');
    const h3_2 = document.createElement('h3');
    h3_2.classList.add('h3ForTaskInfo');
    h3_2.textContent = 'Description:';
    const p2 = document.createElement('p');
    p2.classList.add('overlay3-desc');
    p2.textContent = task.desc;
    description.append(h3_2, p2);
    task_info.append(description);

    // ------------------------------------------

    const priority = document.createElement('div');
    priority.classList.add('priority');
    priority.style.paddingBottom = '10px'; 
    const h3_3 = document.createElement('h3');
    h3_3.classList.add('h3ForTaskInfo');
    h3_3.textContent = 'Priority:';
    const p3 = document.createElement('p');
    p3.classList.add('overlay3-priority');
    p3.textContent = task.priority;
    priority.append(h3_3, p3);
    task_info.append(priority);

    // --------------------------------------------

    const select_project = document.createElement('div');
    select_project.classList.add('select-project');
    const h3_4 = document.createElement('h3');
    h3_4.classList.add('h3ForTaskInfo');
    h3_4.textContent = 'Project:';
    const p4 = document.createElement('p');
    p4.classList.add('overlay3-project');
    console.log(task.project);
    if(task.project == '') p4.textContent = 'N/A';
    else p4.textContent = task.project;
    select_project.append(h3_4, p4);
    task_info.append(select_project);

    
    // -----------------------------------------------------

    const buttons = document.createElement('div');
    buttons.classList.add('buttons');
    const btn1 = document.createElement('button');
    btn1.id = 'close-edit-task-form';
    btn1.classList.add('close');
    btn1.textContent = 'Close';
    const btn2 = document.createElement('button');
    btn2.classList.add('edit-btn');
    btn2.textContent = 'Edit Task';
    btn2.style.display = f;
    buttons.append(btn1, btn2);
    info_box.append(buttons);


    btn1.addEventListener('click', e => {
        overlay3.remove();
    });

    btn2.addEventListener('click', e => {
        overlay3.remove();
        elems().content.append(edit(task, h3, p, span2).overlay_edit);
    });


    return {
        overlay3,
        btn1,
        btn2
    }
}

// ----------------------------------------------------------------------------------------------------------------------------------
// This function makes it so that it's easier to see which section we're on. 

function d(e, first, second, third, fourth) {
    elems().h2.textContent = e.textContent;
    e.style.backgroundColor = 'white';
    first.style.backgroundColor = '';
    second.style.backgroundColor = '';
    third.style.backgroundColor = '';
    fourth.style.backgroundColor = '';
}
