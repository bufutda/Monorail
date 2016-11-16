"use strict";

var https = require("https");
var fs = require("fs");
var pathLib = require("path");
var Getopt = require("node-getopt");
var mysql = require("mysql");
var Endpoint = require(__dirname + "/Endpoint");

global.version = "1.0";
global.PORT = 9070;
global.__rootname = __dirname;
global.log = new (require(__dirname + "/log").Logger)();
global.authentication = {token: {}};
global.registeredEndpoints = {POST: {}, GET: {}};

log.logLevel.debug = true;
log.logLevel.module = true;

var getopt = new Getopt([
    ["h", "help", "Print help info and quit"],
    ["", "offline", "Ignore network-based errors"]
]);
getopt.setHelp(
    "Copyright (c) 2016 Mitchell Sawatzky. All rights reserved.\n" +
    "Monorail API v" + version + "\n" +
    "\n" +
    "Usage: node api [OPTION]\n" +
    "\n" +
    "[[OPTIONS]]\n"
);
global.opt = getopt.parseSystem();
if (opt.options.hasOwnProperty("help")) {
    getopt.showHelp();
    process.exit(0);
}

/**
 * Handles every https request that makes it to the server.
 * @param {object} request - included in https
 * @param {object} response - included in https
 * @returns {undefined}
 */
function handleRequest (request, response) {
    response.on("close", function () {
        log.wrn("The underlying connection was terminated before response.end() was called or able to flush.");
    });
    response.on("finish", function () {
        log.debug("Request finished: " + request.method + " " + request.url + "\n");
    });
    var url = {
        original: request.url,
        split: request.url.split("?")
    };
    log.debug("New request: " + request.method + " " + request.url);
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.setHeader("Access-Control-Allow-Origin", "https://sa.watz.ky");
    response.setHeader("Server", "monorail-api/1.0");
    response.setHeader("Status", "200 OK");
    url.path = url.split[0];
    url.split.splice(0, 1);
    url.a = url.split.join("?").split("&");
    delete url.split;
    url.query = {};
    try {
        for (var i = 0; i < url.a.length; i++) {
            if (url.a[i] !== "") {
                url.query[decodeURIComponent(url.a[i].substr(0, url.a[i].indexOf("=")))] = decodeURIComponent(url.a[i].substr(url.a[i].indexOf("=") + 1));
            }
        }
    } catch (e) {
        console.error(e);
        response.end(JSON.stringify({error: true, type: 601, message: "ERR_MALFORMED_URI"}));
        return;
    }
    delete url.a;
    var endpoint = {
        error: false,
        type: 200,
        _path: {
            base: url.path,
            query: url.query
        }
    };
    switch (request.method) {
        case "GET":
            try {
                var suc = false;
                for (var prop in registeredEndpoints.GET) {
                    if (url.path.toLowerCase() === prop) {
                        registeredEndpoints.GET[prop].handler(request, response, url, endpoint);
                        suc = true;
                        break;
                    }
                }
                if (!suc) {
                    response.statusCode = 200;
                    endpoint.type = 404;
                    endpoint.error = true;
                    endpoint.message = "Endpoint not found: " + url.path;
                    response.end(JSON.stringify(endpoint));
                }
            } catch (e) {
                log.err(e);
                console.error(e.stack);
                response.statusCode = 200;
                endpoint.type = 500;
                endpoint.error = true;
                endpoint.message = "Internal server error";
                response.end(JSON.stringify(endpoint));
            }
            break;
        case "POST":
            var queryData = "";
            request.on("data", function (data) {
                queryData += data;
                if (queryData.length > 1e6) {
                    queryData = "";
                    response.writeHead(413, {"Content-Type": "text/plain"});
                    request.connection.destroy();
                }
            });
            request.on("end", function () {
                request.qData = queryData;
                try {
                    var suc = false;
                    for (var prop in registeredEndpoints.POST) {
                        if (url.path.toLowerCase() === prop) {
                            registeredEndpoints.POST[prop].handler(request, response, url, endpoint);
                            suc = true;
                            break;
                        }
                    }
                    if (!suc) {
                        response.statusCode = 405;
                        response.end();
                    }
                } catch (e) {
                    log.err(e);
                    console.error(e.stack);
                    response.statusCode = 500;
                    response.end();
                }
            });
            break;
        default:
            response.statusCode = 405;
            response.end();
            break;
    }
}

log.std("Starting up...");
log.std("Loading static files into memory...");
global.key = fs.readFileSync("/etc/apache2/ssl/watz_d.key");
global.cert = fs.readFileSync("/etc/apache2/ssl/watz_chain.crt");
global.passwd = fs.readFileSync(__dirname + "/dbpswd").toString().replace(/\n/, "");

log.std("Creating server...");
var server = https.createServer({key: key, cert: cert}, handleRequest);

/**
 * Recursively decend into a directory and load endpoints
 * @param {string} path - the path to search
 * @returns {undefined}
 */
function descend (path) {
    var dir = fs.readdirSync(path);
    for (var i = 0; i < dir.length; i++) {
        if (dir[i].substr(0, 1) !== ".") {
            if (fs.lstatSync(path + "/" + dir[i]).isDirectory()) {
                descend(path + "/" + dir[i]);
            } else if (dir[i].substr(-3) === ".js") {
                var enpt = {};
                if (/^[a-z\-_0-9]*\.post\.js$/i.test(dir[i])) {
                    enpt.type = "POST";
                } else {
                    enpt.type = "GET";
                }
                enpt.name = dir[i].substring(0, dir[i].indexOf("."));
                enpt.abspath = pathLib.resolve(path + "/" + dir[i]);
                enpt.path = ("/" + pathLib.resolve(path).substring(pathLib.resolve(path).indexOf("endpoints")) + "/" + (enpt.name === "index" ? "" : enpt.name)).substring(10);
                enpt.code = require(enpt.abspath);
                registeredEndpoints[enpt.type][enpt.path] = new Endpoint(enpt);
                log.startup("Registered endpoint:  %p" + enpt.type + "\t%b" + enpt.path + "\t%n" + enpt.code.desc + (enpt.code.hidden ? "\t%yHIDDEN%n" : ""));
            } else {
                log.wrn("Unexpected non-js file in endpoints: " + path + "/%r" + dir[i]);
            }
        }
    }
}
log.startup("Descending into endpoints...");
descend(__dirname + "/endpoints");


log.startup("%gEndpoint registry complete");

// TODO database spoofing
global.db = mysql.createConnection({
    host: "localhost",
    user: "monorail",
    password: passwd
});

db.connect(function (err) {
    if (err) {
        log.err("error connecting: " + err.stack);
        process.exit(1);
    }
    log.std("connected as id " + db.threadId);
    log.std("Database ready.");
    server.listen(PORT, function () {
        log.std("Server listening on https://localhost:" + PORT + "/");
    });
});
