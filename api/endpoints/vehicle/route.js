"use strict";
var Endpoint = require(__rootname + "/Endpoint");

module.exports.hand = function (request, response, url, endpoint) {
    if (Endpoint.requireParam(url, ["type"], {type: ["bus", "train"]})) {
        if (url.query.type === "bus") {
            db.query("SELECT DISTINCT R.ID, R.rStart, R.rEnd, R.Num_stops FROM (Bus NATURAL JOIN Vehicle AS V) JOIN Route AS R ON R.ID = V.rID;", function (err, rows, feilds) {
                if (err) {
                    db.e.emit("error", err);
                } else {
                    endpoint.data = rows;
                    Endpoint.end(response, endpoint);
                }
            });
        } else if (url.query.type === "train") {
            db.query("SELECT DISTINCT R.ID, R.rStart, R.rEnd, R.Num_stops FROM (Train NATURAL JOIN Vehicle AS V) JOIN Route AS R ON R.ID = V.rID;", function (err, rows, feilds) {
                if (err) {
                    db.e.emit("error", err);
                } else {
                    endpoint.data = rows;
                    Endpoint.end(response, endpoint);
                }
            });
        } else {
            Endpoint.end(response, endpoint, 500);
            return;
        }
    } else {
        Endpoint.end(response, endpoint, 400);
    }
};

module.exports.desc = "Get all routes for a vehicle type";
module.exports.querystring = {
    type: "vehicle type"
};
