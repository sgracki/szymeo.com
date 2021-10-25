<script>
    import { onMount } from 'svelte';

    let canvas;
    let dpi = window.devicePixelRatio;

    onMount(() => {
        const ctx = canvas.getContext('2d');
        let frame = requestAnimationFrame(loop);

        fix_dpi();

        // drawOuterBorder();
        drawMaze();

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

    function drawMaze() {
        const cellSize = 50;
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 2;
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                // ctx.strokeRect(i * 50, j * 50, 100, 100);
                const [x1, y1] = [i * cellSize, j * cellSize];
                const [x2, y2] = [x1 + cellSize, y1 + cellSize];

                const direction = 'right';

                switch(direction) {
                    case 'left':
                        drawLine(x1, y2, x2, y2);
                        break;
                    case 'right':
                        drawLine(x1, y2, x2, y2);
                        break;
                    case 'top':
                        drawLine(x1, y2, x2, y2);
                        break;
                    case 'bot':
                        drawLine(x1, y2, x2, y2);
                        break;

                }
            }
        }
    }

    function drawLine(x1, y1, x2, y2) {
        if (!canvas.getContext) {
            return;
        }

        const ctx = canvas.getContext('2d');

        // set line stroke and line width
        ctx.strokeStyle = Math.round(Math.random() * 1000) % 2 === 0 ? 'red' : 'blue';
        ctx.lineWidth = 5;

        // draw a red line
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
</script>

<canvas
        bind:this={canvas}
        width={32}
        height={32}
></canvas>

<style>
    canvas {
        width: 100%;
        height: 100%;
    }
</style>
