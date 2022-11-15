import { getRGBA, lerp } from '../utils';
import { Level, NeuralNetwork } from './Network';

export class Visualizer {
    static drawNetwork(ctx: CanvasRenderingContext2D, network: NeuralNetwork) {
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - margin * 2;
        const height = ctx.canvas.height - margin * 2;
        const levelHeight = height / network.levels.length;

        for (let i = network.levels.length - 1; i >= 0; i--) {
            // reverse drawing order on canvas

            const levelTop = top + lerp(height - levelHeight, 0, network.levels.length === 1 ? 0.5 : i / (network.levels.length - 1));

            ctx.setLineDash([7, 3]);
            Visualizer.drawLevel(ctx, network.levels[i], left, levelTop, width, levelHeight, i === network.levels.length - 1 ? ['F', 'L', 'R', 'B'] : []);
        }
    }

    static drawLevel(ctx: CanvasRenderingContext2D, level: Level, left: number, top: number, width: number, height: number, lables: string[]) {
        const { inputs, outputs, weights, biases } = level;
        const right = left + width;
        const bottom = top + height;
        const nodeRadius = 20;

        for (let i = 0; i < inputs.length; i++) {
            for (let j = 0; j < outputs.length; j++) {
                ctx.beginPath();
                ctx.moveTo(Visualizer.getNodeX(inputs, i, left, right), bottom);
                ctx.lineTo(Visualizer.getNodeX(outputs, j, left, right), top);
                ctx.lineWidth = 2;
                ctx.strokeStyle = getRGBA(weights[i][j]);
                ctx.stroke();
            }
        }

        for (let i = 0; i < inputs.length; i++) {
            const x = Visualizer.getNodeX(inputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'darkgreen';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(inputs[i]);
            ctx.fill();
        }

        for (let i = 0; i < outputs.length; i++) {
            const x = Visualizer.getNodeX(outputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'darkgreen';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(outputs[i]);
            ctx.fill();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
            ctx.strokeStyle = getRGBA(biases[i]);
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);

            if (lables[i]) {
                ctx.beginPath();
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = 'darkgreen';
                ctx.strokeStyle = 'white';
                ctx.font = `bold ${nodeRadius * 1}px Arial`;
                ctx.fillText(lables[i], x, top);
                ctx.lineWidth = 0.5;
                ctx.strokeText(lables[i], x, top);
            }
        }
    }

    private static getNodeX(nodes: number[], index: number, left: number, right: number) {
        return lerp(left, right, nodes.length === 1 ? 0.5 : index / (nodes.length - 1));
    }
}
