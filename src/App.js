import React, { useState } from 'react';
import Sketch from 'react-p5';
import './styles.css';

const speed = 5;
const carSize = 60;
let playerCar;

let carImg;
let enemyCarImg;

class Car {
  constructor(p5, x, y, size, img) {
    this.pos = p5.createVector(x, y);
    this.vel = p5.createVector(0, 0);
    this.size = p5.createVector(size, size / 2);
    this.img = img;
  }

  update() {
    this.pos.add(this.vel);
  }

  draw(p5) {
    // draw the car
    this.img.resize(this.size.x, 0);
    p5.image(this.img, this.pos.x, this.pos.y - this.size.x / 5);
  }

  checkBoundaries(p5) {
    if (this.pos.x < 0) {
      this.pos.x = 0;
    }

    if (this.pos.x > p5.width - this.size.x) {
      this.pos.x = p5.width - this.size.x;
    }

    if (this.pos.y < 0) {
      this.pos.y = 0;
    }

    if (this.pos.y > p5.height - this.size.y) {
      this.pos.y = p5.height - this.size.y;
    }
  }

  resetPosition(p5) {
    this.pos.x = p5.width;
    this.pos.y = p5.random(p5.height - carSize);
  }

  isColliding(cars) {
    for (let i = 0; i < cars.length; i++) {
      const car = cars[i];

      // check collision
      if (
        this.pos.x < car.pos.x + car.size.x &&
        this.pos.x + this.size.x > car.pos.x &&
        this.pos.y < car.pos.y + car.size.y &&
        this.pos.y + this.size.y > car.pos.y
      ) {
        return true;
      }
    }

    return false;
  }

  checkLeftBorder(p5) {
    if (this.pos.x + this.size.x < 0) {
      this.resetPosition(p5);
    }
  }
}

export default function App() {
  const [gameDetails, setGameDetails] = useState({
    score: 0,
    visible: 'none',
    enemyCars: [],
    link: '',
    p5: null
  });

  const enemyCarsNr = Math.floor(window.innerWidth / 80);

  const startGame = (p5) => {
    playerCar = new Car(
      p5,
      20,
      p5.random(p5.height - carSize),
      carSize,
      carImg
    );

    for (let i = 0; i < enemyCarsNr; i++) {
      const car = new Car(
        p5,
        p5.width,
        p5.random(p5.height - carSize),
        carSize,
        enemyCarImg
      );

      car.vel.x = p5.random(-speed * 2, -speed);
      setGameDetails((state) => ({
        ...state,
        enemyCars: [...state.enemyCars, car]
      }));
    }

    p5.loop();
  };

  const preload = (p5) => {
    carImg = p5.loadImage(
      'https://image.flaticon.com/icons/svg/296/296216.svg'
    );
    enemyCarImg = p5.loadImage(
      'https://image.flaticon.com/icons/svg/744/744465.svg'
    );
  };

  const setup = (p5) => {
    p5.createCanvas((window.innerWidth * 3) / 4, (window.innerHeight * 3) / 4);

    setGameDetails((state) => ({ ...state, p5: p5 }));
    startGame(p5);
  };

  const drawRoad = (p5) => {
    const h = 10;
    const w = p5.width / 7;
    const spaceX = 15;
    const spaceY = p5.height / 6;
    const offset = 40;

    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 6; j++) {
        p5.fill('rgba(255, 255, 255, 0.7)');
        p5.noStroke();
        p5.rect(i * w + spaceX * i - offset, j * h + spaceY * j + offset, w, h);
      }
    }
  };

  const gameOver = () => {
    const { score } = gameDetails;
    playerCar = null;
    setGameDetails((state) => ({
      ...state,
      visible: 'flex',
      score: score,
      link: `https://www.twitter.com/share?text=I scored ${score} points in this Car Avoidance Game created by @karthicktamil17. you should check it out. It's fun! 😃 &hashtags=100Days100Projects&url=https://vvcun.csb.app/`,
      enemyCars: []
    }));
  };

  const draw = (p5) => {
    const { enemyCars, score } = gameDetails;
    setGameDetails((state) => ({ ...state, score: state.score + 1 }));
    p5.background('#303952');
    drawRoad(p5);

    if (playerCar) {
      playerCar.checkBoundaries(p5);
      playerCar.update(p5);
      playerCar.draw(p5);

      if (playerCar.isColliding(enemyCars)) {
        p5.noLoop();
        gameOver();
      }
    }

    enemyCars.forEach((car) => {
      car.checkLeftBorder(p5);
      car.update(p5);
      car.draw(p5);
    });

    // drawScore
    p5.fill(255);
    p5.textSize(20);
    p5.text(`Score: ${score}`, p5.width - 120, 30);
  };

  const keyReleased = (p5) => {
    switch (p5.key) {
      case 'ArrowUp': {
        playerCar.vel.y = 0;
        break;
      }
      case 'ArrowDown': {
        playerCar.vel.y = 0;
        break;
      }
      case 'ArrowLeft': {
        playerCar.vel.x = 0;
        break;
      }
      case 'ArrowRight': {
        playerCar.vel.x = 0;
        break;
      }
      default: {
        return;
      }
    }
  };

  const keyPressed = (p5) => {
    switch (p5.key) {
      case 'ArrowUp': {
        playerCar.vel.y = -speed;
        break;
      }
      case 'ArrowDown': {
        playerCar.vel.y = speed;
        break;
      }
      case 'ArrowLeft': {
        playerCar.vel.x = -speed;
        break;
      }
      case 'ArrowRight': {
        playerCar.vel.x = speed;
        break;
      }
      default: {
        return;
      }
    }
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
  };

  return (
    <div className="app">
      <div
        className="modal_container"
        style={{
          display: gameDetails.visible
        }}
      >
        <div className="modal-content">
          <h2>Game Over!</h2>
          <p>
            Your final score: <span>{gameDetails.score}</span>
          </p>
          <button
            onClick={() => {
              setGameDetails((state) => ({
                ...state,
                score: 0,
                visible: 'none',
                enemyCars: [],
                link: ''
              }));
              startGame(gameDetails.p5);
            }}
          >
            Play Again
          </button>
          <a href={gameDetails.link} target="_blank" rel="noopener noreferrer">
            Share with your friends
          </a>
        </div>
      </div>
      <h1>Car Avoidance Game</h1>
      <h4>Control your car using the arrow keys</h4>
      <Sketch
        setup={setup}
        draw={draw}
        keyReleased={keyReleased}
        keyPressed={keyPressed}
        preload={preload}
        windowResized={windowResized}
      />
    </div>
  );
}
