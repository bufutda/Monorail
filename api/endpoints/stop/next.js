"use strict";
var Endpoint = require(__rootname + "/Endpoint");
var utils = require(__rootname + "/utils");

module.exports.hand = function (request, response, url, endpoint) {
    if (Endpoint.requireParam(url, "no")) {
        if (utils.isInt(url.query.no)) {
            db.query("SELECT S.No, S.Location, S.rID FROM (mrdb.Stop AS S JOIN mrdb.Lays_Between AS L ON S.No = L.Next_no) WHERE L.Prev_no = " + db.escape(url.query.no) + ";", function (err, rows, fields) {
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

module.exports.desc = "Get the next stop for a stop number";
module.exports.querystring = {
    no: "stop number"
};
