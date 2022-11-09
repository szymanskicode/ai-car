import { Car } from './classes/Car';
import { Road } from './classes/Road';
import { CONTROL } from './models';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
canvas.width = 200;

const ctx = canvas.getContext('2d');
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, CONTROL.AI);
const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, CONTROL.DUMMY, 2)];

animate();

function animate() {
    traffic.forEach((trafficCar) => {
        trafficCar.update(road.borders, []);
    });

    car.update(road.borders, traffic);
    canvas.height = window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.7);
    road.draw(ctx);
    traffic.forEach((trafficCar) => {
        trafficCar.draw(ctx, 'red');
    });
    car.draw(ctx, 'blue');
    ctx.restore();

    requestAnimationFrame(animate);
}
