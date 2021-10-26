export class KeyboardCapture {

    private _keys = {
        W: false,
        A: false,
        S: false,
        D: false,
    }

    constructor() {
        window.addEventListener('keydown', this._onKeyDown.bind(this), false);
        window.addEventListener('keyup', this._onKeyUp.bind(this), false);
    }

    private _onKeyDown(event) {
        const keyCode = event.keyCode;
        switch (keyCode) {
            case 68: //d
                this._keys.D = true;
                break;
            case 83: //s
                this._keys.S = true;
                break;
            case 65: //a
                this._keys.A = true;
                break;
            case 87: //w
                this._keys.W = true;
                break;
        }
    }

    private _onKeyUp(event) {
        const keyCode = event.keyCode;

        switch (keyCode) {
            case 68: //d
                this._keys.D = false;
                break;
            case 83: //s
                this._keys.S = false;
                break;
            case 65: //a
                this._keys.A = false;
                break;
            case 87: //w
                this._keys.W = false;
                break;
        }
    }

    get pressedKeys(): boolean[] {
        return Object.values(this._keys);
    }
}