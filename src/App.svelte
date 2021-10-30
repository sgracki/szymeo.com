<script lang="ts">
    import { onMount } from 'svelte';
    import '../public/global.css';
    import { KeyboardCapture } from './captureKeydown';
    import { detectCollision } from './collision-detector';
    import { CELL_SIZE, MAZE_SIZE, MOVE_SPEED, PLAYER_SIZE, WALL_WIDTH } from './constants';
    import { Drawer } from './Drawer';
    import { fix_dpi } from './fix_dpi';
    import { mainMazeSchema } from './typings/maze-schemas';
    import type { Point } from './typings/point';
    import { wayPoints } from './typings/waypoints-schemas';

    let gameCanvas: HTMLCanvasElement,
        gameDrawer: Drawer,
        position: Point = { x: MAZE_SIZE / 2, y: MAZE_SIZE / 2 },
        gameCtx2d: CanvasRenderingContext2D,
        keyboardCapture: KeyboardCapture;

    onMount(() => {
        let frame = requestAnimationFrame(loop);

        gameCtx2d = gameCanvas.getContext('2d', { alpha: false });

        gameDrawer = new Drawer(gameCanvas);

        keyboardCapture = new KeyboardCapture();

        fix_dpi(gameCanvas, MAZE_SIZE);

        function loop(TIME: number) {
            clearCanvas(gameCanvas);

            const [keyW, keyA, keyS, keyD, SPACE] = keyboardCapture.pressedKeys;
            const [wallsC, collidingWayPoint] = detectCollision(position);
            const [topC, rightC, botC, leftC] = wallsC;

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
            if (SPACE && collidingWayPoint) {
                collidingWayPoint.callback();
            }

            gameDrawer.drawPoint(position.x, position.y, PLAYER_SIZE, '#F45555');
            gameDrawer.maze(mainMazeSchema, CELL_SIZE, WALL_WIDTH);
            gameDrawer.drawWaypoints(wayPoints, collidingWayPoint);

            frame = requestAnimationFrame(loop);
        }

        return () => {
            cancelAnimationFrame(frame);
        };
    });

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

<style>
    canvas {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
</style>

