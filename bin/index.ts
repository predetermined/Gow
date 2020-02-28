#!/usr/bin/env node

import { Config, Gow } from "../lib/gow";
import * as fs from "fs";

function getStringFromOption(option: string): string {
    const everythingReplacedBeforeOption = process.argv.join(" ").replace(new RegExp(`(.*)(?=${option} )`), "").replace(/ -(.*)/, "");

    return everythingReplacedBeforeOption.startsWith(option)
        ? everythingReplacedBeforeOption.replace(new RegExp(`(.*)${option} `), "")
        : null;
}

function getArrayFromOption(option: string): string[] {
    const options = process.argv.join(" ")
        .match(new RegExp(`${option} ([a-zA-Z.-_\/* ]*)`, "g"))
        ?.map((charactersAfterOption: string): string => charactersAfterOption.replace(new RegExp(`(.*)${option} `), "").replace(/ -(.*)/, ""));
    return options;
}

function isCommandOptionSet(option: string): boolean {
    return process.argv.includes(option);
}

if (fs.existsSync(process.cwd() + "/gow.config.js")) {
    import(process.cwd() + "/gow.config.js").then((config: Config & { default? }): void => {
        if (config.default) {
            new Gow(process.cwd(), config.default);
            return;
        }

        new Gow(process.cwd(), config);
    });
}else {
    const commandLineConfig: Config = {
        command: getStringFromOption("-c") || getStringFromOption("--command"),
        files: getArrayFromOption("-f") || getArrayFromOption("--files"),
        silent: isCommandOptionSet("-s") || isCommandOptionSet("--silent"),
        delay: parseInt(getStringFromOption("-d") || getStringFromOption("--delay"))
    };

    new Gow(process.cwd(), commandLineConfig);
}
