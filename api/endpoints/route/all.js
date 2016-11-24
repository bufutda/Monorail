"use strict";
var Endpoint = require(__rootname + "/Endpoint");

module.exports.hand = function (request, response, url, endpoint) {
    db.query("SELECT * FROM mrdb.Route;", function (err, rows, fields) {
        if (err) {
            db.e.emit("error", err);
            return;
        }
        endpoint.data = rows;
        Endpoint.end(response, endpoint);
        return;
    });
};

module.exports.desc = "Get all routes";
