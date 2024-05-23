 
 



var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerHeight * 0.3; //ca. 500px
canvas.height = window.innerHeight*0.4;
//console.log(window.innerWidth);

var superSpeed = false; // active only when 100% speed reached
var skip = 0; // variable for skipping frames in case the speed increases

var stop = false;
var pause = false; //stop execution
var active = false; //animation is not active 
var rows = 5;//Number of rows of pegs
var balls = 250;
var cols = 2; // Number of columns of pegs it is a constant
var gap = 250/rows; // Gap between pegs // standard value = 250/rows / update: dynamic size based on rows
var radius = 50/rows; // Radius of pegs and balls //standard value = 50/rows  // same
var bins = []; // Array to store the number of balls in each bin
var timer = null;// Variable to store the timer
var speed = 1000; //canot be reseted unsing resetValues()
var animate; // Variable to hold the function that animates one step of the simulation
var coordinates = []; //deepest level pegs coordinates
var statsWatcher = {}; // contains the x postion of the buckets as keys and 
                            // an array of corresponding length and how often the ball entered the bucket
                            // as a second value x:[corresponding length, count]

var simplifiedStats = []; // is a simplified version of statswatcher which only includes the amount of balls stored in the indices of bins


var newRowValue = rows; // temp save of the rows
var newBallValue = balls;
var probabilityRight = 50;
var probabilityLeft = 50;

// Extract 'group_id' from the current URL
const urlParams = new URLSearchParams(window.location.search);
const group_name = urlParams.get('group_id');


var data = {group_id: group_name , statswatcher:[],rows:0,balls:0,probabilityLeft:0,probabilityRight:0};
console.log(group_name);

                            /*                                                      Animation
********************************************************************************************************************************** */

function generateLastArray(size) {
    let array = [];
    for(let i = -size+1; i < size; i+=2) {
        array.push(i);
    }
    return array;
}


function filterStats(stats)
{

    var arr = [];
    console.log(stats);
    var keys = Object.keys(stats).map(Number).sort((a, b) => a - b);
    console.log("stats= " , keys.length);
    for (let i = 0; i< keys.length; i++)
    {
        let key = keys[i];
        arr.push(stats[key][1]);
    }
    console.log("simplified array ", arr, "array size = ", arr.length);
    return arr;
}


function reloadCanvas(x1 = 0, y1 = 0, x2 = canvas.width, y2 = canvas.height) {
    if (x1==y1==0 & x2==canvas.width & y2==canvas.height)
    {
        ctx.clearRect(x1, y1, x2, y2);
        resetValues();
        drawPegs();
    }
    else ctx.clearRect(x1, y1, x2, y2);
}


function resetValues() { 
    pause = false; //stop execution
    active = false; //animation is not active 
    cols = 2; // Number of columns of pegs it is a constant
    gap = 250/rows; // Gap between pegs // standard value = 250/rows / update: dynamic size based on rows
    radius = 50/rows; // Radius of pegs and balls //standard value = 50/rows  // same
    bins = []; // Array to store the number of balls in each bin
    timer = null;

    for (var i = 0; i < cols; i++) {
        bins[i] = 0;
    }

    statsWatcher = {};
    simplifiedStats = [];
}

// Initialize the bins array with zeros
for (var i = 0; i < cols; i++) {
    bins[i] = 0;
}

// Draw the pegs on the canvas
function drawPegs() {
    // Loop through the rows and columns of pegs
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            // Calculate the x and y coordinates of the peg
            var x = (canvas.width-gap) / 2 + gap * (j - i / 2);
            var y = gap * (i + 1);
            // Draw a circle with the peg color
            ctx.fillStyle = "green";
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill(); 
            if (i == rows - 1) {
                drawVerticalLine(x, y);
            }
        }
        cols += 1; // increasing the column content incrementally
    }
    
    drawHorizontalLine(x, y); //�bergabe der letzten Peg's Position
}

function drawHorizontalLine(x, y) {
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo((canvas.width-gap) / 2 + gap * (-(rows-1)/ 2), y * 2.25);
    ctx.lineTo(x, y * 2.25);
    ctx.stroke();
}

function drawVerticalLine(x, y){
    coordinates.push(x);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + radius );
    ctx.lineTo(x, y * 2.25);
    ctx.stroke();
}

function drawball(x_position = canvas.width / 2, y_position = gap) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x_position, y_position, radius, 0, Math.PI * 2);
    ctx.fill();

}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//TODO:

/*function len(y, n, p, c = rows+1)
{
    let h = -p * Math.log2(p) - (1 - p)* Math.log2(1-p);
    console.log("h = "+ h);
    return (c*h*(y+radius))/n;
}*/

function drawStats(x, y, n, p) { //p = W'keit
    ctx.lineWidth = gap-2;
    let startingPoint = y * 2.25 - 2; //2 is the horizontal line width

    var length = 1.1*(y + radius)/ n; // TODO: Muss zusätzlich neben Anzahl Bälle, von W'keit und Anzahl Urnen abhängen
                                      //dazu muss len() implementiert werden
    //console.log(length);

    ctx.beginPath();
    const gradient = ctx.createLinearGradient(0,0,canvas.width, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("1.0", "red");
    gradient.addColorStop("1.0", "red");
    ctx.strokeStyle = gradient// "red";
    
    if (!statsWatcher.hasOwnProperty(x)) {

        statsWatcher[x] = [length, 1];
        ctx.moveTo(x, startingPoint);
        ctx.lineTo(x, startingPoint - length);       
    } else {

        ctx.moveTo(x, startingPoint); //ctx.moveTo(x,startingPoint - statsWatcher[x][0]);
        statsWatcher[x][0]+=length;
        statsWatcher[x][1]+=1;

        reloadCanvas(x-gap/2+2, startingPoint-2, gap-3, -statsWatcher[x][0]);//Speicherüberflussvermeidung

        ctx.lineTo(x, startingPoint - statsWatcher[x][0]);

        //console.log("x is "  +x +`,  Used js heap size: ${performance.memory.usedJSHeapSize}`); // Speicherüberflusskontrolle
    }
    ctx.stroke(); 
    ctx.strokeStyle = "black";
}

function drawStatsCount(x, y) {
    y = y * 2.25 +gap/2;
    let fontSize = gap*0.66;
    ctx.font ="bold " +fontSize + "px Arial"; //
    ctx.fillStyle = "red";
    ctx.clearRect(x-gap/2, y-gap/2, gap, gap*1.5);
    if (statsWatcher[x][1]<10)
    ctx.fillText(statsWatcher[x][1], x-gap/6, y+gap/6);
    else if(statsWatcher[x][1]<100) ctx.fillText(statsWatcher[x][1], x-gap/3, y+gap/6);
    else {
        ctx.font ="bold " + fontSize* 0.7 + "px Arial"; // 30% weniger größe bei Zahlen ab 100
        ctx.fillText(statsWatcher[x][1], x-gap/3, y+gap/8);
    }
}

// mainAnimationLoop is an asynchronous function that repeatedly calls the animate function
// as long as the animation is active and not paused. This function is responsible for 
// continuously updating the animation.
async function mainAnimationLoop() {
    while (active && !pause) {
        await animate();
        if (skip>0)
        {
            skip--;
            if (skip==0 && superSpeed) 
            {    
                skip = 7; 
                await wait(speed);
            }
        }
        else await wait(speed);
        
    }
}


// createAnimation is a higher-order function that returns animateOneStep,
// which uses closures to remember its state between calls so that we can pause the animation
function createAnimation(n, initial_n, probability) {  
    var j = 0; // Platz zwischen pegs //standard Value: 0, also Mitte 
    var i = 1; //j gerade falls i ungerade und umgekehrt //Höhenebene
    var xPos = canvas.width / 2 - 0.5 * gap * j;
    var yPos = gap * i;
    var arr = [];
    var y = gap * rows;



    return async function animateOneStep() {  
        if (n < 0) {
            active = false;
            saveData();
            submitButton.disabled = false;
            rowRangeInput.disabled = false;
            ballsAmountRangeInput.disabled = false;
            probabilityRangeInput.disabled = false; 
            return;
        }
 
        if (i <= rows+1) { 
            ctx.clearRect(0, 0, canvas.width, y + radius); //clear the upper half only
            drawball(xPos, yPos);
            drawPegs();
            cols = 2;


            if(i == rows+1) { //the last level? 
                //use statLength to draw the how often a ball fits 
                //between nth pegs. Implement and call drawStats() from here
                drawStats(xPos, y , initial_n, probability);  
                drawStatsCount(xPos, y);             
            }

            xPos = canvas.width / 2 - 0.5 * gap * j;
            yPos = gap * i;
            var random = Math.random(); //Muss angepasst wegen Variationsm�glichkeit 3
            arr.push(random);           // Dazu muss die 0,5 in If-statement angepasst 
            if (random <= probability) {
                j += 1;                 //going right 
            } else j -= 1;                 //going left
            i += 1; 
        }

        if (i > rows+1) {
            n -= 1;
            j = 0; 
            i = 1; 
            xPos = canvas.width / 2 - 0.5 * gap * j;
            yPos = gap * i;
            arr = [];
            y = gap * rows;
        }  
    }
}

function saveData() {
    data.balls = balls;
    data.rows = rows;
    data.probabilityLeft = probabilityLeft/100;
    data.probabilityRight = probabilityRight/100;
    simplifiedStats = filterStats(statsWatcher);
    data.statswatcher = simplifiedStats;
}


/*                                                     Eventhandlers
**********************************************************************************************************************************/


var startButton = document.getElementById("start");
var stopButton = document.getElementById("stop");
var pauseButton = document.getElementById("pause");
var submitButton = document.getElementById("sendData");
var exportButton = document.getElementById("exportData");
var rowRangeInput = document.getElementById("rangeInput"); //rows adjustment control
var rowRangeValue = document.getElementById("rangeValue"); //current rows display
var speedRangeInput = document.getElementById("rangeInput2"); //speed adjustment control
var speedRangeValue = document.getElementById("rangeValue2"); //current speed display
var ballsAmountRangeInput = document.getElementById("rangeInput3"); //TODO
var ballsAmountRangeValue = document.getElementById("rangeValue3"); //TODO
var probabilityRangeInput = document.getElementById("rangeInput4"); //TODO
var probabilityRangeValue = document.getElementById("rangeValue4"); //TODO



ballsAmountRangeInput.addEventListener("input", () => {
    newBallValue = Number(ballsAmountRangeInput.value);
    ballsAmountRangeValue.textContent = "Anzahl Bälle = " + Number(newBallValue);
    balls = newBallValue; 
   
});

probabilityRangeInput.addEventListener("input", () => {
        probabilityLeft = Number(probabilityRangeInput.value); 
        probabilityRight = 100 - probabilityLeft;
        probabilityRangeValue.innerHTML = "Wahrscheinlichkeit "+ probabilityLeft + " % | "+ probabilityRight +" % ";
    });

speedRangeInput.addEventListener("input", () => {
    speed = 1000 - (Number(speedRangeInput.value));
    speedRangeValue.textContent = "Fallgeschwindigkeit = " + Math.ceil((speedRangeInput.value*100)/1000) + "%"; //changed from floor to ceil

    //console.log("value is " +speedRangeInput.value+ " speed is " + speed);


    if (speedRangeInput.value == 1000)
    {
        superSpeed=true;
        skip = 7;
    }
    else
    {
        superSpeed=false;
        skip = 0;
    }
});

rowRangeInput.addEventListener("input", () => {       
        rowRangeValue.textContent = "Anzahl Reihen = " + rowRangeInput.value;
        newRowValue = Number(rowRangeInput.value);
        rows = newRowValue;
        reloadCanvas();  
});

startButton.addEventListener("click", () => {
     if (pause) {
        // If the animation was paused, resume it
        pause = false;
        mainAnimationLoop();   
    } else if (!active) {
        // If the animation was not active, start it
        reloadCanvas();
        resetValues();
        active = true;
        rowRangeInput.disabled = true;
        ballsAmountRangeInput.disabled = true;
        probabilityRangeInput.disabled = true;

        //intialisiere Statswatcher mit Nullen
        var binsArray = generateLastArray(rows);
        for (let s = 0; s<binsArray.length; s++)
        {
            statsWatcher[canvas.width / 2 - 0.5 * gap * binsArray[s]] = [null, 0];
        }
        console.log(statsWatcher);

        animate = createAnimation(balls-1,balls-1,probabilityLeft/100); 
        mainAnimationLoop();
    }
});

pauseButton.addEventListener("click",  () => {
    if (active) {
        pause = true;
    }
});

stopButton.addEventListener("click", async () => {  
        active = false;
        rowRangeInput.disabled = false;
        ballsAmountRangeInput.disabled = false;
        probabilityRangeInput.disabled = false;
        await wait(300);
        statsWatcher = {};
        reloadCanvas();
});

submitButton.addEventListener("click", async () => {
    const response = await fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)     
    });
        submitButton.disabled = true;
        data = {group_id: group_name,statswatcher:{},rows:0,balls:0,probabilityLeft:0,probabilityRight:0};
        const res = await response.json();
        console.log(res.message);
});


exportButton.addEventListener("click", async () => {
        const response = await fetch(`/plot?group_id=${group_name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        window.location.href = `/test?group_id=${group_name}`; //maybe wrong?
            
    
});


 /*                                                       Main
************************************************************************************************************************************/


//Initialization
drawPegs();
submitButton.disabled = true;
 



