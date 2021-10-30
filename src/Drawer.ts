import { CELL_SIZE, WALL_WIDTH, WAYPOINT_SIZE } from './constants';
import type { MazeSchema } from './schemas/maze-schemas';
import type { Point } from './schemas/point';
import type { WayPoint, WayPointsSchema } from './schemas/waypoints-schemas';

export class Drawer {
    lines: Point[][] = [];

    constructor(private readonly _canvas: HTMLCanvasElement) {
    }

    maze(schema: MazeSchema, cellSize: number, wallWidth: number): void {
        this._get2dCtx().lineWidth = wallWidth;

        for (let i = 0; i < schema.length; i++) { // schema
            for (let j = 0; j < schema[i].length; j++) { // row
                const [top, right, bot, left] = schema[i][j];
                const [x1, y1] = [j * cellSize, i * cellSize];
                const [x2, y2] = [x1 + cellSize, y1 + cellSize];

                top && this.line(x1, y1, x2, y1);
                right && this.line(x2, y1, x2, y2);
                bot && this.line(x1, y2, x2, y2);
                left && this.line(x1, y1, x1, y2);
            }
        }
    }

    drawWaypoints(schema: WayPointsSchema, currentWaypoint?: WayPoint): void {
        for (let i = 0; i < schema.length; i++) {
            const [x, y] = schema[i].coords;
            let wayPointSize = WAYPOINT_SIZE;
            if (x === currentWaypoint?.coords[0] && y === currentWaypoint?.coords[1]) {
                wayPointSize = WAYPOINT_SIZE * 2;
            }
            const [p1, p2] = [x * CELL_SIZE, y * CELL_SIZE];
            this.drawPoint(p1 - CELL_SIZE / 2, p2 - CELL_SIZE / 2, wayPointSize, '#38E8C0');
        }
    }

    drawPoint(x: number, y: number, radius: number, fill: string): void {
        const ctx2d = this._get2dCtx();
        ctx2d.globalCompositeOperation='destination-over';
        ctx2d.beginPath();
        ctx2d.fillStyle = fill;
        ctx2d.arc(x, y, radius, 0, 360, false);
        ctx2d.fill();
    }

    line(x1: number, y1: number, x2: number, y2: number) {
        if (!this._canvas.getContext) {
            return;
        }

        const ctx = this._canvas.getContext('2d');

        // set line stroke and line width
        ctx.strokeStyle = 'black';
        ctx.lineCap = 'round';
        ctx.lineWidth = WALL_WIDTH;

        // draw a red line
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        this.lines.push([{ x: x1, y: y1 }, { x: x2, y: y2 }]);
    }

    private _get2dCtx(): CanvasRenderingContext2D {
        return this._canvas.getContext('2d');
    }
}