// Get the canvas element and its context
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerHeight * 0.3; //ca. 500px
canvas.height = window.innerHeight*0.4;
console.log(window.innerWidth);

// Define some constants for the simulation
var stop = false; //stop execution
var active = false; //animation is not active 
var rows = 10;//Number of rows of pegs
var cols = 2; // Number of columns of pegs
var gap = 250/rows; // Gap between pegs // standard value = 50 / update: dynamic size based on rows
var radius = 50/rows; // Radius of pegs and balls //standard value = 10  // same
var speed = 5; // Speed of balls
var interval = 100; // Interval between balls
var bins = []; // Array to store the number of balls in each bin
var balls = []; // Array to store the balls in motion
var timer = null; // Variable to store the timer

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
            if (i == rows - 1)
            {
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

var coordinates = []; //deepest level pegs coordinates

function drawVerticalLine(x, y)
{
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

function wait(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function ballProbabilityMotion(speed = 150, n = 5) {  //muss n mal durchlaufen
    if (n==0) {active= false; return;}
    const intial_n = n;
    var j = 0; // Platz zwischen pegs //standard Value: 0, also Mitte 
    var i = 1; //j gerade falls i ungerade und umgekehrt //Höhenebene
    var xPos = canvas.width / 2 - 0.5 * gap * j;
    var yPos = gap * i;
    var arr = [];
    while (i <= rows+1)
    {
        if (!stop)
        {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawball(xPos, yPos);
            draw();
            await wait(speed);
            cols = 2;
            
            if(i==rows) //the last level? 
            {
                for (let v = 0; v < coordinates.length+1; v++)
                {
                    if (v<coordinates.length && coordinates[v]< xPos && coordinates[v+1] >= xPos)
                    {
                        //var StatLenght = (y * 2.25 - (y+radius))/ intial_n;
                        //TODO : use statLength to draw the how often a ball fits 
                        //between nth pegs. Implement and call drawStats() from here
                    }  
                }
            }
            

            /*setTimeout(() => {
                requestAnimationFrame(ballProbabilityMotion);
            }, 1000 / 60); // Adjust the delay to change the frame rate*/

            var xPos = canvas.width / 2 - 0.5 * gap * j;
            var yPos = gap * i;
            var random = Math.random(); //Muss angepasst wegen Variationsm�glichkeit 3
            arr.push(random);           // Dazu muss die 0,5 in If-statement angepasst 
            if (random <= 0.5) {
                j += 1; //going right 
            }
            else j -= 1; //going left


            i += 1;  //go to the next level(downwards)
        }
        else 
        {
            stop = false;
            active = false;
            return;
        }
    }
    console.log(arr);
    ballProbabilityMotion(speed, n-1);
}

function drawStats(x, y, length)
{
    //TODO
}




/*async function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    await wait(200);
    cols = 2;
    ballProbabilityMotion(); // to be modified for controlling the speed
    


    
    // Request the next frame after a specific delay (e.g., 1000ms / 60fps = ~16.67ms)
    setTimeout(() => {
      requestAnimationFrame(animate);
    }, 1000 / 60); // Adjust the delay to change the frame rate
}*/



// Draw the galton board on the canvas
function draw() {
    // Clear the canvas
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw the pegs, balls and bins
    drawPegs();

    //drawball(canvas.width / 2 - 0.5 * gap * 0, gap * 5);
    //ballProbabilityMotion();
    //drawBalls();
    //drawBins();
}

// Start the simulation
function start() {
    // Create a new ball at the top center of the canvas
    var b = {
        x: canvas.width / 2,
        y: radius,
        vx: 0,
        vy: speed
    };
    // Add the ball to the array
    balls.push(b);
    // Set the timer to create more balls
    timer = setTimeout(start, interval);
}



// Get the start and stop buttons
var startButton = document.getElementById("start");
var stopButton = document.getElementById("stop");

// Add event listeners to the buttons
startButton.addEventListener("click", () => {

    if (!active) //assert the function runs only once at a time
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cols= 2;
        active = true;
        ballProbabilityMotion();
    }

});
stopButton.addEventListener("click", () => {
    if (active)
    stop = true;
});

// Draw the galton board for the first time

//Initialization
drawPegs();
//draw();
