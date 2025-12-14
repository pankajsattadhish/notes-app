async function waitForMarked() {
  while (typeof marked !== 'function' && typeof marked.marked !== 'function') {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  const markdownParser = typeof marked === 'function' ? marked : marked.marked;
  return markdownParser;
}

let markdownParser;

waitForMarked().then(parser => {
  markdownParser = parser;
  
  const addBtn = document.getElementById('add');
  const notes = JSON.parse(localStorage.getItem('notes'))

  if(notes){
    notes.forEach(note => addNewNote(note));
  }

  addBtn.addEventListener('click', () => addNewNote());
});

function addNewNote(text = '') {
  const note = document.createElement('div');
  note.classList.add('note');
  note.innerHTML = `
    <div class="tools">
      <button class="edit"><i class="fas fa-edit"></i></button>
      <button class="delete"><i class="fas fa-trash-alt"></i></button>
    </div>
    <div class="main ${text ? '' : "hidden"}"></div>
    <textarea class="${text ? 'hidden' : ''}"></textarea>
    `;
  const editBtn = note.querySelector('.edit');
  const deleteBtn = note.querySelector('.delete');
  const main = note.querySelector('.main');
  const textArea = note.querySelector('textarea');

  textArea.value = text;
  main.innerHTML = markdownParser(text);

  deleteBtn.addEventListener('click', () => {
    note.remove();
    updateLs();
  })

  editBtn.addEventListener('click', () => {
    main.classList.toggle('hidden');
    textArea.classList.toggle('hidden');
  })

  textArea.addEventListener('input', (e) => {
    const { value } = e.target;
    main.innerHTML = markdownParser(value);
    updateLs();
  })

  document.body.appendChild(note);
}

function updateLs() {
  const notesText = document.querySelectorAll('textarea');
  const notes = [];
  notesText.forEach(note => notes.push(note.value));
  localStorage.setItem('notes', JSON.stringify(notes));
}
