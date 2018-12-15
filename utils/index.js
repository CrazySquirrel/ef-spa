const os = require('os');

// Get current os ip address
function getCurrentIP() {
  const ifaces = os.networkInterfaces();

  for (const ifname in ifaces) {
    if (ifaces.hasOwnProperty(ifname)) {
      for (const iface of ifaces[ifname]) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          continue;
        }

        return iface.address;
      }
    }
  }

  return '127.0.0.1';
}

module.exports = {
  getCurrentIP
};