import baseResolution from '../../baseResolution';
import keyboardSettings from '../../keyboardSettings';
import PreloadedAssets from '../../preloadedAssets';
import Scene from '../Scene';
import {cloneImage} from '../../util/image';
import $ from 'jquery';
import {focusNextElement, focusPrevElement} from 'focus-lock';
import Cutscene1 from './Cutscene1';

export default class MainMenu extends Cutscene1 {
    gameplayConstructor: any;
    keyPressListener: Function | null = null;
    mainTextArea: HTMLElement | null = null;
    startGameTextArea: HTMLElement | null = null;

    constructor(gameplayConstructor: any) {
        super();
        this.gameplayConstructor = gameplayConstructor;
        this.initialize();
    }

    initialize(): void {
        super.initialize();
        this.cutscene1_begin();
    }

    destroy(): void {
        super.destroy();
        this.mainTextArea_destroy();
        this.startGameTextArea_destroy();
    }

    override cutscene1_onComplete() {
        let logo = cloneImage(PreloadedAssets.logo);
        logo.style.transition = 'opacity 0.5s';
        logo.style.transform = 'scale(0.7)';
        logo.style.opacity = '0';
        logo.style.position = 'absolute';
        this.backgroundContainer!.appendChild(logo);
        logo.style.left = `${baseResolution.centerX(logo.offsetWidth)}px`;
        logo.style.top = `65px`;
        setTimeout(() => {
            logo.style.opacity = '1';
            this.mainTextArea_show();
        }, 500);
    }

    mainTextArea_show() {
        if (this.mainTextArea != null) {
            return;
        }
        this.mainTextArea = document.createElement('div');
        this.mainTextArea.classList.add('textarea');
        this.mainTextArea.style.display = 'flex';
        (this.mainTextArea as any).style['flex-direction'] = 'column';
        this.mainTextArea.style['gap'] = '5px';
        this.mainTextArea.style.position = 'absolute';
        this.mainTextArea.style.width = `500px`;
        this.uiContainer!.appendChild(this.mainTextArea);
        this.mainTextArea.style.left = `${baseResolution.centerX(this.mainTextArea.offsetWidth)}px`;
        this.mainTextArea.style.top = `${baseResolution.centerY(500) + 200}px`;
        this.mainTextArea.innerHTML = `
            <button class="btn" id="startGameBtn" style="text-align: left">Start Game</button>
            <button class="btn" id="repeatIntroBtn" style="text-align: left">Repeat Introduction</button>
            <button class="btn" id="exitGameBtn" style="text-align: left">Exit Game</button>
        `;
        window.addEventListener('keyup', this.keyPressListener = (e: KeyboardEvent) => {
            // up
            if (keyboardSettings.up.includes(e.key.toUpperCase())) {
                if (document.querySelector(':focus') != null) {
                    focusPrevElement(document.activeElement!);
                } else document.getElementById('startGameBtn')!.focus();
            }
            // down
            else if (keyboardSettings.down.includes(e.key.toUpperCase())) {
                if (document.querySelector(':focus') != null) {
                    focusNextElement(document.activeElement!);
                } else document.getElementById('startGameBtn')!.focus();
            }
        });
        document.getElementById('startGameBtn')!.addEventListener('click', () => {
            this.mainTextArea_destroy();
            this.startGameTextArea_show();
        });
        document.getElementById('repeatIntroBtn')!.addEventListener('click', () => {
            this.destroy();
            new MainMenu(this.gameplayConstructor);
        });
        document.getElementById('exitGameBtn')!.addEventListener('click', () => {
            window.close();
        });
        document.getElementById('startGameBtn')!.focus();
    }

    mainTextArea_destroy() {
        if (this.mainTextArea == null) {
            return;
        }
        this.mainTextArea.remove();
        this.mainTextArea = null;

        window.removeEventListener('keyup', this.keyPressListener as any);
        this.keyPressListener = null;
    }

    startGameTextArea_show() {
        if (this.startGameTextArea != null) {
            return;
        }
        this.startGameTextArea = document.createElement('div');
        this.startGameTextArea.classList.add('textarea');
        this.startGameTextArea.style.display = 'flex';
        (this.startGameTextArea as any).style['flex-direction'] = 'column';
        this.startGameTextArea.style['gap'] = '5px';
        this.startGameTextArea.style.position = 'absolute';
        this.startGameTextArea.style.width = `700px`;
        this.uiContainer!.appendChild(this.startGameTextArea);
        this.startGameTextArea.style.left = `${baseResolution.centerX(this.startGameTextArea.offsetWidth)}px`;
        this.startGameTextArea.style.top = `${baseResolution.centerY(500) + 200}px`;
        this.startGameTextArea.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 5px; overflow-x: scroll; width: 600px">
                <button class="btn btn-primary" id="newGameBtn" style="width: 130px; height: 100px; text-align: left">New Game</button>
                ${
                    [].map(slot => `<button class="btn" style="width: 130px; height: 100px; text-align: left">n</button>`)
                }
            </div>
            <button class="btn" id="backBtn" style="text-align: left">Back</button>
        `;
        window.addEventListener('keyup', this.keyPressListener = (e: KeyboardEvent) => {
            // up/left
            if (keyboardSettings.up.includes(e.key.toUpperCase())
            ||  keyboardSettings.left.includes(e.key.toUpperCase())) {
                if (document.querySelector(':focus') != null) {
                    focusPrevElement(document.activeElement!);
                } else document.getElementById('backBtn')!.focus();
            }
            // down/right
            else if (
                keyboardSettings.down.includes(e.key.toUpperCase())
            ||  keyboardSettings.right.includes(e.key.toUpperCase())) {
                if (document.querySelector(':focus') != null) {
                    focusNextElement(document.activeElement!);
                } else document.getElementById('backBtn')!.focus();
            }
            // cancel
            else if (keyboardSettings.cancelOrSkip.includes(e.key.toUpperCase())) {
                this.startGameTextArea_destroy();
                this.mainTextArea_show();
            }
        });
        document.getElementById('newGameBtn')!.addEventListener('click', () => {
            this.destroy();
            new this.gameplayConstructor(NaN);
        });
        document.getElementById('backBtn')!.addEventListener('click', () => {
            this.startGameTextArea_destroy();
            this.mainTextArea_show();
        });
        document.getElementById('newGameBtn')!.focus();
    }

    startGameTextArea_destroy() {
        if (this.startGameTextArea == null) {
            return;
        }
        this.startGameTextArea.remove();
        this.startGameTextArea = null;

        window.removeEventListener('keyup', this.keyPressListener as any);
        this.keyPressListener = null;
    }
}