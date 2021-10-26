import type { Size } from './maze-schemas';

export function fix_dpi(canvas: HTMLCanvasElement, mazeSize: number): Size {
    const dpi = window.devicePixelRatio;
    //create a style object that returns width and height
    const style = {
        height() {
            return +getComputedStyle(canvas).getPropertyValue('height').slice(0,-2);
        },
        width() {
            return +getComputedStyle(canvas).getPropertyValue('width').slice(0,-2);
        }
    }
    //set the correct attributes for a crystal clear image!
    canvas.setAttribute('width', String(mazeSize));
    canvas.setAttribute('height', String(mazeSize));
    return {
        width: mazeSize,
        height: mazeSize,
    }
}