"use strict";

module.exports = function (enpt) {
    if (!enpt.code.hasOwnProperty("hand")) {
        var e = new Error("Incomplete Endpoint: No endpoint handler: \x1b[31m" + enpt.abspath + "\x1b[0m");
        throw e;
    }
    if (!enpt.code.hasOwnProperty("desc")) {
        var e = new Error("Incomplete Endpoint: No endpoint description: \x1b[31m" + enpt.abspath + "\x1b[0m");
        throw e;
    }
    this.handler = enpt.code.hand;
    this.desc = enpt.code.desc;
    this.hidden = enpt.code.hidden;
    this.querystring = enpt.code.querystring;
};

/**
 * URL Parameter checking for endpoints
 * @example requireParam(url, "foo") - true if foo
 * @example requireParam(url, ["foo", "bar"]) - true if foo && bar
 * @example requireParam(url, "foo", ["bar", "cat"]) - true if foo = bar || cat
 * @example requireParam(url, ["foo", "bar"], ["cat", "dog"]) - true if foo = cat || dog, bar = cat || dog
 * @example requireParam(url, {foo: ["bar", true], cat: ["dog", "mouse"]}) - true if foo = bar || true, cat = dog || mouse
 * @example requireParam(url, ["foo", "bar"], {foo: [true, false]}) - true if bar && foo = true || false
 * @example requireParam(url, {foo: ["bar", "quux"], foobar: null}) - true if foo = bar | quux, foobar = *
 * @param {uri} url - uri object containing the querystring
 * @param {array|string|hash} req - the required param name
 * @param {array|object} possible - [optional] the possible values for the parameter
 * @returns {boolean} - true if the querystring object has the parameter
 */
module.exports.requireParam = function (url, req, possible) { // eslint-disable-line no-unused-vars
    if (url && req) {
        if (typeof req === "string") {
            req = [req];
        } else if (typeof req === "object" && typeof possible === "undefined" && !(req instanceof Array)) {
            var t = [];
            for (var prop in req) {
                t.push(prop);
            }
            possible = req;
            req = t;
        }
        for (var i = 0; i < req.length; i++) {
            if (url.query.hasOwnProperty(req[i])) {
                if (possible && possible instanceof Array) {
                    if (possible.indexOf(url.query[req[i]]) === -1) {
                        return false;
                    }
                } else if (possible) {
                    if (possible.hasOwnProperty(req[i])) {
                        if (possible[req[i]] !== null) {
                            if (possible[req[i]] instanceof Array) {
                                if (possible[req[i]].indexOf(url.query[req[i]]) === -1) {
                                    return false;
                                }
                            } else if (typeof possible[req[i]] === "number") {
                                switch (possible[req[i]]) {
                                    case module.exports.REQ_INT:
                                        if (isNaN(url.query[req[i]]) || !(function (x) { return (x | 0) === x; })(parseFloat(url.query[req[i]]))) { // eslint-disable-line no-bitwise
                                            if (url.query[req[i]].length > 9) {
                                                if (!isNaN(parseInt(url.query[req[i]], 10)) && parseInt(url.query[req[i]], 10) > 2147483647) {
                                                    log.wrn("isInt FAILS on ints larger than 2147483647; Undocumented behaviour for testing \"" + url.query[req[i]] + "\"");
                                                }
                                            }
                                            return false;
                                        }
                                        break;
                                    default:
                                        throw new Error("Unknown REQ constant: " + possible[req[i]]);
                                }
                            } else {
                                throw new Error("Bad value in req hash: " + possible[req[i]]);
                            }
                        } else if (url.query[req[i]].length === 0) {
                            return false;
                        }
                    }
                }
            } else {
                return false;
            }
        }
        return true;
    }
    throw new Error("Bad requireParam call");
};

/**
 * Ends a request to the server
 * @param {Response} response - the original response object
 * @param {Endpoint} endpoint - the endpoint (JSON) to respond with
 * @returns {undefined}
 */
module.exports.end = function (response, endpoint) { // eslint-disable-line no-unused-vars
    for (var i = 2; i < arguments.length; i++) {
        switch (typeof arguments[i]) {
            case "object":
                endpoint.data = arguments[i];
                break;
            case "string":
                endpoint.message = arguments[i];
                break;
            case "number":
                if (!endpoint.hasOwnProperty("message")) {
                    switch (arguments[i]) {
                        case 500:
                            endpoint.message = "internal server error";
                            break;
                        case 503:
                            endpoint.message = "database unavailable";
                            break;
                        case 400:
                            endpoint.message = "bad request";
                            break;
                        case 401:
                            endpoint.message = "unauthorized";
                            break;
                    }
                }
                endpoint.type = arguments[i];
                if (endpoint.type > 399) {
                    endpoint.error = true;
                } else {
                    endpoint.error = false;
                }
                if (arguments[i] === 200) {
                    endpoint.type = 200;
                    endpoint.error = false;
                }
                break;
            default:
                log.err("Unknown argument type in Endpoint.end");
                console.error(new Error("Unknown argument type in Endpoint.end"));
                break;
        }
    }
    if (response.statusCode !== 200) {
        log.wrn("response statuscode was not 200");
        console.error(new Error("response statuscode was not 200"));
    }
    if (!endpoint.hasOwnProperty("type") || !endpoint.hasOwnProperty("error")) {
        log.err("Incomplete endpoint");
        console.error(new Error("endpoint incomplete"));
    }
    response.end(JSON.stringify(endpoint));
    return;
};

module.exports.DB_UNAVAILABLE = 503;
module.exports.REQ_INT = 901;
