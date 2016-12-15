"use strict";
var Endpoint = require(__rootname + "/Endpoint");
var utils = require(__rootname + "/utils");

module.exports.hand = function (request, response, url, endpoint) {
    if (Endpoint.requireParam(url, "id")) {
        if (utils.isInt(url.query.id)) {
            db.query("SELECT * FROM Bus AS B WHERE B.ID IN (SELECT V.ID FROM (Vehicle AS V JOIN Route AS R ON V.rID = R.ID) WHERE V.rID = " + db.escape(url.query.id) + ");", function (err, rows, feilds) {
                if (err) {
                    db.e.emit("error", err);
                } else if (rows.length) {
                    endpoint.data = "bus";
                    Endpoint.end(response, endpoint);
                    return;
                } else {
                    db.query("", function (err, rows, feilds) {
                        if (err) {
                            db.e.emit("error", err);
                        } else if (rows.length) {
                            endpoint.data = "train";
                            Endpoint.end(response, endpoint);
                            return;
                        } else {
                            endpoint.data = null;
                            Endpoint.end(response, endpoint);
                        }
                    });
                }
            });
        } else {
            Endpoint.end(response, endpoint, 400);
        }
    } else {
        Endpoint.end(response, endpoint, 400);
    }
};

module.exports.desc = "Get the vehicle type for a route id";
module.exports.querystring = {
    id: "route id"
};
