import { Controls } from './Controls';
import { Sensor } from './Sensor';
import { NeuralNetwork } from './Network';
import { ICoord, CONTROL } from '../models';
import { polysIntersect } from '../utils';

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
    polygon: Array<ICoord>;
    damaged: boolean;
    brain: NeuralNetwork;
    useBrain: boolean;

    constructor(x: number, y: number, width: number, height: number, controlType: CONTROL, maxSpeed: number = 3) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;
        this.damaged = false;

        this.useBrain = controlType === CONTROL.AI;

        if (controlType != CONTROL.DUMMY) {
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
        }
        this.controls = new Controls(controlType);
    }

    private createPlygon(): Array<ICoord> {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);

        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
        });

        return points;
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

    private assessDamage(roadBorders: ICoord[][], traffic: Car[]): boolean {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }

        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }
        return false;
    }

    update(roadBorders: ICoord[][], traffic: Car[]) {
        if (!this.damaged) {
            this.move();
            this.polygon = this.createPlygon();
            this.damaged = this.assessDamage(roadBorders, traffic);
        }

        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map((s) => (s === null ? 0 : 1 - s.offset));
            const outputs = NeuralNetwork.feedForward(offsets, this.brain);

            if (this.useBrain) {
                this.controls.forward = Boolean(outputs[0]);
                this.controls.left = Boolean(outputs[1]);
                this.controls.right = Boolean(outputs[2]);
                this.controls.reverse = Boolean(outputs[3]);
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, color: string, drawSensor = false) {
        if (this.damaged) {
            ctx.fillStyle = 'silver';
        } else {
            ctx.fillStyle = color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();

        if (this.sensor && drawSensor) {
            this.sensor.draw(ctx);
        }
    }
}
