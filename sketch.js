var mousePressed = false;
var lastX, lastY;
var ctx;
var ctx2;
var xArray = [];
var yArray = [];
var questions = ['What is this?', 'How does this make you feel?'];
var labels = [];
var answers = [];
var xBox = [];
var yBox = [];
var wBox = [];
var hBox = [];
var mode = ["Draw", "Circle", "Discuss"];
var img; //Image of canvas
//Bounding box width and height and last mousex, last mousey
var width, height;
var last_mousex, last_mousey;

function InitThis() {
    ctx = document.getElementById('myCanvas').getContext("2d");
    ctx2 = document.getElementById('canvas2').getContext('2d');
 
    $('#myCanvas').mousedown(function (e) {
        mousePressed = true;
        Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
    });

    $('#myCanvas').mousemove(function (e) {
        if (mousePressed) {
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
        }
    });

    $('#myCanvas').mouseup(function (e) {
        mousePressed = false;
    });
	    $('#myCanvas').mouseleave(function (e) {
        mousePressed = false;
    });
}

function Draw(x, y, isDown) {
	
    if (isDown) {
        ctx.beginPath();
        ctx.strokeStyle = $('#selColor').val();
        ctx.lineWidth = $('#selWidth').val();
        ctx.lineJoin = "round";
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
        xArray.push([x]);
        yArray.push([y]);
        console.log(x, y);

    }

    lastX = x; lastY = y;
   	

}
	
function clearArea() {
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height); //clear canvas 1
    ctx2.clearRect(0,0,canvas2.width,canvas2.height); //clear canvas 2
    $("#canvas2").css("z-index", "0")
    $("#myCanvas").css("z-index", "1") //put drawing canvas over encapsulate canvas
    console.clear();//clear console
    $('#questions').val('');
    document.getElementById('answer').readOnly = true;
}


function begin(){
    //Set Mode to "Draw"
    var dt = new Date().getTime();
    var img = myCanvas.toDataURL();
    console.log(img);
    var DrawingModeData =  {
        PNG: img,
        Timestamp: dt
    };
    console.log(DrawingModeData)
}
function end(){
    var dt = new Date().getTime();
    img = myCanvas.toDataURL();
    console.log(img);
    var DrawingModeData =  {
        PNG: img,
        Timestamp: dt
    };
    console.log(DrawingModeData);
    //Set Mode to Label
    
}

function circleObject() {
    //Check if mode is in label
    $("#canvas2").css("z-index", "1")
    $("#myCanvas").css("z-index", "0") //put encapsulate canvas over drawing canvas
    var canvasx = $(canvas2).offset().left;
    var canvasy = $(canvas2).offset().top;
    last_mousex = last_mousey = 0;
    var mousex = mousey = 0;
    var mousedown = false;

//Mousedown
    $(canvas2).on('mousedown', function(e) {
    last_mousex = parseInt(e.clientX-canvasx);
    last_mousey = parseInt(e.clientY-canvasy);
    mousedown = true;
    });

//Mouseup
    $(canvas2).on('mouseup', function(e) {
    mousedown = false;
    $('#questions').val(questions[0]);
    });

//Mousemove
    $(canvas2).on('mousemove', function(e) {
    mousex = parseInt(e.clientX-canvasx);
    mousey = parseInt(e.clientY-canvasy);
    if(mousedown) {
        ctx2.clearRect(0,0,canvas2.width,canvas2.height); //clear canvas
        ctx2.beginPath();
        width = mousex-last_mousex;
        height = mousey-last_mousey;
        ctx2.rect(last_mousex,last_mousey,width,height);
        ctx2.strokeStyle = 'black';
        ctx2.lineWidth = 10;
        ctx2.stroke();
    }
    //Output
    $('#output').html('current: '+mousex+', '+mousey+'<br/>last: '+last_mousex+', '+last_mousey+'<br/>mousedown: '+mousedown);
    });
    
}

function submitLabel(){
	inputvalue = document.getElementById('answer').value;
    labels.push(inputvalue);
    xBox.push(last_mousex);
    yBox.push(last_mousey);
    wBox.push(Math.abs(width));
    hBox.push(Math.abs(height));
	$('#answer').val('');
    $('#questions').val('');
    img = myCanvas.toDataURL();
    var LabelModeData =  {
        Label: inputvalue,
        BoundingBox: {StartX: last_mousex, StartY: last_mousey, Width: Math.abs(width), Height: Math.abs(height)}, 
        PNG: img
    };
    console.log(LabelModeData);
    ctx2.clearRect(0,0,canvas2.width,canvas2.height);
    console.log(labels);
    console.log('Start of Box at x: ' + xBox);
    console.log('Start of Box at y: ' + yBox);
    console.log('Width of Box: ' + wBox);
    console.log('Height of Box: ' + hBox);
}

function conversationMode(){
    //Switch to discussion mode
    //Create blank canvas to compare urls
    var blank = document.createElement('canvas');
    blank.width = canvas2.width;
    blank.height = canvas2.height;
    if(canvas2.toDataURL() == blank.toDataURL()){
        for(var i = 0; i < labels.length; i++){
            ctx2.rect(xBox[i], yBox[i], wBox[i], hBox[i]);
            ctx2.stroke();
            $('#questions').val(questions[1]);
            $('submitButton').click(function(){
                answers.push($('#answer'.val()));
                var DiscussionModeData = {
                        Label: labels[i],
                        BoundingBox: {StartX: xBox[i], StartY: yBox[i], Width: wBox[i], Height: hBox[i]},
                        Question: questions[i],
                        Answer: answers[i] 
                };
                console.log(DiscussionModeData);
                ctx2.clearRect(0,0,canvas2.width, canvas2.height); 
            });
            console.log('hello');
        }
    } else {
        console.log('canvas is not empty');
    }
}



function submitAnswer(){
    ctx2.rect(xBox[i], yBox[i], wBox[i], hBox[i]);
ctx2.stroke();
$('#questions').val(questions[1]);
    answers.push($('#answer'.val()));
    var DiscussionModeData = {
            Label: labels[i],
            BoundingBox: {StartX: xBox[i], StartY: yBox[i], Width: wBox[i], Height: hBox[i]},
            Question: questions[i],
            Answer: answers[i] 
    };
    console.log(DiscussionModeData);
    ctx2.clearRect(0,0,canvas2.width, canvas2.height);
}



