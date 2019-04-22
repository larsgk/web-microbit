// @ts-check
import { LitElement, html, css } from "lit-element";

import { BLEService } from './services/ble-service';

import "./components/microbit-board";
import { BoardModel } from "./services/board-model";

import { ServiceWorkerReg } from './reg-sw';

export class MainApp extends LitElement {
  static get properties() {
    return {
      devices: { type:Object },
      updateAvailable: { type:Boolean }
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

        .refresh {
          position: fixed;
          left: 20px;
          bottom: 20px;
          background: black;
        }

        a {
          font-weight: bold;
          line-height: 40px;
          color: white;
          margin: 20px;
        }

        a:hover {
          color: purple;
          cursor: pointer;
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

    // Register Service Worker and listen for updates available.
    this.updateAvailable = false;
    ServiceWorkerReg.addEventListener('update-available', () => {
      this.updateAvailable = true;
      console.log('Update available');
    });
    ServiceWorkerReg.register();
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
      ${this.updateAvailable ? 
        html`<div class="refresh"><a @click=${this.refresh}>REFRESH APP</a></div>` : ''}
    `;
  }

  refresh() {
    window.location.reload();    
  }
}
customElements.define("main-app", MainApp);
