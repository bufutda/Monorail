"use strict";
var Endpoint = require(__rootname + "/Endpoint");

module.exports.hand = function (request, response, url, endpoint) {
    if (Endpoint.requireParam(url, ["start", "stop"], {start: Endpoint.REQ_INT, stop: Endpoint.REQ_INT})) {
        db.query("SELECT No, rID FROM Stop WHERE No = " + db.escape(url.query.start) + " OR No = " + db.escape(url.query.stop) + ";", function (err, rows, feilds) {
            if (err) {
                db.e.emit("error", err);
            } else if (rows[0].rID !== rows[1].rID) {
                Endpoint.end(response, endpoint, 400, "stops in different routes");
                return;
            } else {
                db.query("SELECT MAX(aTime) FROM Arrives_At WHERE sNo = " + db.escape(url.query.start) + " UNION SELECT MAX(aTime) FROM Arrives_At WHERE sNo = " + db.escape(url.query.stop) + ";", function (err, rows, fields) {
                    if (err) {
                        db.e.emit("error", err);
                    } else {
                        var d = new Date();
                        endpoint.data = d.getTime() - Math.abs(rows[1]["MAX(aTime)"] - rows[0]["MAX(aTime)"]);
                        Endpoint.end(response, endpoint);
                    }
                });
            }
        });
    } else {
        Endpoint.end(response, endpoint, 400);
    }
};

module.exports.desc = "Get stop data for a stop number";
module.exports.querystring = {
    start: "starting stop number",
    stop: "ending stop number"
};
