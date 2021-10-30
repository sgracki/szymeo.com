import type { Size } from './typings/size';

export function fix_dpi(canvas: HTMLCanvasElement, mazeSize: number): Size {
    canvas.setAttribute('width', String(mazeSize));
    canvas.setAttribute('height', String(mazeSize));

    return {
        width: mazeSize,
        height: mazeSize,
    }
}