"use strict";
var Endpoint = require(__rootname + "/Endpoint");
var utils = require(__rootname + "/utils");

module.exports.hand = function (request, response, url, endpoint) {
    if (Endpoint.requireParam(url, "no")) {
        if (utils.isInt(url.query.no)) {
            db.query("SELECT * FROM mrdb.Route AS R WHERE R.ID IN (SELECT rID FROM mrdb.Stop AS S WHERE " + db.escape(url.query.no) + " = S.No);", function (err, rows, fields) {
                if (err) {
                    db.e.emit("error", err);
                    return;
                }
                endpoint.data = rows;
                Endpoint.end(response, endpoint);
                return;
            });
        } else {
            Endpoint.end(response, endpoint, 400);
        }
    } else {
        Endpoint.end(response, endpoint, 400);
    }
};

module.exports.desc = "Get the route containing a stop number";
module.exports.querystring = {
    no: "stop number"
};
