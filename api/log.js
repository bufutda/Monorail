/* eslint-disable no-console */
"use strict";
var fs = require("fs");

/**
 * Constructor for a collection of logging methods that support colour.
 * @param {object} opts - an object of options pertainting to log verboseness
 * @returns {undefined}
 */
function Logger (opts) {
    var _levels = [
        "msg",
        "debug",
        "send",
        "get",
        "info",
        "module"
    ];
    if (typeof opts === "undefined") {
        opts = {};
    } else {
        for (var prop in opts) {
            if (typeof opts[prop] !== "boolean") {
                console.log(new Error("Invalid logger option: {" + prop + ":\x1b[31m " + opts[prop].toString() + "\x1b[0m}").stack);
                process.exit(1);
            }
            if (_levels.indexOf(prop) === -1) {
                console.log(new Error("Invalid logger option: {\x1b[31m" + prop + "\x1b[0m: " + opts[prop].toString() + "}").stack);
                process.exit(1);
            }
        }
    }
    this.doFileLogger = false;
    this.logPath = "";
    this.logLevel = {
        msg: opts.msg ? opts.msg : false,
        debug: opts.debug ? opts.debug : false,
        send: opts.send ? opts.send : false,
        get: opts.get ? opts.get : false,
        info: opts.info ? opts.info : false,
        module: opts.module ? opts.module : false
    };
    this.stdoutPrepend = "";
    this.stderrPrepend = "";
    this.destroyAll = false;
}

/**
 * Replaces %x codes in the log function with ANSI colour escape sequences
 * @param {string} str - the string to parseFloat
 * @param {boolean} erase - if true, simply remove the colour directives
 * @returns {string} the parsed string
 */
function clrRep (str, erase) {
    str = str.replace(/\%r/g, (erase ? "" : "\x1b[31m")
        ).replace(/\%g/g, (erase ? "" : "\x1b[32m")
        ).replace(/\%y/g, (erase ? "" : "\x1b[33m")
        ).replace(/\%b/g, (erase ? "" : "\x1b[34m")
        ).replace(/\%c/g, (erase ? "" : "\x1b[36m")
        ).replace(/\%p/g, (erase ? "" : "\x1b[35m")
        ).replace(/\%h/g, (erase ? "" : "\x1b[37m")
        ).replace(/\%k/g, (erase ? "" : "\x1b[30m")
        ).replace(/\%w/g, (erase ? "" : "\x1b[0m")
        ).replace(/\%n/g, (erase ? "" : "\x1b[0m"));
    return str;
}
Logger.prototype._log = function (msg, clr, n) {
    if (!this.destroyAll) {
        var str = [];
        for (var prop in msg) {
            if (typeof msg[prop] === "object") {
                if (msg[prop].hasOwnProperty("channel")) {
                    str.push("[" + msg[prop].channel + "]");
                } else {
                    str.push(clrRep(msg[prop].toString()));
                }
            } else {
                str.push(clrRep(msg[prop]));
            }
        }
        process.stdout.write(this.stdoutPrepend + clr + str.join(" ") + "\x1b[0m" + (n ? "\n" : ""));
    }
};
Logger.prototype._err = function (msg, clr, n) {
    if (!this.destroyAll) {
        var str = [];
        for (var prop in msg) {
            if (typeof msg[prop] === "object") {
                if (msg[prop].hasOwnProperty("channel")) {
                    str.push("[" + msg[prop].channel + "]");
                } else {
                    str.push(clrRep(msg[prop].toString()));
                }
            } else {
                str.push(clrRep(msg[prop]));
            }
        }
        process.stderr.write(this.stderrPrepend + clr + str.join(" ") + "\x1b[0m" + (n ? "\n" : ""));
        if (this.doFileLogger) {
            str = [];
            for (var prop in msg) {
                str.push(clrRep(msg[prop], true));
            }
            fs.appendFile(this.logPath, "[" + (new Date()).toUTCString() + "] " + this.stderrPrepend + str.join(" ") + (n ? "\n" : ""), function (err) {
                if (err) {
                    Logger.prototype.red("log._err APPEND THREW AN ERROR", err);
                }
            });
        }
    }
};
Logger.prototype.newline = function () {
    console.log("");
};
Logger.prototype._object = function (obj) {
    console.log(JSON.stringify(obj, null, 4));
};
Logger.prototype.g = function () {
    this._log(arguments, "\x1b[32m", true);
};
Logger.prototype.r = function () {
    this._log(arguments, "\x1b[31m", true);
};
Logger.prototype.y = function () {
    this._log(arguments, "\x1b[33m", true);
};
Logger.prototype.gn = function () {
    this._log(arguments, "\x1b[32m");
};
Logger.prototype.rn = function () {
    this._log(arguments, "\x1b[31m");
};
Logger.prototype.yn = function () {
    this._log(arguments, "\x1b[33m");
};
Logger.prototype.debugn = function () {
    if (this.logLevel.debug) {
        this._log(arguments, "\x1b[34m[DEBUG]\x1b[0m ");
    }
};
Logger.prototype.stdn = function () {
    this._log(arguments, "\x1b[32m[STD]\x1b[0m ");
};
Logger.prototype.errn = function () {
    this._err(arguments, "\x1b[31m[ERR]\x1b[0m ");
};
Logger.prototype.wrnn = function () {
    this._err(arguments, "\x1b[33m[WRN]\x1b[0m ");
};
Logger.prototype.fataln = function () {
    this._err(arguments, "\x1b[31m[FATAL] ");
    process.exit(1);
};
Logger.prototype.sendn = function () {
    if (this.logLevel.send) {
        this._log(arguments, "\x1b[35m[SEND]\x1b[0m ");
    }
};
Logger.prototype.getn = function () {
    if (this.logLevel.get) {
        this._log(arguments, "\x1b[35m[GET]\x1b[0m ");
    }
};
Logger.prototype.msgn = function () {
    if (this.logLevel.msg) {
        this._log(arguments, "\x1b[36m[MSG]\x1b[0m ");
    }
};
Logger.prototype.debug = function () {
    if (this.logLevel.debug) {
        this._log(arguments, "\x1b[34m[DEBUG]\x1b[0m ", true);
    }
};
Logger.prototype.info = function () {
    if (this.logLevel.info) {
        this._log(arguments, "\x1b[34m[INFO]\x1b[0m ", true);
    }
};
Logger.prototype.std = function () {
    this._log(arguments, "\x1b[32m[STD]\x1b[0m ", true);
};
Logger.prototype.err = function () {
    this._err(arguments, "\x1b[31m[ERR]\x1b[0m ", true);
};
Logger.prototype.erro = function () {
    console.error(arguments[0]);
};
Logger.prototype.wrn = function () {
    this._err(arguments, "\x1b[33m[WRN]\x1b[0m ", true);
};
Logger.prototype.fatal = function () {
    this._err(arguments, "\x1b[31m[FATAL] ", true);
    process.exit(1);
};
Logger.prototype.send = function () {
    if (this.logLevel.send) {
        this._log(arguments, "\x1b[35m[SEND]\x1b[0m ", true);
    }
};
Logger.prototype.get = function () {
    if (this.logLevel.get) {
        this._log(arguments, "\x1b[35m[GET]\x1b[0m ", true);
    }
};
Logger.prototype.msg = function () {
    if (this.logLevel.msg) {
        this._log(arguments, "\x1b[36m[MSG]\x1b[0m ", true);
    }
};
Logger.prototype.write = function () {
    this._log(arguments, "", true);
};
Logger.prototype.writen = function () {
    this._log(arguments, "");
};
Logger.prototype.module = function () {
    if (this.logLevel.module) {
        var mod = arguments[0];
        arguments[0] = "";
        this._log(arguments, "\x1b[37m[MODULE - " + mod + "]\x1b[0m ", true);
    }
};
Logger.prototype.modulen = function () {
    if (this.logLevel.module) {
        var mod = arguments[0];
        arguments[0] = "";
        this._log(arguments, "\x1b[37m[MODULE - " + mod + "]\x1b[0m ");
    }
};
Logger.prototype.startup = function () {
    this._log(arguments, "\x1b[32m[STD]\x1b[34m[STARTUP]\x1b[0m ", true);
};
exports.Logger = Logger;
/* eslint-enable no-console */
