"use strict";
var Endpoint = require(__rootname + "/Endpoint");
var utils = require(__rootname + "/utils");

module.exports.hand = function (request, response, url, endpoint) {
    if (Endpoint.requireParam(url, "id")) {
        if (utils.isInt(url.query.id)) {
            db.query("SELECT * FROM mrdb.Delay WHERE ID = " + db.escape(url.query.id) + ";", function (err, rows, fields) {
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

module.exports.desc = "Get delay information for a delay id";
module.exports.querystring = {
    id: "delay id"
};
