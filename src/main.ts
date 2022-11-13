import { Car } from './classes/Car';
import { NeuralNetwork } from './classes/Network';
import { Road } from './classes/Road';
import { Visualizer } from './classes/Visualizer';
import { CONTROL } from './models';

const carCanvas = document.getElementById('carCanvas') as HTMLCanvasElement;
carCanvas.width = 200;
const networkCanvas = document.getElementById('networkCanvas') as HTMLCanvasElement;
networkCanvas.width = 300;
const saveBtn = document.getElementById('save') as HTMLButtonElement;
saveBtn.onclick = () => save();
const delBtn = document.getElementById('delete') as HTMLButtonElement;
delBtn.onclick = () => discard();

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const n = 2;
const cars = generateCars(n);
let bestCar = cars[0];

if (localStorage.getItem('bestBrain')) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'));

        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.3);
        }
    }
}

const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, CONTROL.DUMMY, 2), //
    new Car(road.getLaneCenter(0), -300, 30, 50, CONTROL.DUMMY, 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, CONTROL.DUMMY, 2),
    new Car(road.getLaneCenter(0), -500, 30, 50, CONTROL.DUMMY, 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, CONTROL.DUMMY, 2),
    new Car(road.getLaneCenter(1), -700, 30, 50, CONTROL.DUMMY, 2),
    new Car(road.getLaneCenter(2), -700, 30, 50, CONTROL.DUMMY, 2),
];

animate(0);

function save() {
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
    console.log('Brain saved!');
}

function discard() {
    localStorage.removeItem('bestBrain');
    console.log('Brain deleted!');
}

function generateCars(n: number) {
    const cars = [];
    for (let i = 1; i <= n; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, CONTROL.AI));
    }
    return cars;
}

function animate(time: number) {
    traffic.forEach((trafficCar) => {
        trafficCar.update(road.borders, []);
    });

    cars.forEach((car) => car.update(road.borders, traffic));

    bestCar = cars.find((car) => car.y === Math.min(...cars.map((car) => car.y)));

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);
    road.draw(carCtx);
    traffic.forEach((trafficCar) => {
        trafficCar.draw(carCtx, 'red');
    });

    carCtx.globalAlpha = 0.2;
    cars.forEach((car) => car.draw(carCtx, 'blue'));
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, 'blue', true);

    carCtx.restore();

    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);

    requestAnimationFrame(animate);
}
