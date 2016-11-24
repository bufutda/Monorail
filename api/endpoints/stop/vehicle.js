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
                for (var i = 0; i < rows.length; i++) {
                    (function (last) {
                        // TODO: call /route/vehicle?id={rID}
                    })(i === rows.length - 1);
                }
                // endpoint.data = rows;
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

module.exports.desc = "Get the vehicle type for a stop number";
module.exports.querystring = {
    no: "stop number"
};
