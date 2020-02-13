const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn'); 
const rules = document.getElementById('rules'); 
const canvas = document.getElementById('canvas'); 
const ctx = canvas.getContext('2d'); 

const brickRowCount = 13; 
const brickColumnCount = 9; 


let score = 0; 
/* ******************** BRICKS***************** */
// Create brick props
const brickInfo = {
  w: 50,
  h: 15,
  padding: 5,
  offsetX: 45,
  offsetY: 60,
  visible: true
}

// Create bricks
const bricks = [];
for(let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for(let j = 0; j < brickColumnCount; j++){
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY; 
    bricks[i][j] = { x, y, ...brickInfo }; 
  }
}

// Draw Bricks on canvas
function drawBricks(){
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath(); 
      ctx.rect(brick.x, brick.y, brick.w, brick.h); 
      ctx.fillStyle = brick.visible ? 'orange' : 'transparent'; 
      ctx.fill(); 
      ctx.closePath; 
    });
  }); 
}

/* ************************ BALL ************************************* */
// Create ball props
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 5,
  speed: 4, 
  dx: 4,
  dy: -4
}


// Draw ball on canvas
function drawBall(){
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2); 
  ctx.fillStyle = 'red'; 
  ctx.fill(); 
  ctx.closePath(); 
}

/* ****************************** PADDLE ******************************** */
// Create paddle props
const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20, 
  w: 80,
  h: 10,
  speed: 8,
  dx: 0 
}

// Draw paddle on canvas
function drawPaddle(){
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h); 
  ctx.fillStyle = 'teal';
  ctx.fill();
  ctx.closePath();
  
  //Trapezoid-Paddle
  // ctx.beginPath() ;
  // ctx.strokeStyle = 'teal';
  // ctx.moveTo(360, 580);
  // ctx.lineTo(440, 580);
  // ctx.lineTo(450,590); 
  // ctx.lineTo(350,590); 
  // ctx.fillStyle = 'teal';
  // ctx.fill(); 
  // ctx.closePath(); 
}

// Draw score on canvas
function drawScore(){
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

// Draw everything
function draw(){
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height); 

  drawBall(); 
  drawPaddle(); 
  drawScore(); 
  drawBricks(); 
}

// move paddle on canvas
function movePaddle(){
  paddle.x += paddle.dx; 

  // wall detection
  if(paddle.x + paddle.w > canvas.width){
    paddle.x = canvas.width - paddle.w; 
  }

  if(paddle.x < 0){
    paddle.x = 0; 
  }

}

function moveBall(){
  ball.x += ball.dx; 
  ball.y += ball.dy; 

  // Wall collision (x =>  right/left )
  if(ball.x + ball.size > canvas.width || ball.x - ball.size < 0 ){
    ball.dx *= -1;  // 
  } 

  // Wall collision (y => top/bottom)
  if(ball.y + ball.size > canvas.height || ball.y - ball.size < 0){
    ball.dy *= -1; 
  }
  // console.log(ballx, ball.y); // position of the ball

  // Paddle collision
  if(
    ball.x - ball.size > paddle.x && 
    ball.x + ball.size < paddle.x + paddle.w && 
    ball.y + ball.size > paddle.y
    ){
    ball.dy = -ball.speed; 
  }

  // Brick collision
  bricks.forEach(column =>{
    column.forEach(brick => {
      if(brick.visible){
        if(
          ball.x - ball.size > brick.x &&          // left brick side check
          ball.x + ball.size < brick.x + brick.w && // right brick side check
          ball.y + ball.size > brick.y &&           // top brick side check
          ball.y - ball.size < brick.y + brick.h    // bottom brick side check
        ) {
          ball.dy *= -1; 
          brick.visible = false; 

          increaseScore(); 
        }
      }
    });
  }); 

  // Hit bottom wall lose
  if(ball.y + ball.size > canvas.height) {
    showAllBricks(); 
    score = 0; 
  }
}

// increase score by brick collision
function increaseScore(){
  score++; 

  if(score % (brickRowCount * brickColumnCount) === 0){
    showAllBricks(); 
  }
}

// Make all bricks appear
function showAllBricks(){
  bricks.forEach(column => {
    column.forEach(brick => (brick.visible = true)); 
  }); 
}

// Update canvas drawing and animation
function update(){
  movePaddle(); 
  moveBall(); 
  
  //Draw everything
  draw(); 

  requestAnimationFrame(update); 
}
update(); 

// Keyboard event
function keyDown(e){
  if(e.key === 'Right'|| e.key === 'ArrowRight'){
    paddle.dx = paddle.speed;
  } else if ( e.key === 'Left' || e.key === 'ArrowLeft'){
    paddle.dx = -paddle.speed; 
  }
}

function keyUp(e){
  if(e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft'){
    paddle.dx = 0;
  }
}

// Keyboard event handler
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp); 

// Rules and close event handlers
rulesBtn.addEventListener('click', () => rules.classList.add('show')); 
closeBtn.addEventListener('click', () => rules.classList.remove('show')); 


