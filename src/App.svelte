<script lang="ts">
    import { onMount } from 'svelte';
    import '../public/global.css';
    import { KeyboardCapture } from './captureKeydown';
    import { detectCollision } from './collision-detector';
    import {
        CELL_SIZE,
        MAX_VELOCITY,
        MAZE_SIZE,
        MOVE_SPEED,
        PLAYER_SIZE,
        VELOCITY_MULTIPLIER,
        WALL_WIDTH,
    } from './constants';
    import { Drawer } from './Drawer';
    import { fix_dpi } from './fix_dpi';
    import { mainMazeSchema } from './schemas/maze-schemas';
    import type { Point } from './schemas/point';
    import { Size } from './schemas/size';
    import { wayPoints } from './schemas/waypoints-schemas';

    let gameCanvas: HTMLCanvasElement,
        gameDrawer: Drawer,
        position: Point = { x: MAZE_SIZE / 2, y: MAZE_SIZE / 2 },
        gameCtx2d: CanvasRenderingContext2D,
        keyboardCapture: KeyboardCapture,
        velocity = 1;

    onMount(() => {
        let frame = requestAnimationFrame(loop);

        gameCtx2d = gameCanvas.getContext('2d', { alpha: false });

        gameDrawer = new Drawer(gameCanvas);

        keyboardCapture = new KeyboardCapture();

        const screenSize: Size = fix_dpi(gameCanvas, MAZE_SIZE);

        function loop(TIME: number) {
            gameCtx2d.clearRect(0, 0, screenSize.width, screenSize.height);
            gameCtx2d.fillStyle = 'white';
            gameCtx2d.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

            const [keyW, keyA, keyS, keyD, SPACE] = keyboardCapture.pressedKeys;
            const [wallsC, collidingWayPoint] = detectCollision(position);
            const [topC, rightC, botC, leftC] = wallsC;

            if (keyW || keyA || keyS || keyD) {
                increaseVelocity();
            } else {
                decreaseVelocity();
            }

            if (keyW && !topC) {
                setPosition({ y: position.y - MOVE_SPEED * velocity });
            }
            if (keyS && !botC) {
                setPosition({ y: position.y + MOVE_SPEED * velocity });
            }
            if (keyA && !leftC) {
                setPosition({ x: position.x - MOVE_SPEED * velocity });
            }
            if (keyD && !rightC) {
                setPosition({ x: position.x + MOVE_SPEED * velocity });
            }
            if (SPACE && collidingWayPoint) {
                collidingWayPoint.callback();
            }

            gameDrawer.maze(mainMazeSchema, CELL_SIZE, WALL_WIDTH);
            gameDrawer.drawWaypoints(wayPoints, collidingWayPoint);
            gameDrawer.drawPoint(position.x, position.y, PLAYER_SIZE, '#F45555');

            frame = requestAnimationFrame(loop);
        }

        return () => {
            cancelAnimationFrame(frame);
        };
    });

    function setPosition(point: Partial<Point>): void {
        position = { ...position, ...point };
    }

    function increaseVelocity(): void {
        if (velocity + VELOCITY_MULTIPLIER < MAX_VELOCITY) {
            velocity = velocity + VELOCITY_MULTIPLIER;
        }
    }

    function decreaseVelocity(): void {
        if (velocity - VELOCITY_MULTIPLIER > 0) {
            velocity = velocity - VELOCITY_MULTIPLIER;
        }
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

