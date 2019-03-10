// @ts-check

import { BLEService } from './ble-service';

// BoardModel handles syncs state for one board (buttons and leds) between BLE/GATT and UI

export class BoardModel extends EventTarget {
    constructor(deviceId) {
        super();

        this.deviceId = deviceId;

        this._state = {
            buttons: {
                left: false,
                right: false
            },
            ledData: new Uint8Array([1, 0, 0, 0, 0, 0]) // Add one byte for 'cmd == set led'
        }

        // TODO: Individual events (ble-data:<deviceId>)
        BLEService.addEventListener('data', (/** @type {CustomEvent} */ evt) => {
            if (evt.detail.deviceId === this.deviceId) {
                this.handleData(evt.detail.value);                
            }
        });

    }

    get state() {
        return this._state;
    }

    disconnect() {
        BLEService.disconnect(this.deviceId);
    }

    dispatchAll() {
        this.dispatchEvent(new CustomEvent('leds-changed', {detail: {data: this._state.ledData}}));
        this.dispatchEvent(new CustomEvent('buttons-changed', {detail: {data: this._state.buttons}}));
    }

    async setLED(row, col, lit) {
        console.log(row, col, lit);
        let val = this._state.ledData[1+row];
        const mask = (1<<col);

        if (lit) {
            val |= mask;
        } else {
            val &= ~mask;
        }

        this._state.ledData[1+row] = val;

        console.log(this._state);
        
        await BLEService.writeBinaryToBLEDevice(this.deviceId, this._state.ledData);
    }

    async clear(lit) {
        if (lit) {
            this._state.ledData = new Uint8Array([1, 0x1f, 0x1f, 0x1f, 0x1f, 0x1f]);
        } else {
            this._state.ledData = new Uint8Array([1, 0, 0, 0, 0, 0]);
        }

        this.dispatchEvent(new CustomEvent('leds-changed', {detail: {data: this._state.ledData}}));
        await BLEService.writeBinaryToBLEDevice(this.deviceId, this._state.ledData);
    }

    handleData(data) {
        console.log(`data[${this.deviceId}]`, data.getUint8(0), data.getUint8(1), data.getUint8(2));
        const cmd = data.getUint8(0);
        switch(cmd) {
            case 0x10: // btn change
                if(data.byteLength != 3) {
                    return;
                }
                const btn = data.getUint8(1);
                const pressed = data.getUint8(2) === 1;
                if(btn === 0) {
                    this._state.buttons.left = pressed;
                } else if(btn === 1) {
                    this._state.buttons.right = pressed;
                }
                this.dispatchEvent(new CustomEvent('buttons-changed', {detail: {data: this._state.buttons}}));
                break;
        }
    }
}