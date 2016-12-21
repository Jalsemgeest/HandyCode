const network = require('./networkHelper');

network.findOpenPorts(8080)
  .then(found => console.log(found))
  .catch(err => console.log(err));
