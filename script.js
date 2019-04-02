let context, controller, player, loop
let score = 0;

context = document.querySelector("canvas").getContext("2d");

context.canvas.height = 180;
context.canvas.width = 640;

player = {
	width: 16,
	height: 16,
	x: 144,
	y: 0,
	xVelocity: 2,
	yVelocity: 2,
	jumping: true,
	ducking: false,
};

obstacle = {
	height: 32,
	width: 16,
	x: 630,
	y: 130,
	xVelocity: 2
}

controller = {
	left: false,
	right: false,
	up: false,
	down: false,
	keyListener:(event) => {

		let key_state = (event.type === "keydown") ? true: false;

		switch(event.keyCode) {
			case 37: 
				controller.left = key_state;
				console.log("Left");
				break;
			
			case 38:
				controller.up = key_state;
				console.log("Up")
				break;

			case 39:
				controller.right = key_state;
				console.log("Right")
				break;

			case 40:
				controller.down = key_state;
				console.log("Down")
				break;
		}
	}
}

function controllerLogic() {
	if (controller.up && player.jumping === false) {
		player.yVelocity -= 20;
		player.jumping = true;
	}

	if (controller.left) {
		player.xVelocity -= 0.5;
	}

	if (controller.right) {
		player.xVelocity += 0.5;
	}

	if (controller.down && player.ducking === false) {
		player.height = player.height / 2;
		player.ducking = true;
	} else {
		player.height = 16;
		player.ducking = false;
	}		
}

function playerMovement(){
	// Gravity
	player.yVelocity += 1.0;

	// Add Velocity to player 
	player.x += player.xVelocity;
	player.y += player.yVelocity;

	// Friction (slows down the velocity)
	player.xVelocity *= 0.9; 
	player.yVelocity *= 0.9;

	let groundLine = 16;
	let topPlayerCoord = player.height;

	if (player.y > 180 - groundLine - topPlayerCoord) {
		player.jumping = false;
		player.y = 180 - groundLine - topPlayerCoord;
		player.yVelocity = 0;
	}

	if (player.x < -32) {
		player.x = 640;
	}

	if (player.x > 640) {
		player.x = 32;
	}

	if (obstacle.x < -32) {
		obstacle.x = 640;
	}	
}

// TODO: Instantiate Objects
class Obstacle {

	constructor(x,y, width, height, xVelocity, color) {
		this.x = x;
		this.y = y;
		this.height = height;
		this.width = width; 
		this.xVelocity = xVelocity;
  }

	obstacleMovement(speed, velocity) {
		this.x -= speed;
		this.xVelocity *= velocity;
	}

	drawObstacle(color) {
		context.fillStyle = color;
		context.beginPath();
		context.rect(this.x,this.y,this.width, this.height);
		context.fill();
	}
}

function obstacleMovement() {
	// Add Velocity and Friction to Obstacle
	obstacle.x -= 3.5;
	obstacle.xVelocity *= 0.9;
}

function drawPlayer() {
	// Player
  context.fillStyle = "#202020";
  context.fillRect(0, 0, 640, 180);// x, y, width, height
  context.fillStyle = "#FF0000";// hex for red
  context.beginPath();
  context.rect(player.x, player.y, player.width, player.height);
  context.fill();
}

function drawGround() {
  // Ground
  context.strokeStyle = "#202830";
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(0, 164);
  context.lineTo(640, 164);
  context.stroke();
}

function drawObstacles(color) {
  // Obstacle
  context.fillStyle = "#00FF00";// hex for red
  context.beginPath();
  context.rect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  context.fill();		
}

function getDistance(x1, y1, x2, y2) {
	let xDistance = x2 - x1;
	let yDistance = y2 - y1;

	let totalDistance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));

	return totalDistance;
}

function drawScoreText() {
  // Score Text
  context.font = "30px Arial";
  context.fillStyle = "white";
  score += .05;
	context.fillText(Math.round(score), 10, 50);

}

function gameOver() {
	context.font = "50px monospace";
	context.fillStyle = "white";
	score = 0;
	context.fillText("Game Over", context.canvas.width/2 - 120, context.canvas.height/2);
	setTimeout(() => {
		document.location.reload();
	},100);
}


loop = ()=> {
	// Controls
	controllerLogic();

	// Movement
	playerMovement();
	obstacleMovement();
		
	// Drawing
	drawPlayer();
	drawGround();
	drawObstacles("#00FF00");

	obstacle2 = new Obstacle(600, 130, 16, 32, 1);
	obstacle2.obstacleMovement(-3.5, 0.9);
	obstacle2.drawObstacle("#00FF00");

	// Collision Detections
	let obstacleBuffer = 7;
	if (getDistance(player.x, player.y, obstacle.x, obstacle.y) < player.width + (obstacle.width - obstacleBuffer)) {
		console.log('collision detected');
		gameOver();
	}

	if (getDistance(player.x, player.y, obstacle2.x, obstacle2.y) < player.width + (obstacle2.width - obstacleBuffer)) {
		console.log('collision detected');
		gameOver();
	}

	drawScoreText();

	// call update when the browser is ready to draw again
	window.requestAnimationFrame(loop);
};

(function(){
  let requestAnimationFrame = window.requestAnimationFrame || 
                              window.mozRequestAnimationFrame || 
                              window.webkitRequestAnimationFrame || 
                              window.msRequestAnimationFrame;

	window.addEventListener("keydown", controller.keyListener)
	window.addEventListener("keyup", controller.keyListener);
	window.requestAnimationFrame(loop);

})()



