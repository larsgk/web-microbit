// @ts-check
import { LitElement, html, css } from "lit-element";
import { BoardModel } from '../services/board-model'

import './board-button';
import { BoardLED } from './board-led';
import { BLEService } from "../services/ble-service";

export class MicrobitBoard extends LitElement {
    static get properties() {
        return {
            leftbtn: { type: Boolean, reflect: true },
            rightbtn: { type: Boolean, reflect: true },
            deviceId: { type: String },
            model: { type: Object }
        }
    }

    static get styles() {
        return [
            css`
            :host {
                display: inline-block;
                background: #001000;
                margin: auto;
                width: auto;
                border-radius: 1em;
            }

            .overlay {
                display: flex;
                position: absolute;
                align-items: center;
                justify-content: center;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background: blue;
                margin: auto;
                border-radius: 1em;
                background: rgba(250, 250, 250, 0.5);
                color: white;
                z-index: -10;
                cursor: pointer;
            }

            .overlay[addboard] {
                z-index: 10;
            }

            .mega {
                font-weight: bold;
                font-size: 400%;
                cursor: pointer;
            }

            .col {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
            }

            .rows {
                display: flex;
                position: relative;
                flex-direction: column;
                display: inline-block;
            }
            
            .row {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
            }

            .connectors {
                width: 80%;
                height: 2rem;
                background: rgba(200,100,20,0.5);
            }

            board-led {
                width:2.8em;
                height: 2.1em;
            }

            board-button {
                width:2.8em;
                height: 2.8em;
            }
            
            #disconnect {
                cursor: pointer;
                margin: 2px;
                border-radius: 2px;
                background-color: red;
                color: white;
            }

            [hide] {
                opacity: 0;
            }
        `];
    }
    
    constructor() {
        super();

        this.leftbtn = false;
        this.rightbtn = false;

        /** @type {BoardModel} */
        this.model = null;

        this.NUM_ROWS = 5;
        this.NUM_COLS = 5;

        this.ledData = new Uint8Array(this.NUM_ROWS+1); // Add one byte for 'cmd'
        this.ledData[0] = 1; // cmd
    }
    
    render() {
        return html`
            <div class="rows">
                <div class="row">
                    <div id="disconnect" @click=${this.disconnect} ?hide=${!this.model}>DISCONNECT</div>
                </div>
                <div class="row">
                    <div class="col">
                        <board-button ?pressed=${this.leftbtn}></board-button>
                    </div>
                    <div class="col">
                        <div class="rows">
                            ${(Array(5).fill(0)).map((_, ridx) => html`
                                <div class="row">
                                    ${(Array(5).fill(0)).map((_, cidx) => html`
                                        <board-led .row=${ridx} .col=${cidx} @change=${this.ledChange}></board-led>
                                    `)}
                                </div>
                            `)}
                        </div>
                    </div>
                    <div class="col">
                        <board-button ?pressed=${this.rightbtn}></board-button>
                    </div>
                </div>
                <div class="row">
                    <div class="row connectors"></div>
                </div>
                <div class="overlay" @click=${this.addBoard} ?addboard=${!this.model}>
                    <div class="mega">+</div>
                </div>
            </div>
        `;
    }

    firstUpdated() {
        if (this.model) {
            this.model.addEventListener('buttons-changed', (/** @type {CustomEvent} */ evt) => {
                const data = evt.detail.data;
    
                this.leftbtn = data.left;
                this.rightbtn = data.right;
            });
    
            this.model.addEventListener('leds-changed', (/** @type {CustomEvent} */ evt) => { console.log(evt.detail); });
        }
    }

    addBoard(evt) {
        if (!this.model) {
            BLEService.scan();
        }
    }

    disconnect() {
        this.model.disconnect();
    }

    ledChange(evt) {
        const {row, col, lit} = evt.detail;

        this.model.setLED(row, col, lit);
    }

    clearAll() {
        const leds = this.shadowRoot.querySelectorAll('board-led');

        leds.forEach((/** @type {BoardLED} */led) => {
            led.lit = false;
        });
    }
}
customElements.define("microbit-board", MicrobitBoard);
