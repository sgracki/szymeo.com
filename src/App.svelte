<script lang="ts">
    import '../public/global.css';
    import { onMount } from 'svelte';

    let canvas;
    let dpi = window.devicePixelRatio;

    type MazeCell = Array<number>;
    type MazeRow = Array<MazeCell>;
    type MazeSchema = Array<MazeRow>;

    enum MazeExit {
        TOP,
        RIGHT,
        BOT,
        LEFT
    }

    interface MazePuzzel {
        exits: Set<MazeExit>;
        schema: MazeSchema
    }

    const mazeSchema1: MazeSchema = [
        [[1,0,0,1],[1,0,1,0],[1,0,1,0],[1,0,1,0],[1,1,0,0]],
        [[0,1,1,1],[1,0,0,1],[1,0,1,0],[1,1,0,0],[0,1,0,1]],
        [[1,0,0,1],[0,1,0,0],[1,0,1,0],[0,1,0,0],[0,1,0,1]],
        [[0,1,0,1],[0,0,1,1],[1,1,0,0],[0,1,0,1],[0,1,0,1]],
        [[0,0,1,1],[1,1,1,0],[0,1,0,1],[0,0,1,1],[0,0,1,0]]
    ];

    const mazeSchema2: MazeSchema = [
        [[1,0,0,1],[1,0,1,0],[1,1,1,0],[1,0,0,1],[1,1,1,0]],
        [[0,0,0,1],[1,0,1,0],[1,1,0,0],[0,0,0,1],[1,0,0,0]],
        [[0,1,0,1],[1,1,0,1],[0,0,1,1],[0,1,0,0],[0,1,0,1]],
        [[0,0,0,1],[0,1,1,0],[1,0,0,1],[0,1,1,0],[0,1,0,0]],
        [[0,0,1,0],[1,1,1,0],[0,1,0,1],[1,0,1,1],[0,1,1,0]]
    ];

    const mazeSchema3: MazeSchema = [
        [[1,0,0,1],[1,0,1,0],[1,0,1,0],[1,0,1,0],[1,1,0,0]],
        [[0,1,1,0],[1,0,0,1],[1,0,1,0],[1,1,0,0],[0,1,0,1]],
        [[1,0,0,1],[0,1,0,0],[1,0,1,0],[0,1,0,0],[0,1,0,1]],
        [[0,1,0,1],[0,0,1,1],[1,1,0,0],[0,1,0,1],[0,1,0,1]],
        [[0,0,0,1],[1,1,1,0],[0,1,0,1],[0,0,1,1],[0,1,1,0]]
    ];

    const mazeSchema4: MazeSchema = [
        [[1,0,0,1],[1,0,1,0],[0,1,1,0],[1,0,0,1],[1,1,1,0]],
        [[0,0,0,1],[1,0,1,0],[1,1,0,0],[0,0,0,1],[1,1,0,0]],
        [[0,1,0,1],[1,1,0,1],[0,0,1,1],[0,1,0,0],[0,1,0,1]],
        [[0,0,0,1],[0,1,1,0],[1,0,0,1],[0,1,1,0],[0,1,0,0]],
        [[0,0,1,1],[1,1,1,0],[0,1,0,1],[1,0,0,1],[0,1,1,0]]
    ];

    const mazeSchema5: MazeSchema = [
        [[1,0,0,1],[1,0,1,0],[1,0,1,0],[1,0,1,0],[1,1,0,0]],
        [[0,1,1,1],[1,0,0,1],[1,0,1,0],[1,1,0,0],[0,1,0,1]],
        [[1,0,0,1],[0,1,0,0],[1,0,1,0],[0,1,0,0],[0,1,0,1]],
        [[0,1,0,1],[0,0,1,1],[1,1,0,0],[0,1,0,1],[0,1,0,1]],
        [[0,0,1,1],[1,1,1,0],[0,1,0,1],[0,0,1,1],[0,0,1,0]]
    ];

    const mazeSchema6: MazeSchema = [
        [[0,1,1,1],[1,0,1,0],[0,0,1,0],[1,0,0,0],[1,1,1,0]],
        [[0,0,0,1],[1,0,1,0],[1,1,0,0],[0,0,0,1],[1,1,0,0]],
        [[0,1,0,1],[1,1,0,1],[0,0,1,1],[0,1,0,0],[0,1,0,1]],
        [[0,0,0,1],[0,1,1,0],[1,0,0,1],[0,1,1,0],[0,1,0,0]],
        [[0,0,0,1],[1,1,1,0],[0,1,0,1],[1,0,1,1],[0,1,1,0]]
    ];

    const mazeSchema7: MazeSchema = [
        [[1,0,0,1],[1,0,1,0],[1,0,1,0],[0,0,1,0],[1,1,0,0]],
        [[0,1,1,1],[1,0,0,1],[1,0,1,0],[1,1,0,0],[0,1,0,1]],
        [[1,0,0,1],[0,1,0,0],[1,0,1,0],[0,1,0,0],[0,1,0,1]],
        [[0,1,0,1],[0,0,1,1],[1,1,0,0],[0,1,0,1],[0,1,0,1]],
        [[0,0,1,1],[1,1,1,0],[0,1,1,1],[0,0,1,1],[0,0,1,0]]
    ];

    const mazeSchema8: MazeSchema = [
        [[1,0,0,1],[1,0,1,0],[0,1,1,0],[1,0,0,1],[1,1,1,0]],
        [[0,0,0,1],[1,0,1,0],[1,1,0,0],[0,0,0,1],[1,1,0,0]],
        [[0,1,0,1],[1,1,0,1],[0,0,1,1],[0,1,0,0],[0,1,0,1]],
        [[0,0,0,1],[0,1,1,0],[1,0,0,1],[0,1,1,0],[0,1,0,0]],
        [[0,0,1,1],[1,1,1,0],[0,1,1,1],[1,0,1,1],[0,1,1,0]]
    ];

    const mazeSchema9: MazeSchema = [
        [[0,0,0,1],[1,0,1,0],[1,0,1,0],[1,0,1,0],[1,1,0,0]],
        [[0,1,1,1],[1,0,0,1],[1,0,1,0],[1,1,0,0],[0,1,0,1]],
        [[1,0,0,1],[0,1,0,0],[1,0,1,0],[0,1,0,0],[0,1,0,1]],
        [[0,1,0,1],[0,0,1,1],[1,1,0,0],[0,1,0,1],[0,1,0,1]],
        [[0,0,1,1],[1,1,1,0],[0,1,1,1],[0,0,1,1],[0,1,1,0]]
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
        const ctx = canvas.getContext('2d');
        let frame = requestAnimationFrame(loop);

        fix_dpi();

        drawMaze([
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
        ]);

        function loop(t) {
            frame = requestAnimationFrame(loop);
        }

        return () => {
            cancelAnimationFrame(frame);
        };
    });

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
        canvas.setAttribute('width', style.width() * dpi);
        canvas.setAttribute('height', style.height() * dpi);
    }

    function drawOuterBorder() {
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 8;
        ctx.strokeRect(0, 0, 500, 500);
    }

    // TODO make parts of labirynth and connect them together like puzzle

    function drawMaze(schema: MazeSchema) {
        const cellSize = 50;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 2;

        for (let i = 0; i < schema.length; i++) { // schema
            for (let j = 0; j < schema[i].length; j++) { // row
                const [top, right, bot, left] = schema[i][j];
                const [x1, y1] = [j * cellSize, i * cellSize];
                const [x2, y2] = [x1 + cellSize, y1 + cellSize];

                top && drawLine(x1, y1, x2, y1);
                right && drawLine(x2, y1, x2, y2);
                bot && drawLine(x1, y2, x2, y2);
                left && drawLine(x1, y1, x1, y2);
            }
        }
    }

    function drawLine(x1, y1, x2, y2) {
        if (!canvas.getContext) {
            return;
        }

        const ctx = canvas.getContext('2d');

        // set line stroke and line width
        ctx.strokeStyle = 'black';
        ctx.lineCap = 'round';
        ctx.lineWidth = 2;

        // draw a red line
        ctx.beginPath();
        ctx.moveTo(x1 + 10, y1 + 10);
        ctx.lineTo(x2 + 10, y2 + 10);
        ctx.stroke();
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
