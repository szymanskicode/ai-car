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
const dnaSelect = document.getElementById('dna') as HTMLSelectElement;
dnaSelect.onchange = (e: any) => localStorage.setItem('dna', JSON.stringify(e.target.value));
const carsSelect = document.getElementById('cars') as HTMLSelectElement;
carsSelect.onchange = (e: any) => localStorage.setItem('cars', JSON.stringify(e.target.value));

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

let n = 1;
let mutateValue = 0.5;

if (localStorage.getItem('cars')) {
    const value = localStorage.getItem('cars');
    n = Number(JSON.parse(value));
}

if (localStorage.getItem('dna')) {
    const value = localStorage.getItem('dna');
    mutateValue = Number(JSON.parse(value));
}

carsSelect.value = n.toString();
dnaSelect.value = mutateValue.toString();

const cars = generateCars(n);
let bestCar = cars[0];

if (!localStorage.getItem('bestBrain') && !localStorage.getItem('init')) {
    const defaultBestBrain = JSON.stringify({
        levels: [
            {
                inputs: [0.4102945266595419, 0, 0, 0, 0],
                outputs: [0, 0, 0, 1, 0, 0],
                biases: [0.1962922231959734, 0.5367099018497876, 0.10172583674319013, -0.26908625859977486, 0.3394455918976538, -0.05712848365334566],
                weights: [
                    [0.17974021862359968, -0.11102523429791877, -0.5426159247605957, -0.24563119225571883, -0.20495874094196087, -0.8263884527110488],
                    [-0.3503237507420016, -0.01916520473353467, -0.2989811720566733, -0.5275187843482703, 0.640436186546111, -0.2577538149130878],
                    [-0.16333994628536241, 0.2007634196383441, 0.008908677318323122, -0.45572880930700377, 0.6056748785836785, 0.045058390130371384],
                    [-0.2189972011596799, -0.7143436085596897, 0.7174669317265192, 0.5739678507114592, -0.028579345004591028, 0.41209626977243996],
                    [0.22992179021970038, 0.0008699523001456377, -0.11366559314215552, 0.1112520726841153, -0.5205834524697048, -0.5484622772246524],
                ],
            },
            {
                inputs: [0, 0, 0, 1, 0, 0],
                outputs: [1, 0, 0, 0],
                biases: [-0.27869460558716086, 0.3293407830949491, -0.7712322671108596, 0.02938609856675045],
                weights: [
                    [0.15788700253349042, -0.38073413462521466, -0.1285074249060969, 0.21719920991898256],
                    [-0.27088392588446286, 0.2951937518604202, 0.1566403781711463, -0.1169307952162455],
                    [0.4044270741907148, 0.46066921330750876, -0.4336988780424471, -0.5925630867673444],
                    [0.06784795011088751, 0.11167935260502215, -0.8212532591737616, -0.48059837028488617],
                    [-0.05319245939571893, -0.49904095966195294, 0.23269720183261322, 0.35105743271215806],
                    [-0.10240077380058787, -0.5946951690470295, 0.3046172918406014, 0.23126207775933483],
                ],
            },
        ],
    });

    localStorage.setItem('bestBrain', defaultBestBrain);
    localStorage.setItem('init', 'false');
}

if (localStorage.getItem('bestBrain')) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'));

        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, mutateValue);
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
    confirm('Warning! You are about to delete current best brain. After this you will have to train your car again, have fun!');
    localStorage.removeItem('bestBrain');
    console.log('Brain deleted!');
    location.reload();
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
