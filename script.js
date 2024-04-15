// Get the canvas element and its context
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Define some constants for the simulation
var rows = 50; // Number of rows of pegs
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
        }
        cols += 1; // increasing the column content incrementally
    }
}

function drawball(x_position = canvas.width / 2, y_position = gap) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x_position, y_position, radius, 0, Math.PI * 2);
    ctx.fill();

}

function ballProbabilityMotion() {
    var j = 0; // Platz zwischen pegs //standard Value: 0, also Mitte 
    var i = 1; //j gerade falls i ungerade und umgekehrt //Höhenebene
    var xPos = canvas.width / 2 - 0.5 * gap * j;
    var yPos = gap * i;
    var arr = [];
    while (i <= rows+1)
    {

        drawball(xPos, yPos);
        var xPos = canvas.width / 2 - 0.5 * gap * j;
        var yPos = gap * i;
        var random = Math.random(); //Muss angepasst wegen Variationsmöglichkeit 3
        arr.push(random);           // Dazu muss die 0,5 in If-statement angepasst 
        if (random <= 0.5) {
            j += 1; //going right 
        }
        else j -= 1; //going left

        i += 1;  //go to the next level(downwards)

    }
    console.log(arr);
}

// Draw the balls on the canvas
/*function drawBalls() { //unfunctional!!
    // Loop through the balls array
    for (var i = 0; i < balls.length; i++) {
        // Get the current ball
        var b = balls[i];
        // Update the position of the ball
        b.x += b.vx;
        b.y += b.vy;
        // Check if the ball hits a peg
        var row = Math.floor(b.y / gap);
        var col = Math.floor((b.x - (canvas.width - gap * (rows - 1)) / 2) / gap + row / 2);
        if (row >= 0 && row < rows && col >= 0 && col < cols) {
            // Calculate the distance between the ball and the peg
            var dx = b.x - ((canvas.width - gap * (rows - 1)) / 2 + gap * (col - row / 2));
            var dy = b.y - (gap * (row + 1));
            var d = Math.sqrt(dx * dx + dy * dy);
            // If the distance is less than the sum of the radii, bounce the ball
            if (d < radius * 2) {
                // Choose a random direction to bounce
                var dir = Math.random() < 0.5 ? -1 : 1;
                // Set the velocity of the ball
                b.vx = dir * speed;
                b.vy = speed;
            }
        }
        // Check if the ball reaches the bottom
        if (b.y > canvas.height - radius) {
            // Increment the bin count
            bins[col]++;
            // Remove the ball from the array
            balls.splice(i, 1);
            i--;
        } else {
            // Draw a circle with the ball color
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(b.x, b.y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}*/

// Draw the bins on the canvas
/*function drawBins() {    //unfunctional!!
    // Loop through the bins array
    for (var i = 0; i < bins.length; i++) {
        // Calculate the x and y coordinates of the bin
        var x = (canvas.width - gap * (rows - 1)) / 2 + gap * (i - rows / 2);
        var y = canvas.height - radius - bins[i] * radius * 2;
        // Draw a vertical line to represent the bin
        ctx.beginPath();
        ctx.moveTo(x, canvas.height - radius);
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}*/

// Draw the galton board on the canvas
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw the pegs, balls and bins
    drawPegs();
    //drawball(canvas.width / 2 - 0.5 * gap * 0, gap * 5);
    ballProbabilityMotion();
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

// Stop the simulation
function stop() {
    // Clear the timer
    clearTimeout(timer);
}

// Get the start and stop buttons
var startButton = document.getElementById("start");
var stopButton = document.getElementById("stop");

// Add event listeners to the buttons
startButton.addEventListener("click", start);
stopButton.addEventListener("click", stop);

// Draw the galton board for the first time
draw();
