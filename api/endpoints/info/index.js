"use strict";
var Endpoint = require(__rootname + "/Endpoint");
var os = require("os");

module.exports.hand = function (request, response, url, endpoint) {
    endpoint.version = version;
    endpoint.uptime = process.uptime();
    endpoint.cores = os.cpus().length;
    endpoint.free = os.freemem();
    endpoint.loadavg = [];
    var load = os.loadavg();
    for (var i = 0; i < load.length; i++) {
        endpoint.loadavg.push(load[i] / endpoint.cores);
    }
    endpoint.platform = os.platform();
    endpoint.server_uptime = os.uptime();
    Endpoint.end(response, endpoint);
    return;
};

module.exports.desc = "self-describing api data";
