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
        displayDeviceInfo(device);

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
        clearDeviceInfo();

        document.getElementById('disconnect').disabled = true;
    }
}

function updateStatus(status) {
    document.getElementById('status').textContent = `Status: ${status}`;
}

function displayDeviceInfo(device) {
    const deviceInfoDiv = document.getElementById('device-info');
    deviceInfoDiv.innerHTML = `
        <h2>Device Information</h2>
        <p>Name: ${device.name}</p>
        <p>ID: ${device.id}</p>
    `;

    // Fetch and display all services and characteristics
    getAllServicesAndCharacteristics(device);
}

function clearDeviceInfo() {
    const deviceInfoDiv = document.getElementById('device-info');
    deviceInfoDiv.innerHTML = '';
}

async function getAllServicesAndCharacteristics(device) {
    const deviceInfoDiv = document.getElementById('device-info');

    try {
        const services = await server.getPrimaryServices();
        for (const service of services) {
            const serviceElement = document.createElement('div');
            serviceElement.innerHTML = `<h3>Service: ${service.uuid}</h3>`;
            deviceInfoDiv.appendChild(serviceElement);

            const characteristics = await service.getCharacteristics();
            for (const characteristic of characteristics) {
                const characteristicElement = document.createElement('div');
                characteristicElement.innerHTML = `
                    <p>Characteristic: ${characteristic.uuid}</p>
                    <p>Properties: ${JSON.stringify(characteristic.properties)}</p>
                `;
                serviceElement.appendChild(characteristicElement);
            }
        }
    } catch (error) {
        console.error('Failed to get services and characteristics:', error);
    }
}
