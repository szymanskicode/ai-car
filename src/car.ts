export class Car {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.rect(
            this.x - this.width / 2, //
            this.y - this.height / 2,
            this.width,
            this.height
        );
        ctx.fill();
    }
}
