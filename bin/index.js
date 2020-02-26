#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gow_1 = require("../lib/gow");
var fs = require("fs");
function getCommandLineOption(option) {
    var everythingReplacedBeforeOption = process.argv.join(" ").replace(new RegExp("(.*)(?=" + option + " )"), "").replace(/ -(.*)/, "");
    return everythingReplacedBeforeOption.startsWith(option)
        ? everythingReplacedBeforeOption.replace(new RegExp("(.*)" + option + " "), "")
        : null;
}
function getArrayFromCommandOption(option) {
    var everythingReplacedBeforeOption = process.argv.join(" ").replace(new RegExp("(.*)(?=" + option + " )"), "").replace(/ -(.*)/, "");
    var commaSeparatedString = everythingReplacedBeforeOption.startsWith(option)
        ? everythingReplacedBeforeOption.replace(new RegExp("(.*)" + option + " "), "")
        : null;
    return (commaSeparatedString === null || commaSeparatedString === void 0 ? void 0 : commaSeparatedString.replace(", ", ",").split(",")) || null;
}
function isCommandOptionSet(option) {
    return process.argv.includes(option);
}
if (fs.existsSync(process.cwd() + "/gow.config.js") && fs.existsSync(process.cwd() + "/package.json")) {
    Promise.resolve().then(function () { return require(process.cwd() + "/gow.config.js"); }).then(function (config) {
        if (config.default) {
            new gow_1.Gow(process.cwd(), config.default);
            return;
        }
        new gow_1.Gow(process.cwd(), config);
    });
}
else {
    var commandLineConfig = {
        command: getCommandLineOption("-c") || getCommandLineOption("--command"),
        files: getCommandLineOption("-f") || getCommandLineOption("--files"),
        excludes: getArrayFromCommandOption("-e") || getArrayFromCommandOption("--excludes"),
        silent: isCommandOptionSet("-s") || isCommandOptionSet("--silent"),
        delay: parseInt(getCommandLineOption("-d") || getCommandLineOption("--delay"))
    };
    new gow_1.Gow(process.cwd(), commandLineConfig);
}
//# sourceMappingURL=index.js.map