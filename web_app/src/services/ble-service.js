// @ts-check

class _BLEService extends EventTarget {
    constructor() {
        super();
        
        this.ble_devices = new Map();
        this.textDecoder = new TextDecoder();
        this.textEncoder = new TextEncoder();
    }
    
    initialize() {
        // TBD
    }
    
    async startHeartbeatNotifications (server) {
        const service = await server.getPrimaryService('12345678-1234-5678-1234-56789abcdef0');
        const characteristic = await service.getCharacteristic('12345678-1234-5678-1234-56789abcdef1');
        characteristic.addEventListener('characteristicvaluechanged', (evt) => {
            const value = evt.target.value.getInt16(0, true);
            console.log(`Heartbeat[${server.device.id}] = ${value}`);
            this.notify('heartbeat', {deviceId: server.device.id, value: value});
        });
        return characteristic.startNotifications();
    }
    
    async startDataNotifications (server) {
        const service = await server.getPrimaryService('12345678-1234-5678-1234-56789abcdef0');
        const characteristic = await service.getCharacteristic('12345678-1234-5678-1234-56789abcdef2');
        characteristic.addEventListener('characteristicvaluechanged', (evt) => {
            this.notify('data', {deviceId: server.device.id, value: evt.target.value})
        });
        return characteristic.startNotifications();
    }
    
    async fetchCmdCharacteristic (server) {
        const service = await server.getPrimaryService('12345678-1234-5678-1234-56789abcdef0');
        server.device.cmdCharacteristic = await service.getCharacteristic('12345678-1234-5678-1234-56789abcdef3');
    }

    // debounced(delay, fn) {
    //     let timerId;
    //     return function (...args) {
    //     if (timerId) {
    //         clearTimeout(timerId);
    //     }
    //     timerId = setTimeout(() => {
    //         fn(...args);
    //         timerId = null;
    //     }, delay);
    //     }
    // }

    async writeBinaryToBLEDevice (deviceId, data) {
        const device = this.ble_devices.get(deviceId);

        if (device) {
            console.log(`TX_BLE[${deviceId}]:`, data);
            await device.cmdCharacteristic.writeValue(data);
        }
    }
    
    async openBLEDevice (device) {
        try {
            const server = await device.gatt.connect();
            await this.startHeartbeatNotifications(server);
            await this.startDataNotifications(server);
            await this.fetchCmdCharacteristic(server);
            
            this.notify('connect', {deviceId: device.id});
            this.ble_devices.set(`${device.id}`, device);
            device.bleConnectedAt = Date.now();

            console.log(`connected BLE[${device.id}]`, device);
            
            device.ongattserverdisconnected = _ => { 
                console.log(`disconnected BLE[${device.id}] after ${
                    ((Date.now() - device.bleConnectedAt) / 1000)} sec`, device);
                this.notify('disconnect', {deviceId: device.id});
                this.ble_devices.delete(`${device.id}`)
            };
        } catch (err) {
            console.warn(err);
        }
    }

    async scan() {
        try {
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: ['12345678-1234-5678-1234-56789abcdef0'] }]
            });
        
            await this.openBLEDevice(device);        
        } catch (err) {
            console.warn(err);
        }
    }

    async disconnect(deviceId) {
        const device = this.ble_devices.get(deviceId);

        if (device) {
            console.log(`Disconnecting [${deviceId}]:`);
            await device.gatt.disconnect();
        }
    }

    broadcastBinary(data) {
        for(let [key, device] of this.ble_devices) {
            this.writeBinaryToBLEDevice(key, data);
        }
    }

    notify(type, data) {
        this.dispatchEvent(new CustomEvent(type, {detail: data}));
    }
    
}

export const BLEService = new _BLEService();
