let optionsCont = document.querySelector(".options-cont");
let toolsCont = document.querySelector(".tools-cont");
let pen = document.querySelector(".pen");
let sticky = document.querySelector(".sticky");
let upload = document.querySelector(".upload");
let penActionCont = document.querySelector(".pen-action-cont");
let eraserActionCont = document.querySelector(".eraser-action-cont");
let optionsFlag = true;
let penFlag = false;
let stickyFlag = true;
let eraserFlag = false;
optionsCont.addEventListener("click", (e) => {
    optionsFlag = !optionsFlag;

    if (optionsFlag) openTools(); // Open tools
    else closeTools(); // Close tools        
})

function openTools() {
    let icon = optionsCont.children[0];
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
    toolsCont.classList.add("open-tools");
    toolsCont.classList.remove("close-tools");
}
function closeTools() {
    let icon = optionsCont.children[0];
    icon.classList.add("fa-times");
    icon.classList.remove("fa-bars");
    toolsCont.classList.add("close-tools");
    toolsCont.classList.remove("open-tools");

    penFlag = false;
    penActionCont.style.display = "none";

    eraserFlag = false;
    eraserActionCont.style.display = "none";
}

pen.addEventListener("click", (e) => {
    penFlag = !penFlag;

    if (penFlag) penActionCont.style.display = "block";
    else penActionCont.style.display = "none";
})

let eraser = document.querySelector(".eraser")
// Eraser
eraser.addEventListener("click", (e) => {
    // console.log(eraserFlag)
    eraserFlag = !eraserFlag;
    if (eraserFlag) eraserActionCont.style.display = "flex";
    else eraserActionCont.style.display = "none";
})

sticky.addEventListener("click", (e) => {
    let stickyNoteElem = document.createElement("div");
    stickyNoteElem.setAttribute("class", "sticky-cont");
    stickyNoteElem.innerHTML = `
    <div class="header-cont">
        <div class="toggle-note"></div>
        <div class="remove-note"></div>
    </div>
    <div class="note-cont">
        <textarea spellcheck="false"></textarea>
    </div>
    `;

    let toggleNote = stickyNoteElem.querySelector(".toggle-note");
    let removeNote = stickyNoteElem.querySelector(".remove-note");
    handleStickyActions(toggleNote, removeNote, stickyNoteElem);

    document.body.appendChild(stickyNoteElem);
    stickyNoteElem.onmousedown = function (event) {
        dragAndDrop(stickyNoteElem, event);
    };

    stickyNoteElem.ondragstart = function () {
        return false;
    };
})

function handleStickyActions(toggleNote, removeNote, note) {
    toggleNote.addEventListener("click", (e) => {
        stickyFlag = !stickyFlag;
        let noteCont = note.querySelector(".note-cont");
        if (stickyFlag) {
            noteCont.style.display = "block";
        }
        else {
            noteCont.style.display = "none";
        }
    })
    removeNote.addEventListener("click", (e) => {
        note.remove();
    })
}
function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the ball, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}


upload.addEventListener("click", (e) => {
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);
        let stickyNoteElem = document.createElement("div");
        stickyNoteElem.setAttribute("class", "sticky-cont");
        stickyNoteElem.innerHTML = `
        <div class="header-cont">
            <div class="toggle-note"></div>
            <div class="remove-note"></div>
        </div>
        <div class="note-cont">
            <img src="${url}" />
        </div>
        `;

        let toggleNote = stickyNoteElem.querySelector(".toggle-note");
        let removeNote = stickyNoteElem.querySelector(".remove-note");
        handleStickyActions(toggleNote, removeNote, stickyNoteElem);

        document.body.appendChild(stickyNoteElem);
        stickyNoteElem.onmousedown = function (event) {
            dragAndDrop(stickyNoteElem, event);
        };

        stickyNoteElem.ondragstart = function () {
            return false;
        };
    });
})
