"use strict";
var Endpoint = require(__rootname + "/Endpoint");
var utils = require(__rootname + "/utils");

module.exports.hand = function (request, response, url, endpoint) {
    if (Endpoint.requireParam(url, "no")) {
        if (utils.isInt(url.query.no)) {
            db.query("SELECT rID FROM mrdb.Stop WHERE No = " + db.escape(url.query.no) + ";", function (err, rows, fields) {
                if (err) {
                    db.e.emit("error", err);
                    return;
                }
                if (rows.length) {
                    url.query.id = rows[0].rID;
                    registeredEndpoints.GET["/route/vehicle"].handler(request, response, url, endpoint);
                } else {
                    endpoint.data = null;
                    Endpoint.end(response, endpoint);
                }
            });
        } else {
            Endpoint.end(response, endpoint, 400);
        }
    } else {
        Endpoint.end(response, endpoint, 400);
    }
};

module.exports.desc = "Get the vehicle type for a stop number";
module.exports.querystring = {
    no: "stop number"
};
