"use strict";
var Endpoint = require(__rootname + "/Endpoint");
var Event = require("events").EventEmitter;

module.exports.hand = function (request, response, url, endpoint) {
    // parallel queries
    var cont = new Event();
    var evCount = 0;
    var done = false;
    endpoint.data = {};
    // query timeout
    var queryTimeout = setTimeout(function () {
        cont.emit("done", true);
    });
    cont.on("done", function (force) {
        if (done) {
            if (queryTimeout) {
                clearTimeout(queryTimeout);
                queryTimeout = 0;
            }
            return;
        }
        if (force) {
            if (queryTimeout) {
                clearTimeout(queryTimeout);
                queryTimeout = 0;
            }
            delete endpoint.data;
            Endpoint.end(response, endpoint, 504, "Gateway timeout");
            done = true;
            return;
        }
        evCount++;
        if (evCount === 4) {
            if (queryTimeout) {
                clearTimeout(queryTimeout);
                queryTimeout = 0;
            }
            Endpoint.end(response, endpoint);
            done = true;
            return;
        }
    });
    db.query("SELECT * FROM (mrdb.Delay AS D JOIN mrdb.Maintenance AS M ON D.ID = M.dID);", function (err, rows, fields) {
        if (err) {
            done = true;
            db.e.emit("error", err);
            return;
        }
        endpoint.data.maintenance = rows;
        cont.emit("done", false);
    });
    db.query("SELECT * FROM (mrdb.Delay AS D JOIN mrdb.Environment AS E ON D.ID = E.dID);", function (err, rows, fields) {
        if (err) {
            done = true;
            db.e.emit("error", err);
            return;
        }
        endpoint.data.environment = rows;
        cont.emit("done", false);
    });
    db.query("SELECT * FROM (mrdb.Delay AS D JOIN mrdb.Accident AS A ON D.ID = A.dID);", function (err, rows, fields) {
        if (err) {
            done = true;
            db.e.emit("error", err);
            return;
        }
        endpoint.data.accident = rows;
        cont.emit("done", false);
    });
    db.query("SELECT * FROM (mrdb.Delay AS D JOIN mrdb.Other AS O ON D.ID = O.dID);", function (err, rows, fields) {
        if (err) {
            done = true;
            db.e.emit("error", err);
            return;
        }
        endpoint.data.other = rows;
        cont.emit("done", false);
    });
};

module.exports.desc = "Get all delays";
