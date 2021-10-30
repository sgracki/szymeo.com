<script lang="ts">
    import { onMount } from 'svelte';
    import '../public/global.css';
    import { KeyboardCapture } from './captureKeydown';
    import { Drawer } from './Drawer';
    import { fix_dpi } from './fix_dpi';
    import { mainMazeSchema, Point, Size } from './maze-schemas';

    const cellSize = 28;
    const mazeRows = 15;
    const playerSize = 9;
    const moveSpeed = 2;
    const wallWidth = 2;
    const mazeSize = cellSize * mazeRows;
    let gameCanvas: HTMLCanvasElement,
        backgroundCanvas: HTMLCanvasElement,
        gameDrawer: Drawer,
        bgDrawer: Drawer,
        position: Point = { x: mazeSize / 2, y: mazeSize / 2 },
        gameCtx2d,
        backgroundCtx2d,
        fps = 0,
        LAST_FRAME_TIME = 0,
        keyboardCapture: KeyboardCapture;

    onMount(() => {
        gameCtx2d = gameCanvas.getContext('2d', { alpha: false });
        backgroundCtx2d = gameCanvas.getContext('2d', { alpha: false });
        let frame = requestAnimationFrame(loop);
        gameDrawer = new Drawer(gameCanvas);
        bgDrawer = new Drawer(backgroundCanvas);
        keyboardCapture = new KeyboardCapture();

        bgDrawer.maze(mainMazeSchema, cellSize, wallWidth);

        fix_dpi(backgroundCanvas, mazeSize);
        const screenSize: Size = fix_dpi(gameCanvas, mazeSize);

        bgDrawer.maze(mainMazeSchema, cellSize, wallWidth);

        function loop(TIME: number) {
            gameCtx2d.clearRect(0, 0, screenSize.width, screenSize.height);
            gameCtx2d.fillStyle = 'white';
            gameCtx2d.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

            showFPS();
            fps = 1 / ((performance.now() - LAST_FRAME_TIME) / 1000);
            LAST_FRAME_TIME = TIME;

            const [keyW, keyA, keyS, keyD] = keyboardCapture.pressedKeys;
            const [topC, rightC, botC, leftC] = detectCollision();

            if (keyW && !topC) {
                setPosition({ y: position.y - moveSpeed });
            }
            if (keyS && !botC) {
                setPosition({ y: position.y + moveSpeed });
            }
            if (keyA && !leftC) {
                setPosition({ x: position.x - moveSpeed });
            }
            if (keyD && !rightC) {
                setPosition({ x: position.x + moveSpeed });
            }

            gameDrawer.player(position.x, position.y, playerSize);

            frame = requestAnimationFrame(loop);
        }

        return () => {
            cancelAnimationFrame(frame);
        };
    });

    function detectCollision(): boolean[] {
        const [xIdx, yIdx]: number[] = [Math.ceil((position.x + playerSize / 2) / cellSize) - 1, Math.ceil((position.y + playerSize / 2) / cellSize) - 1];

        const [topWall, rightWall, bottomWall, leftWall] = mainMazeSchema[yIdx][xIdx];
        const cellXY: Point = { x: xIdx * cellSize, y: yIdx * cellSize };
        return [
            (topWall !== 0) && position.y - playerSize < cellXY.y + wallWidth,
            (rightWall !== 0) && position.x + playerSize > cellXY.x + cellSize - wallWidth,
            (bottomWall !== 0) && position.y + playerSize > cellXY.y + cellSize - wallWidth,
            (leftWall !== 0) && position.x - playerSize < cellXY.x + wallWidth,
        ];
    }

    function setPosition(point: Partial<Point>): void {
        position = { ...position, ...point };
    }

    function showFPS() {
        gameCtx2d.fillStyle = "Black";
        gameCtx2d.font = "normal 12pt Arial";

        gameCtx2d.fillText(Math.round(fps) + " fps", 10, mazeSize + 25);
    }

</script>

<canvas bind:this={gameCanvas}></canvas>
<canvas bind:this={backgroundCanvas}></canvas>

<style>
    canvas {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
</style>

