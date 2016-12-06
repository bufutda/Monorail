"use strict";
var Endpoint = require(__rootname + "/Endpoint");

module.exports.hand = function (request, response, url, endpoint) {
    if (Endpoint.requireParam(url, "q")) {
        if (url.query.q.length > 0) {
            db.query("SELECT * FROM mrdb.Stop WHERE Stop.Location LIKE " + db.escape("%" + url.query.q + "%") + ";", function (err, rows, fields) {
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

module.exports.desc = "Search for a stop based on location";
module.exports.querystring = {
    q: "location substring"
};
