// @ts-check
import { LitElement, html, css } from "lit-element";

import { BLEService } from '../services/ble-service';

import "./microbit-board";
import { BoardModel } from "../services/board-model";

export class MainApp extends LitElement {
  static get properties() {
    return {
      devices: { type:Object }
    };
  }

  static get styles() { 
    return [
      css`
        .flex-container {
          display: flex;
          height: 100%;
        }
        .content {
          margin: auto;
          position: relative;
          width: 95%;
          max-width: 800px;
        }
        
        .col {
          display: flex;
          flex-direction: column;
        }

        .row {
          display: flex;
          flex-direction: row;
        }

        h1 {
          text-align: center;
        }

        button {
          flex-grow: 1;
          font-size: 1.2rem;
          margin: 0.2em;
        }

        microbit-board {
          margin-bottom: 10px;
        }
    `];
  }

  constructor() {
    super();

    this.devices = new Map();  // deviceId, BoardModel

    BLEService.addEventListener('connect', (/** @type {CustomEvent} */ evt) => {
      const deviceId = evt.detail.deviceId;

      if (deviceId && !this.devices.has(deviceId)) {
        this.devices.set(deviceId, new BoardModel(deviceId));
        this.requestUpdate();
      }
    });

    BLEService.addEventListener('disconnect', (/** @type {CustomEvent} */ evt) => {
      const deviceId = evt.detail.deviceId;

      if (deviceId && this.devices.has(deviceId)) {
        this.devices.delete(deviceId);
        this.requestUpdate();
      }
    });

    BLEService.addEventListener('data', (/** @type {CustomEvent} */ evt) => { console.log('DATA', evt.detail)});
  }

  render() {
    return html`
      <div class="flex-container">
        <div class="content">
          <div class="col">
            <h1>Zephyr & LitElement<br>with BBC:Microbit</h1>
            <microbit-board></microbit-board>
            ${
              Array.from(this.devices.values()).map((model, idx) => {
                return html`<microbit-board .model=${model}></microbit-board>`
              })
            }
          </div>
        </div>
      </div>
    `;
  }

  firstUpdated() {    
  }
}
customElements.define("main-app", MainApp);
