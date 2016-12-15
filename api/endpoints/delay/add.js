"use strict";
var Endpoint = require(__rootname + "/Endpoint");
var utils = require(__rootname + "/utils");

module.exports.hand = function (request, response, url, endpoint) {
    if (Endpoint.requireParam(url, ["type", "origin", "start", "stop"], {type: ["accident", "maintenance", "environmental", "other"]})) {
        endpoint.origin = url.query.origin;
        endpoint.start = parseInt(url.query.start, 10);
        endpoint.end = (url.query.hasOwnProperty("end") && utils.isInt(url.query.end)) ? parseInt(url.query.end, 10) : null;
        endpoint.stop = parseInt(url.query.stop, 10);
        endpoint.description = url.query.hasOwnProperty("desc") ? url.query.desc : null;

        db.query("REPLACE INTO mrdb.Delay (Origin, Description, dStart, dEnd, sNo) VALUES (" + [db.escape(endpoint.origin), db.escape(endpoint.description), db.escape(endpoint.start), db.escape(endpoint.end), db.escape(endpoint.stop)].join(", ") + ");", function (err, rows, fields) {
            if (err) {
                Endpoint.end(response, endpoint, 500, err.toString());
            } else {
                switch (url.query.type) {
                    case "accident":
                        endpoint.cause = url.query.hasOwnProperty("meta") ? url.query.meta : null;
                        db.query("REPLACE INTO mrdb.Accident (dID, Cause) VALUES (LAST_INSERT_ID(), " + db.escape(endpoint.cause) + ");", function (err, rows, fields) {
                            if (err) {
                                db.e.emit("error", err);
                            } else {
                                Endpoint.end(response, endpoint);
                            }
                        });
                        break;
                    case "maintenance":
                        db.query("REPLACE INTO mrdb.Maintenance (dID) VALUES (LAST_INSERT_ID());", function (err, rows, fields) {
                            if (err) {
                                db.e.emit("error", err);
                            } else {
                                Endpoint.end(response, endpoint);
                            }
                        });
                        break;
                    case "environmental":
                        endpoint.type = url.query.hasOwnProperty("meta") ? url.query.meta : null;
                        db.query("REPLACE INTO mrdb.Environmental (dID, Type) VALUES (LAST_INSERT_ID(), " + db.escape(endpoint.cause) + ");", function (err, rows, fields) {
                            if (err) {
                                db.e.emit("error", err);
                            } else {
                                Endpoint.end(response, endpoint);
                            }
                        });
                        break;
                    case "other":
                        db.query("REPLACE INTO mrdb.Other (dID) VALUES (LAST_INSERT_ID());", function (err, rows, fields) {
                            if (err) {
                                db.e.emit("error", err);
                            } else {
                                Endpoint.end(response, endpoint);
                            }
                        });
                        break;
                    default:
                        Endpoint.end(response, endpoint, 500);
                }
            }
        });
    } else {
        Endpoint.end(response, endpoint, 400);
    }
};

module.exports.desc = "Add delay information";
module.exports.querystring = {
    type: "delay type",
    origin: "delay origin",
    desc: "delay description (optional)",
    start: "unix timestamp of the delay start",
    end: "unix timestamp of the delay end (optional)",
    stop: "the stop number affected",
    meta: "the other attribute, depending on the type (optional)"
};
