"use strict";
var Endpoint = require(__rootname + "/Endpoint");
var utils = require(__rootname + "/utils");
var Event = require("events").EventEmitter;

module.exports.hand = function (request, response, url, endpoint) {
    if (Endpoint.requireParam(url, "no")) {
        if (utils.isInt(url.query.no)) {
            // parallel queries
            var cont = new Event();
            var evCount = 0;
            var done = false;
            endpoint.data = {};
            // query timeout
            var queryTimeout = setTimeout(function () {
                cont.emit("done", true);
            }, 5000);
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
            db.query("SELECT * FROM ((mrdb.Delay AS D JOIN mrdb.Maintenance AS M ON D.ID = M.dID) JOIN mrdb.Stop AS S ON S.No = D.sNo) WHERE S.No = " + db.escape(url.query.no) + ";", function (err, rows, fields) {
                if (err) {
                    done = true;
                    db.e.emit("error", err);
                    return;
                }
                endpoint.data.maintenance = rows;
                cont.emit("done", false);
            });
            db.query("SELECT * FROM ((mrdb.Delay AS D JOIN mrdb.Environmental AS E ON D.ID = E.dID) JOIN mrdb.Stop AS S ON S.No = D.sNo) WHERE S.No = " + db.escape(url.query.no) + ";", function (err, rows, fields) {
                if (err) {
                    done = true;
                    db.e.emit("error", err);
                    return;
                }
                endpoint.data.environment = rows;
                cont.emit("done", false);
            });
            db.query("SELECT * FROM ((mrdb.Delay AS D JOIN mrdb.Accident AS A ON D.ID = A.dID) JOIN mrdb.Stop AS S ON S.No = D.sNo) WHERE S.No = " + db.escape(url.query.no) + ";", function (err, rows, fields) {
                if (err) {
                    done = true;
                    db.e.emit("error", err);
                    return;
                }
                endpoint.data.accident = rows;
                cont.emit("done", false);
            });
            db.query("SELECT * FROM ((mrdb.Delay AS D JOIN mrdb.Other AS O ON D.ID = O.dID) JOIN mrdb.Stop AS S ON S.No = D.sNo) WHERE S.No = " + db.escape(url.query.no) + ";", function (err, rows, fields) {
                if (err) {
                    done = true;
                    db.e.emit("error", err);
                    return;
                }
                endpoint.data.other = rows;
                cont.emit("done", false);
            });
        } else {
            Endpoint.end(response, endpoint, 400);
        }
    } else {
        Endpoint.end(response, endpoint, 400);
    }
};

module.exports.desc = "Get all delays affecting a stop number";
module.exports.querystring = {
    no: "stop number"
};
