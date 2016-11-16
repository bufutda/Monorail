"use strict";
var Endpoint = require(__rootname + "/Endpoint");

module.exports.hand = function (request, response, url, endpoint) {
    endpoint.version = version;
    endpoint.endpoints = [];
    for (var prop in registeredEndpoints.GET) {
        if (typeof registeredEndpoints.GET[prop].hidden === "undefined") {
            endpoint.endpoints.push({desc: registeredEndpoints.GET[prop].desc, uri: prop, method: "GET"});
        }
    }
    for (var prop in registeredEndpoints.POST) {
        if (typeof registeredEndpoints.POST[prop].hidden === "undefined") {
            endpoint.endpoints.push({desc: registeredEndpoints.POST[prop].desc, uri: prop, method: "POST"});
        }
    }
    endpoint.endpoints = endpoint.endpoints.sort(function (a, b) {
        if (a.uri < b.uri) {
            return -1;
        }
        return 1;
    });
    Endpoint.end(response, endpoint);
    return;
};

module.exports.desc = "self-describing api data";
