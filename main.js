// select canvas element
const canvas = document.getElementById("garbauge");

// getContext of canvas = methods and properties to draw and do a lot of thing to the canvas
const ctx = canvas.getContext('2d');

// Load Textures
var _img = document.getElementById('id1');

// Create a rectangle
class Rect {
    constructor(x, y, w, h) {
        this.x = x; 
        this.y = y; 
        this.w = w; 
        this.h = h; 
    }
}

// Check collision between two objects
function checkCollision( x,  y,  w,  h,  x2,  y2,  w2,  h2) {
	var collide = false;

	if (x+w > x2 && x < x2 + w2 && 
        y+h > y2 && y < y2 + h2) {
		collide = true;
	}

	return collide;
}

// Textures
var gPlayer = new Image;
var gHoarder = new Image;
gPlayer.src = 'resource/player.png';
gHoarder.src = 'resource/enemy.png';

// Sounds
let sScore = new Audio();
sScore.src = "resource/snd_time.wav";

// Globals
let gameover = false;
const winningScore = 7;

// hoarder object
const hoarder = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 20,
    w : 48,
    h : 48,
    vX : 5,
    vY : 5,
    speed : 7,
    color : "WHITE"
}

// User (Player)
const user = {
    x : canvas.width * 0.25,      // left side of canvas
    y : canvas.height * 0.50,     // -100 the height of paddle
    w : 24,
    h : 24,
    width : 24,
    height : 24,
    alive : true,
    lives : 10,
    color : "WHITE",

    // Movement
    moveLeft : false,
    moveRight : false,
    moveUp : false,
    moveDown : false,
    moving : false,
    vX : 0.0,
    vY : 0.0,
    vMax : 12,
    speed : 6,

    Update: function () {
        // User movement
        if (this.moveLeft && !this.attack) {
            this.vX -= this.speed;
            this.moving = true;
        }
        if (this.moveRight && !this.attack) {
            this.vX += this.speed;
            this.moving = true;
        }
        if (this.moveUp && !this.attack) {
            this.vY -= this.speed;
            this.moving = true;
        }
        if (this.moveDown && !this.attack) {
            this.vY += this.speed;
            this.moving = true;
        }

        // Player not moving in X position
        if (!this.moveleft && !this.moveright) {
            this.vX = this.vX - this.vX * 0.2;
        }

        // Player not moving in Y position
        if (!this.moveup && !this.movedown) {
            this.vY = this.vY - this.vY * 0.2;
        }
        
        // Player not moving at all
        if (!this.moveUp && !this.moveDown && !this.moveLeft && !this.moveRight) {
            this.moving = false;
        }

        // Movement max
        if (this.vX > this.vMax) {
            this.vX = this.vMax;
        }
        if (this.vX < -this.vMax) {
            this.vX = -this.vMax;
        }
        if (this.vY > this.vMax) {
            this.vY = this.vMax;
        }
        if (this.vY < -this.vMax) {
            this.vY = -this.vMax;
        }

        // Movement
        this.x += this.vX;
        this.y += this.vY;

        // Movement decay
        this.vX = this.vX - this.vX * 0.7;
        this.vY = this.vY - this.vY * 0.7;

        // Player level boundaries
        if(this.x < 0 ){
            this.x = 0;
        }
        if(this.y < 0 ){
            this.y = 0;
        }
        if(this.x+this.w > canvas.width ){
            this.x = canvas.width-this.w;
        }
        if(this.y+this.h > canvas.height){
            this.y = canvas.height-this.h;
        }
    }
}

// draw a rectangle, will be used to draw paddles
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// Reset ball if scoring
function resetGame(){
    user.x = canvas.width * 0.25;
    user.y = canvas.height * 0.50;

    hoarder.x = canvas.width * 0.75;
    hoarder.y = canvas.height * 0.50;
}

// Render text
function drawText(text,x,y, alignment){
    if (alignment == "center") {
        ctx.textAlign = "center";
    }
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

// Keydown events
document.addEventListener('keydown', (event)=> {
    if (event.key == "a") {
         user.moveLeft = true;
    }
    if (event.key == "d") {
         user.moveRight = true;
    }
    if (event.key == "w") {
         user.moveUp = true;
    }
    if (event.key == "s") {
         user.moveDown = true;
    }

    // If Spacebar pressed
    if (event.key == " ") {
         if (gameover) {
            gameover = false;
            user.lives = 10;
            resetGame();
         } else {
           // user.SlashAttack();
         }
    }
 });
 
 
 // Keyup events
 document.addEventListener('keyup', (event) => {
     if (event.key == "a") {
         user.moveLeft = false;
     }
     if (event.key == "d") {
         user.moveRight = false;
     }
     if (event.key == "w") {
         user.moveUp = false;
     }
     if (event.key == "s") {
         user.moveDown = false;
     }
 });

// Update
function UpdateAll(){

    // If not game over, continue game
    if (!gameover)
    {
        // Update Player
        user.Update();

        // Follow player
		{
			let vX=0, vY=0;

            // Center of player
			let bmx  = user.x+user.w/2;
			let bmy  = user.y+user.h/2;
			let distance = Math.sqrt((bmx - hoarder.x-hoarder.w/2) * (bmx - hoarder.x-hoarder.w/2)+
								(bmy - hoarder.y-hoarder.h/2) * (bmy - hoarder.y-hoarder.h/2));

			// Start following player
			if (distance > 10){
				// Move towards player
				vX 	= 6 * (bmx - hoarder.x-hoarder.w/2) / distance;
				vY 	= 6 * (bmy - hoarder.y-hoarder.h/2) / distance;
				hoarder.x += vX;
				hoarder.y += vY;
			}

            // Hoarder touched the garbage!
            if (checkCollision(user.x, user.y, user.w, user.h, hoarder.x, hoarder.y, hoarder.w, hoarder.h))
            {
                // Play SFX when collision occurs
                sScore.play();

                // Determine if player should lose life or gameover
                if (user.lives > 0) {

                    // Lose life
                    user.lives--;

                    // Reset positions
                    resetGame();
                } else {

                    // Gameover screen
                    gameover = true;
                }
            }
		}
    }
}

// Render an image, with clips
function RenderImg(img, x, y, w, h) {
    ctx.drawImage(img, x, y, w, h);
}

// RenderAll function, the function that does all tdhe drawing
function RenderAll(){
    
    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "#000");

    // Render Player
    RenderImg(gPlayer, user.x, user.y, user.w, user.h);
    
    // Render Hoarder
    RenderImg(gHoarder, hoarder.x, hoarder.y, hoarder.w, hoarder.h);

    /////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////
    //--------------------------------------- Draw UI -----------------------------------------//
    {
        // draw the user lives to the left
        drawText(user.lives,canvas.width * 0.50, canvas.height * 0.15);

        // Draw game over ctx
        if (gameover) {
            
            if (user.lives <= 0) {
                drawText("You ran out of lives!", canvas.width/2, canvas.height * 0.75, "center");
            }

            drawText("Press 'Spacebar' to restart game.", canvas.width/2, canvas.height * 0.90, "center");
        }
    }
    //--------------------------------------- Draw UI -----------------------------------------//
    /////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////
}

function game(){
    UpdateAll();
    RenderAll();
}

// number of frames per second
let framePerSecond = 60;

//call the game function 50 times every 1 Sec
let loop = setInterval(game,1000/framePerSecond);


