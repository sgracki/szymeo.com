<script lang="ts">
    import { onMount } from 'svelte';
    import '../public/global.css';
    import { KeyboardCapture } from './captureKeydown';
    import { CELL_SIZE, MAZE_SIZE, MOVE_SPEED, PLAYER_SIZE, WALL_WIDTH } from './constants';
    import { Drawer } from './Drawer';
    import { fix_dpi } from './fix_dpi';
    import { mainMazeSchema } from './typings/maze-schemas';
    import type { Point } from './typings/point';
    import { wayPoints } from './typings/waypoints-schemas';

    let gameCanvas: HTMLCanvasElement,
        wayPointsCanvas: HTMLCanvasElement,
        backgroundCanvas: HTMLCanvasElement,
        gameDrawer: Drawer,
        wayPointsDrawer: Drawer,
        bgDrawer: Drawer,
        position: Point = { x: MAZE_SIZE / 2, y: MAZE_SIZE / 2 },
        gameCtx2d: CanvasRenderingContext2D,
        wayPointsCtx2d: CanvasRenderingContext2D,
        backgroundCtx2d: CanvasRenderingContext2D,
        keyboardCapture: KeyboardCapture;

    onMount(() => {
        let frame = requestAnimationFrame(loop);

        gameCtx2d = gameCanvas.getContext('2d', { alpha: false });
        wayPointsCtx2d = gameCanvas.getContext('2d', { alpha: false });
        backgroundCtx2d = gameCanvas.getContext('2d', { alpha: false });

        gameDrawer = new Drawer(gameCanvas);
        wayPointsDrawer = new Drawer(wayPointsCanvas);
        bgDrawer = new Drawer(backgroundCanvas);

        keyboardCapture = new KeyboardCapture();

        fix_dpi(backgroundCanvas, MAZE_SIZE);
        fix_dpi(wayPointsCanvas, MAZE_SIZE);
        fix_dpi(gameCanvas, MAZE_SIZE);

        bgDrawer.maze(mainMazeSchema, CELL_SIZE, WALL_WIDTH);
        wayPointsDrawer.drawWaypoints(wayPoints);

        function loop(TIME: number) {
            clearCanvas(gameCanvas);

            const [keyW, keyA, keyS, keyD] = keyboardCapture.pressedKeys;
            const [topC, rightC, botC, leftC] = detectCollision();

            if (keyW && !topC) {
                setPosition({ y: position.y - MOVE_SPEED });
            }
            if (keyS && !botC) {
                setPosition({ y: position.y + MOVE_SPEED });
            }
            if (keyA && !leftC) {
                setPosition({ x: position.x - MOVE_SPEED });
            }
            if (keyD && !rightC) {
                setPosition({ x: position.x + MOVE_SPEED });
            }

            gameDrawer.drawPoint(position.x, position.y, PLAYER_SIZE, '#F45555');

            frame = requestAnimationFrame(loop);
        }

        return () => {
            cancelAnimationFrame(frame);
        };
    });

    function detectCollision(): boolean[] {
        const [xIdx, yIdx]: number[] = [Math.ceil((position.x + PLAYER_SIZE / 2) / CELL_SIZE) - 1, Math.ceil((position.y + PLAYER_SIZE / 2) / CELL_SIZE) - 1];

        const [topWall, rightWall, bottomWall, leftWall] = mainMazeSchema[yIdx][xIdx];
        const cellXY: Point = { x: xIdx * CELL_SIZE, y: yIdx * CELL_SIZE };
        return [
            (topWall !== 0) && position.y - PLAYER_SIZE < cellXY.y + WALL_WIDTH,
            (rightWall !== 0) && position.x + PLAYER_SIZE > cellXY.x + CELL_SIZE - WALL_WIDTH,
            (bottomWall !== 0) && position.y + PLAYER_SIZE > cellXY.y + CELL_SIZE - WALL_WIDTH,
            (leftWall !== 0) && position.x - PLAYER_SIZE < cellXY.x + WALL_WIDTH,
        ];
    }

    function setPosition(point: Partial<Point>): void {
        position = { ...position, ...point };
    }

    function clearCanvas(canvas: HTMLCanvasElement): void {
        const ctx = canvas.getContext('2d', { alpha: false });
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

</script>

<canvas bind:this={gameCanvas}></canvas>
<canvas bind:this={wayPointsCanvas}></canvas>
<canvas bind:this={backgroundCanvas}></canvas>

<style>
    canvas {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
</style>

