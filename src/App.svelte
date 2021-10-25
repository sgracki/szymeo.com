<script lang="ts">
    import '../public/global.css';
    import { onMount } from 'svelte';
    import { Drawer } from './Drawer';
    import {
        mazeSchema1,
        mazeSchema2,
        mazeSchema3,
        mazeSchema4,
        mazeSchema5,
        mazeSchema6,
        mazeSchema7, mazeSchema8, mazeSchema9, Point, Size,
    } from './maze-schemas';
    import type { MazeSchema } from './maze-schemas';

    const cellSize = 30;
    const mazeRows = 15;
    const playerSize = 9;
    const moveSpeed = 2;
    const mazeSize = cellSize * mazeRows;
    let LAST_FRAME_TIME = 0;
    let screenSize: Size = { width: null, height: null };
    let canvas: HTMLCanvasElement, drawer: Drawer, position: Point = { x: mazeSize/2, y: mazeSize/2 }, ctx2d;
    let keyW, keyS, keyA, keyD;
    let dpi = window.devicePixelRatio;
    let fps = 0;
    const mazeScheme: MazeSchema = [
        ...schemasToRow(
            mazeSchema1,
            mazeSchema2,
            mazeSchema3,
        ),
        ...schemasToRow(
            mazeSchema4,
            mazeSchema5,
            mazeSchema6,
        ),
        ...schemasToRow(
            mazeSchema7,
            mazeSchema8,
            mazeSchema9,
        ),
    ];

    function schemasToRow(...schemas: MazeSchema[]): MazeSchema {
        return schemas.reduce((memo: MazeSchema, item: MazeSchema) => {
            return [
                [...memo[0], ...item[0]],
                [...memo[1], ...item[1]],
                [...memo[2], ...item[2]],
                [...memo[3], ...item[3]],
                [...memo[4], ...item[4]],
            ]
        }, [[],[],[],[],[]]);
    }

    onMount(() => {
        ctx2d = canvas.getContext('2d', { alpha: false });
        let frame = requestAnimationFrame(loop);
        drawer = new Drawer(canvas);

        fix_dpi();

        function loop(TIME: number) {
            ctx2d.clearRect(0, 0, screenSize.width, screenSize.height);

            showFPS();
            fps = 1 / ((performance.now() - LAST_FRAME_TIME) / 1000);
            LAST_FRAME_TIME = TIME;

            drawMaze(mazeScheme);
            drawPlayer(position.x, position.y);

            captureKeydown();

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

            drawPlayer(position.x, position.y);

            frame = requestAnimationFrame(loop);
        }

        return () => {
            cancelAnimationFrame(frame);
        };
    });

    function detectCollision(): boolean[] {
        const [xIdx, yIdx]: number[] = [Math.ceil((position.x + playerSize / 2) / cellSize) - 1, Math.ceil((position.y + playerSize / 2) / cellSize) - 1];

        const [topWall, rightWall, bottomWall, leftWall] = mazeScheme[yIdx][xIdx];
        const cellXY: Point = { x: xIdx * cellSize, y: yIdx * cellSize };
        return [
            (topWall !== 0) && position.y < cellXY.y,
            (rightWall !== 0) && position.x + playerSize > cellXY.x + cellSize,
            (bottomWall !== 0) && position.y + playerSize > cellXY.y + cellSize,
            (leftWall !== 0) && position.x < cellXY.x
        ];
    }

    function setPosition(point: Partial<Point>): void {
        position = { ...position, ...point };
    }

    function fix_dpi() {
        //create a style object that returns width and height
        let style = {
            height() {
                return +getComputedStyle(canvas).getPropertyValue('height').slice(0,-2);
            },
            width() {
                return +getComputedStyle(canvas).getPropertyValue('width').slice(0,-2);
            }
        }
        //set the correct attributes for a crystal clear image!
        screenSize = {
            width: style.width() * dpi,
            height: style.height() * dpi,
        };
        canvas.setAttribute('width', String(style.width() * dpi));
        canvas.setAttribute('height', String(style.height() * dpi));
    }

    // TODO make parts of labirynth and connect them together like puzzle

    function showFPS() {
        ctx2d.fillStyle = "Black";
        ctx2d.font      = "normal 12pt Arial";

        ctx2d.fillText(Math.round(fps) + " fps", 10, mazeSize + 25);
    }

    function drawMaze(schema: MazeSchema) {
        ctx2d.lineWidth = 2;

        for (let i = 0; i < schema.length; i++) { // schema
            for (let j = 0; j < schema[i].length; j++) { // row
                const [top, right, bot, left] = schema[i][j];
                const [x1, y1] = [j * cellSize, i * cellSize];
                const [x2, y2] = [x1 + cellSize, y1 + cellSize];

                top && drawer.line(x1, y1, x2, y1);
                right && drawer.line(x2, y1, x2, y2);
                bot && drawer.line(x1, y2, x2, y2);
                left && drawer.line(x1, y1, x1, y2);
            }
        }
    }

    function drawPlayer(x: number, y: number) {
        ctx2d.beginPath();
        ctx2d.fillStyle = '#F45555';
        ctx2d.arc(x, y, playerSize, 0, 360, false);
        ctx2d.fill();
    }

    function captureKeydown(): void {
        window.addEventListener("keydown", onKeyDown, false);
        window.addEventListener("keyup", onKeyUp, false);

        function onKeyDown(event) {
            const keyCode = event.keyCode;
            switch (keyCode) {
                case 68: //d
                    keyD = true;
                    break;
                case 83: //s
                    keyS = true;
                    break;
                case 65: //a
                    keyA = true;
                    break;
                case 87: //w
                    keyW = true;
                    break;
            }
        }

        function onKeyUp(event) {
            var keyCode = event.keyCode;

            switch (keyCode) {
                case 68: //d
                    keyD = false;
                    break;
                case 83: //s
                    keyS = false;
                    break;
                case 65: //a
                    keyA = false;
                    break;
                case 87: //w
                    keyW = false;
                    break;
            }
        }
    }
</script>

<canvas
        bind:this={canvas}
></canvas>

<style>
    canvas {
        width: 100%;
        height: 100%;
        border: 5px solid #F45555;
    }
</style>
