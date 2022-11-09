import { CONTROL } from '../models';

export class Controls {
    forward: boolean;
    left: boolean;
    right: boolean;
    reverse: boolean;

    constructor(type: CONTROL) {
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;

        switch (type) {
            case CONTROL.KEYS:
                this.addKeyboardListeners();
                break;
            case CONTROL.DUMMY:
                this.forward = true;
                break;
        }
    }

    private addKeyboardListeners() {
        document.onkeydown = (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    this.left = true;
                    break;
                case 'ArrowRight':
                    this.right = true;
                    break;
                case 'ArrowUp':
                    this.forward = true;
                    break;
                case 'ArrowDown':
                    this.reverse = true;
                    break;
            }
        };

        document.onkeyup = (event) => {
            switch (event.key) {
                case 'ArrowLeft':
                    this.left = false;
                    break;
                case 'ArrowRight':
                    this.right = false;
                    break;
                case 'ArrowUp':
                    this.forward = false;
                    break;
                case 'ArrowDown':
                    this.reverse = false;
                    break;
            }
        };
    }
}
