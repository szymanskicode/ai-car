import { Car } from './classes/Car';
import { Road } from './classes/Road';
import { Visualizer } from './classes/Visualizer';
import { CONTROL } from './models';

const canvas1 = document.getElementById('canvas1') as HTMLCanvasElement;
canvas1.width = 200;
const canvas2 = document.getElementById('canvas2') as HTMLCanvasElement;
canvas2.width = 300;

const ctx1 = canvas1.getContext('2d');
const ctx2 = canvas2.getContext('2d');
const road = new Road(canvas1.width / 2, canvas1.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, CONTROL.AI);
const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, CONTROL.DUMMY, 2)];

animate(0);

function animate(time: number) {
    traffic.forEach((trafficCar) => {
        trafficCar.update(road.borders, []);
    });

    car.update(road.borders, traffic);
    canvas1.height = window.innerHeight;
    canvas2.height = window.innerHeight;

    ctx1.save();
    ctx1.translate(0, -car.y + canvas1.height * 0.7);
    road.draw(ctx1);
    traffic.forEach((trafficCar) => {
        trafficCar.draw(ctx1, 'red');
    });
    car.draw(ctx1, 'blue');
    ctx1.restore();

    ctx2.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(ctx2, car.brain);

    requestAnimationFrame(animate);
}
