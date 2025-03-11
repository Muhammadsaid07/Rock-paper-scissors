let objects = [];
let images = {};
let bullets = [];
let gameRunning = true;
let bulletSize = 10;
let gun;

function preload() {
    images.rock = loadImage("./rock.png");
    images.paper = loadImage("./paper.png");
    images.scissors = loadImage("./scissors.png");
    gun = loadImage("./gun.png");
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < 33; i++) {
        objects.push(new RPS(random(width), random(height), "rock"));
        objects.push(new RPS(random(width), random(height), "paper"));
        objects.push(new RPS(random(width), random(height), "scissors"));
    }
}

function draw() {
    background(220);
    if (gameRunning) {
        for (let obj of objects) {
            obj.move();
            obj.display();
        }
        for (let bullet of bullets) {
            bullet.move();
            bullet.display();
        }
        image(gun, width / 2 - 25, height - 100, 50, 100);
        checkCollisions();
        checkBulletHits();
        checkWinner();
    } else {
        textSize(32);
        fill(0);
        textAlign(CENTER, CENTER);
        text("Game Over", width / 2, height / 2);
    }
}

class RPS {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.dx = random(-3, 3);
        this.dy = random(-3, 3);
    }
    
    move() {
        this.x += this.dx;
        this.y += this.dy;
        if (this.x < 0 || this.x > width) this.dx *= -1;
        if (this.y < 0 || this.y > height) this.dy *= -1;
    }
    
    display() {
        image(images[this.type], this.x, this.y, 50, 50);
    }
    
    isHit(bullet) {
        return dist(bullet.x, bullet.y, this.x + 25, this.y + 25) < bullet.size;
    }
}

class Bullet {
    constructor(x, y, angle, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = 8;
        this.dx = cos(angle) * this.speed;
        this.dy = sin(angle) * this.speed;
    }
    
    move() {
        this.x += this.dx;
        this.y += this.dy;
    }
    
    display() {
        fill(255, 215, 0);
        ellipse(this.x, this.y, this.size, this.size);
    }
}

function checkCollisions() {
    for (let i = 0; i < objects.length; i++) {
        for (let j = i + 1; j < objects.length; j++) {
            let obj1 = objects[i];
            let obj2 = objects[j];
            if (dist(obj1.x, obj1.y, obj2.x, obj2.y) < 50) {
                if ((obj1.type === "rock" && obj2.type === "scissors") ||
                    (obj1.type === "scissors" && obj2.type === "paper") ||
                    (obj1.type === "paper" && obj2.type === "rock")) {
                    obj2.type = obj1.type;
                } else if ((obj2.type === "rock" && obj1.type === "scissors") ||
                           (obj2.type === "scissors" && obj1.type === "paper") ||
                           (obj2.type === "paper" && obj1.type === "rock")) {
                    obj1.type = obj2.type;
                }
            }
        }
    }
}

function checkBulletHits() {
    bullets = bullets.filter(bullet => {
        for (let i = objects.length - 1; i >= 0; i--) {
            if (objects[i].isHit(bullet)) {
                objects.splice(i, 1);
                return false; 
            }
        }
        return bullet.x > 0 && bullet.x < width && bullet.y > 0 && bullet.y < height;
    });
}

function checkWinner() {
    let types = new Set(objects.map(obj => obj.type));
    if (types.size === 1) {
        let winner = [...types][0];
        alert(`${winner.charAt(0).toUpperCase() + winner.slice(1)} Wins!`);
        gameRunning = false;
    }
}

function mousePressed() {
    let angle = atan2(mouseY - (height - 100), mouseX - (width / 2));
    let size = bulletSize;
    bullets.push(new Bullet(width / 2, height - 100, angle, size));
}