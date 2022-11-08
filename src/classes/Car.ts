import { Controls } from './Controls';
import { Sensor } from './Sensor';
import { Road } from './Road';

export class Car {
    x: number;
    y: number;
    width: number;
    height: number;
    controls: Controls;
    speed: number;
    acceleration: number;
    maxSpeed: number;
    friction: number;
    angle: number;
    sensor: Sensor;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 3;
        this.friction = 0.05;
        this.angle = 0;

        this.sensor = new Sensor(this);
        this.controls = new Controls();
    }

    update(roadBorders: typeof Road.prototype.borders) {
        this.move();
        this.sensor.update(roadBorders);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);

        ctx.beginPath();
        ctx.rect(
            -this.width / 2, //
            -this.height / 2,
            this.width,
            this.height
        );
        ctx.fill();
        ctx.restore();

        this.sensor.draw(ctx);
    }

    private move() {
        // acceleration and breaking
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        // capping the speed
        if (this.speed >= this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        if (this.speed <= -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2;
        }

        // applying the friction
        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        // steering
        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1;

            if (this.controls.left) {
                this.angle += 0.03 * flip;
            }
            if (this.controls.right) {
                this.angle -= 0.03 * flip;
            }
        }

        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }
}
