#!/usr/bin/env node

import { Config, Gow } from "../lib/gow";
import * as fs from "fs";

function getCommandLineOption(option) {
    const everythingReplacedBeforeOption = process.argv.join(" ").replace(new RegExp(`(.*)(?=${option} )`), "").replace(/ -(.*)/, "");

    return everythingReplacedBeforeOption.startsWith(option)
        ? everythingReplacedBeforeOption.replace(new RegExp(`(.*)${option} `), "")
        : null;
}

function getArrayFromCommandOption(option) {
    const everythingReplacedBeforeOption = process.argv.join(" ").replace(new RegExp(`(.*)(?=${option} )`), "").replace(/ -(.*)/, "");
    const commaSeparatedString = everythingReplacedBeforeOption.startsWith(option)
        ? everythingReplacedBeforeOption.replace(new RegExp(`(.*)${option} `), "")
        : null;
    return commaSeparatedString?.replace(", ", ",").split(",") || null;
}

function isCommandOptionSet(option) {
    return process.argv.includes(option);
}

if (fs.existsSync(process.cwd() + "/gow.config.js") && fs.existsSync(process.cwd() + "/package.json")) {
    import(process.cwd() + "/gow.config.js").then(config => {
        if (config.default) {
            new Gow(process.cwd(), config.default);
            return;
        }

        new Gow(process.cwd(), config);
    });
}else {
    const commandLineConfig: Config = {
        command: getCommandLineOption("-c") || getCommandLineOption("--command"),
        files: getCommandLineOption("-f") || getCommandLineOption("--files"),
        excludes: getArrayFromCommandOption("-e") || getArrayFromCommandOption("--excludes"),
        silent: isCommandOptionSet("-s") || isCommandOptionSet("--silent"),
        delay: parseInt(getCommandLineOption("-d") || getCommandLineOption("--delay"))
    };

    new Gow(process.cwd(), commandLineConfig);
}
