import type { Point } from './maze-schemas';

export class Drawer {
    lanes: Point[][] = [];

    constructor(private readonly _canvas: HTMLCanvasElement) {
    }

    line(x1, y1, x2, y2) {
        if (!this._canvas.getContext) {
            return;
        }

        const ctx = this._canvas.getContext('2d');

        // set line stroke and line width
        ctx.strokeStyle = 'black';
        ctx.lineCap = 'round';
        ctx.lineWidth = 2;

        // draw a red line
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        this.lanes.push([{ x: x1, y: y1 }, { x: x2, y: y2 }]);
    }
}