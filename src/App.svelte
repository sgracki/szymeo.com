<script lang="ts">
    import '../public/global.css';
    import { onMount } from 'svelte';
    import { KeyboardCapture } from './captureKeydown';
    import { Drawer } from './Drawer';
    import { fix_dpi } from './fix_dpi';
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

    const cellSize = 28;
    const mazeRows = 15;
    const playerSize = 9;
    const moveSpeed = 2;
    const wallWidth = 2;
    const mazeSize = cellSize * mazeRows;
    let LAST_FRAME_TIME = 0;
    let canvas: HTMLCanvasElement, drawer: Drawer, position: Point = { x: mazeSize/2, y: mazeSize/2 }, ctx2d;
    let fps = 0;
    let keyboardCapture: KeyboardCapture;
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

    onMount(() => {
        ctx2d = canvas.getContext('2d', { alpha: false });
        let frame = requestAnimationFrame(loop);
        drawer = new Drawer(canvas);
        keyboardCapture = new KeyboardCapture();

        function loop(TIME: number) {
            const screenSize: Size = fix_dpi(canvas, mazeSize);
            ctx2d.clearRect(0, 0, screenSize.width, screenSize.height);
            ctx2d.fillStyle = 'white';
            ctx2d.fillRect(0, 0, canvas.width, canvas.height);

            showFPS();
            fps = 1 / ((performance.now() - LAST_FRAME_TIME) / 1000);
            LAST_FRAME_TIME = TIME;

            drawer.maze(mazeScheme, cellSize, wallWidth);

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

            drawer.player(position.x, position.y, playerSize);

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
            (topWall !== 0) && position.y - playerSize < cellXY.y + wallWidth,
            (rightWall !== 0) && position.x + playerSize > cellXY.x + cellSize - wallWidth,
            (bottomWall !== 0) && position.y + playerSize > cellXY.y + cellSize - wallWidth,
            (leftWall !== 0) && position.x - playerSize < cellXY.x + wallWidth
        ];
    }

    function setPosition(point: Partial<Point>): void {
        position = { ...position, ...point };
    }

    function showFPS() {
        ctx2d.fillStyle = "Black";
        ctx2d.font = "normal 12pt Arial";

        ctx2d.fillText(Math.round(fps) + " fps", 10, mazeSize + 25);
    }

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

</script>

<canvas bind:this={canvas}></canvas>

