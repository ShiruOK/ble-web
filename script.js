document.getElementById('connect').addEventListener('click', connectToDevice);
document.getElementById('disconnect').addEventListener('click', disconnectFromDevice);

let device;
let server;
let isConnected = false;

async function connectToDevice() {
    try {
        device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['battery_service'] // Thay thế bằng dịch vụ của thiết bị bạn muốn kết nối
        });

        server = await device.gatt.connect();
        isConnected = true;
        updateStatus('Connected');

        document.getElementById('disconnect').disabled = false;
    } catch (error) {
        console.error(error);
        updateStatus('Failed to connect');
    }
}

async function disconnectFromDevice() {
    if (device && device.gatt.connected) {
        await device.gatt.disconnect();
        isConnected = false;
        updateStatus('Disconnected');

        document.getElementById('disconnect').disabled = true;
    }
}

function updateStatus(status) {
    document.getElementById('status').textContent = `Status: ${status}`;
}
