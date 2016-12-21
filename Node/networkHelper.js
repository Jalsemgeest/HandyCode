
const net = require('net');
const Socket = net.Socket;


class NetworkHelper {

  static findOpenPorts(port = 3306, ip = '192.168.0') {
    let counter = 0;
    const found = [];
    return new Promise((resolve, reject) => {
      for (let i = 1; i <= 255; i += 1) {
        this.checkPort(port, `${ip}.${i}`)
          .then(({ status, host, port }) => {
            if (status === 'open') {
              found.push(host);
            }
            counter += 1;
            if (counter === 255) {
              if (found.length > 0) {
                resolve(found);
              } else {
                reject(`Could not find open port (${port}) in ${ip}.(1-255)`);
              }
            }
          });
      }
    });
  }

  static checkPort(port, host) {
    return new Promise((resolve) => {
      const socket = new Socket();
      let status = null;
      // Socket connection established, port is open
      socket.on('connect', () => {
        status = 'open';
        socket.end();
      });
      socket.setTimeout(1500);// If no response, assume port is not listening
      socket.on('timeout', () => {
        status = 'closed';
        socket.destroy();
      });
      socket.on('error', () => {
        status = 'closed';
      });
      socket.on('close', () => resolve({status, host, port}));
      socket.connect(port, host);
    });
  }

}

module.exports = NetworkHelper;