let notes = [];
let editingNoteId = null;

const loadNotes = () => {
    const savedNotes = localStorage.getItem('quickNotes');
    return savedNotes ? JSON.parse(savedNotes) : [];
}


const openNoteDialog = (noteId = null) => {
    const dialog = document.getElementById('noteDialog');
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');


    if (noteId) {
        //editing mode
        const noteToEdit = notes.find(note => note.id === noteId);
        editingNoteId = noteId;
        let changeText = document.getElementById('dialogTitle');
        changeText.textContent = "Edit Note";
        titleInput.value = noteToEdit.title;
        contentInput.value = noteToEdit.content;
    } else {
        //ading a new node

        editingNoteId = null;
        defaultText = document.getElementById('dialogTitle');
        defaultText.textContent = "Add New Note";
        titleInput.value = '';
        contentInput.value = '';
    }

    dialog.showModal();
    titleInput.focus();
}



const saveNote = () => {
    //event.preventDefault(); //removed because counter function needs to update
    console.log(`the saveNote funciton has been called.`);

    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();


    if (editingNoteId) {
        // update an existing note

        const noteIndex = notes.findIndex(note => note.id === editingNoteId);
        notes[noteIndex] = {
            ...notes[noteIndex],
            title: title,
            content: content
        }
        console.log(notes);

    } else {
        notes.unshift({
            id: Date.now().toString(),
            title: title,
            content: content
        })

    }



    saveNotes();
    closeNoteDialog();
    renderNotes();
}

const closeNoteDialog = () => {
    let closeNote = document.getElementById('noteDialog');
    closeNote.close();
}

const saveNotes = () => {
    localStorage.setItem('quickNotes', JSON.stringify(notes));
}

const deleteNote = (noteId) => {
    notes = notes.filter(note => note.id != noteId);
    saveNotes();
    renderNotes();
    counterFunction();
    applyCounter();
}




const renderNotes = () => {
    const notesContainer = document.getElementById('notesContainer');

    if (notes.length === 0) {
        notesContainer.innerHTML = `
            <div class="empty-state">
             <h2>No Notes Yet</h2>
             <p>Create your first note to get started!</p>
             <button class="add-note-btn" id="addNoteBtn" onclick="openNoteDialog()">+ Add your first note!</button>
            </div>
        `
        return
    }


    notesContainer.innerHTML = notes.map(note => `
        <div class="note-card">
            <h3 class="note-title">${note.title}</h3>
            <p class="note-content">${note.content}</p>

        <div class="note-actions">
        <button class="edit-btn" onclick="openNoteDialog('${note.id}')" title="Edit Note">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M8.56078 20.2501L20.5608 8.25011L15.7501 3.43945L3.75012 15.4395V20.2501H8.56078ZM15.7501 5.56077L18.4395 8.25011L16.5001 10.1895L13.8108 7.50013L15.7501 5.56077ZM12.7501 8.56079L15.4395 11.2501L7.93946 18.7501H5.25012L5.25012 16.0608L12.7501 8.56079Z" fill="#080341"></path> </g></svg>
        </button>
        <button class="delete-btn" onclick="deleteNote('${note.id}')" title="Delete Note, also if you read this u are gay">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        </button>
        </div> 
        </div>
        `).join('');
    
    counterFunction();
    applyCounter();
}


//dark mode
const toggleTheme = () => {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.getElementById('themeToggleBtn').textContent = isDark ? '☀️' : '🌙';
}

//applying dark mode with persistance

const applyStoredTheme = () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('themeToggleBtn').textContent = '☀️';
    }
}

const counterFunction = () => {
    let arrayCount = notes.length;
    localStorage.setItem('count', arrayCount);
}

const applyCounter = () => {
    const counterVariable = document.getElementById('counterCircle');
    let tempCount = localStorage.getItem('count');

    counterVariable.textContent = tempCount;
}


document.addEventListener('DOMContentLoaded', () => {
    //call the dark theme functions first... 
    applyStoredTheme();

    notes = loadNotes();
    window.onload = () => {
        renderNotes();
        //cal counter fn
        //counterFunction();
    }

    let noteForm = document.getElementById('noteForm');
    noteForm.addEventListener('submit', saveNote);
    //dark mode 
    let themeToggle = document.getElementById("themeToggleBtn");
    themeToggle.addEventListener('click', toggleTheme);
    //


    document.getElementById('noteDialog').addEventListener('click', function (event) {
        if (event.target === this) {
            closeNoteDialog();
        }
    })

})