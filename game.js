const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// PLAYER BUILDS
const builds = {
  shooter: { shoot: 0.9, steal: 0.3, speed: 2.5 },
  defender: { shoot: 0.5, steal: 0.9, speed: 2 },
  balanced: { shoot: 0.7, steal: 0.7, speed: 2.2 }
};

// PLAYERS (2 human players)
let p1 = { x: 100, y: 250, hasBall: true, build: builds.shooter, meter: 0, charging: false };
let p2 = { x: 100, y: 350, hasBall: false, build: builds.defender, meter: 0, charging: false };

// NPC TEAMS
let team = [{ x: 150, y: 150 }, { x: 150, y: 400 }];
let enemies = [{ x: 700, y: 150 }, { x: 750, y: 250 }, { x: 700, y: 400 }];

let keys = {};

// INPUT
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// MOVE FUNCTION
function move(player, up, down, left, right) {
  if (keys[up]) player.y -= player.build.speed;
  if (keys[down]) player.y += player.build.speed;
  if (keys[left]) player.x -= player.build.speed;
  if (keys[right]) player.x += player.build.speed;
}

// SHOOT
function shoot(player) {
  if (!player.hasBall) return;
  let success = Math.random() < player.meter * player.build.shoot;
  alert(success ? "🏀 SCORE!" : "❌ MISS");
  player.hasBall = false;
  player.meter = 0;
}

// STEAL
function steal(player) {
  enemies.forEach(e => {
    let d = Math.hypot(player.x - e.x, player.y - e.y);
    if (d < 40 && Math.random() < player.build.steal) {
      player.hasBall = true;
    }
  });
}

// UPDATE
function update() {
  // PLAYER 1 CONTROLS
  move(p1, "w", "s", "a", "d");
  if (keys[" "]) { p1.charging = true; p1.meter += 0.02; }
  else if (p1.charging) { shoot(p1); p1.charging = false; }

  if (keys["Shift"]) steal(p1);

  // PLAYER 2 CONTROLS
  move(p2, "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight");
  if (keys["Enter"]) { p2.charging = true; p2.meter += 0.02; }
  else if (p2.charging) { shoot(p2); p2.charging = false; }

  if (keys["/"]) steal(p2);

  // SIMPLE AI
  enemies.forEach(e => {
    let target = p1.hasBall ? p1 : p2;
    if (e.x > target.x) e.x -= 1;
    if (e.x < target.x) e.x += 1;
    if (e.y > target.y) e.y -= 1;
    if (e.y < target.y) e.y += 1;
  });
}

// DRAW STICK
function drawPlayer(p, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.arc(p.x, p.y - 10, 5, 0, Math.PI * 2);
  ctx.moveTo(p.x, p.y - 5);
  ctx.lineTo(p.x, p.y + 10);
  ctx.moveTo(p.x - 5, p.y);
  ctx.lineTo(p.x + 5, p.y);
  ctx.moveTo(p.x, p.y + 10);
  ctx.lineTo(p.x - 5, p.y + 20);
  ctx.moveTo(p.x, p.y + 10);
  ctx.lineTo(p.x + 5, p.y + 20);
  ctx.stroke();
}

// DRAW
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // hoop
  ctx.fillStyle = "red";
  ctx.fillRect(850, 200, 10, 80);

  drawPlayer(p1, "blue");
  drawPlayer(p2, "cyan");

  team.forEach(t => drawPlayer(t, "green"));
  enemies.forEach(e => drawPlayer(e, "black"));

  // BALL
  [p1, p2].forEach(p => {
    if (p.hasBall) {
      ctx.beginPath();
      ctx.arc(p.x + 10, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "orange";
      ctx.fill();
    }
  });

  // SHOT METERS
  ctx.fillStyle = "white";
  ctx.fillRect(50, 450, 200, 10);
  ctx.fillRect(650, 450, 200, 10);

  ctx.fillStyle = "lime";
  ctx.fillRect(50, 450, 200 * p1.meter, 10);
  ctx.fillRect(650, 450, 200 * p2.meter, 10);
}

// LOOP
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
