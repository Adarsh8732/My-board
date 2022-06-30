let canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let tool = canvas.getContext("2d");

let pencilColor = document.querySelectorAll(".pen-color");
let pencilWidth = document.querySelector(".pen-width");
let eraserWidthElem = document.querySelector(".eraser-width");

let download = document.querySelector(".download");

let undo = document.querySelector(".undo")
let redo = document.querySelector(".redo")
let undoRedoTracker = [];
let track = 0;

let penColor = "red";
let penWidth = pencilWidth.value;
let eraserColor = "white"
let eraserWidth = eraserWidthElem.value;

tool.strokeStyle = penColor;
tool.lineWidth=penWidth ;

let mouseDown = false;

console.log(tool.strokeStyle)



canvas.addEventListener("mousedown",(e)=>{
    mouseDown = true;
    // beginPath({
    //     x:e.clientX,
    //     y:e.clientY
    // })
    // console.log("Mouse down")
    let data = {
            x:e.clientX,
            y:e.clientY
        }
    socket.emit("beginPath",data);
})

function beginPath(obj){
    // console.log("begin path")
    tool.beginPath();
    tool.moveTo(obj.x,obj. y);
}

canvas.addEventListener("mousemove",(e)=>{
    if(mouseDown){
        // console.log(penColor)
        // drawStroke({
        //     x:e.clientX,
        //     y:e.clientY,
        //     color:eraserFlag?eraserColor:penColor,
        //     width:eraserFlag?eraserWidth:penWidth
        // })
        let data = {
            x:e.clientX,
            y:e.clientY,
            color:eraserFlag?eraserColor:penColor,
            width:eraserFlag?eraserWidth:penWidth
        }
        socket.emit("drawStroke",data);
    }
})

function drawStroke(obj){
    tool.strokeStyle = obj.color;
    tool.lineWidth = obj.width; 
    tool.lineTo(obj.x,obj.y)
    tool.stroke();
}
canvas.addEventListener("mouseup",(e)=>{
    mouseDown=false;
    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length-1;
})


pencilColor.forEach((colorElem)=>{
    colorElem.addEventListener("click",(e)=>{
        // console.log(colorElem.classList);
         let color = colorElem.classList[0];
         penColor = color;
         tool.strokeStyle = penColor; 
    })
})

pencilWidth.addEventListener("change",(e)=>{
    penWidth = pencilWidth.value;
    tool.lineWidth = penWidth;
})

eraserWidthElem.addEventListener("change",(e)=>{
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
})


eraser.addEventListener("click",(e)=>{
    if(eraserFlag){
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    }else{
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})

download.addEventListener('click',(e)=>{
    let url = canvas.toDataURL();

    let a = document.createElement('a');
    a.href = url;
    a.download = 'board.jpg';
    a.click();
})


undo.addEventListener("click",(e)=>{
    if(track==0){
        return;
    }
    // console.log("inside undo Canvas");

    track--;
    let data = {
        trackValue:track,
        undoRedoTracker
    }
    // undoRedoCanvas(trackObj)
    socket.emit("redoUndo",data);
})

redo.addEventListener("click",(e)=>{
    if(track==undoRedoTracker.length-1){
        return;
    }
    track++;
    let data = {
        trackValue:track,
        undoRedoTracker
    }
    // undoRedoCanvas(trackObj)
    socket.emit("redoUndo",data);
})

function undoRedoCanvas(trackObj){
    // console.log("inside undoRedo Canvas");
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;
    let url = undoRedoTracker[track];
    let img = new Image();// new image reference
    img.src = url;
    img.onload=(e)=>{
        tool.drawImage(img,0,0,canvas.width,canvas.height);
    }
}
// socket listening

socket.on("beginPath",(data)=>{
    // console.log("begin Path");
    beginPath(data);
    
})

socket.on("drawStroke",(data)=>{
    drawStroke(data);
})

socket.on("redoUndo",(data)=>{
    undoRedoCanvas(data);
})