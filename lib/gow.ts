import { Dirent, promises as fs } from "fs";
import { exec } from "child_process";

export interface Config {
    command?: string;
    files?: string;
    silent?: boolean;
    delay?: number;
}

interface File {
    name: string;
    path: string;
    modified: Date;
    lastModified: Date;
}

export class Gow {
    private readonly delay: number;
    private fileExpression: RegExp;
    private commandProcess: any;
    private readyForNextReload: boolean = true;
    private reloadInQueue: boolean = false;
    private waitingForProcess: number;
    private cache: { last, current } = {
        last: [],
        current: []
    };

    constructor(config: Config) {
        this.delay = config.delay || 1000;
        this.fileExpression = this.getRegularExpressionByGlob(config.files || "***/*");
        this.commandProcess = this.spawnCommandProcess(config.command || "node .");

        if (!config.silent) console.log("\x1b[97;42m Gow \x1b[0m Created process");

        setInterval(async () => {
            if (this.reloadInQueue && this.readyForNextReload) {
                this.readyForNextReload = false;
                this.reloadInQueue = false;
                this.commandProcess = this.spawnCommandProcess(config.command || "node .");
                if (!config.silent) console.log("\x1b[97;42m Gow \x1b[0m Reloaded");
                return;
            }

            if (!await this.haveFilesBeenModified()) return;
            if (!this.readyForNextReload) {
                this.reloadInQueue = true;
                return;
            }

            this.readyForNextReload = false;
            this.commandProcess = this.spawnCommandProcess(config.command || "node .");
            if (!config.silent) console.log("\x1b[97;42m Gow \x1b[0m Reloaded");
        }, 1000 / 5);
    }

    getRegularExpressionByGlob(glob: string): RegExp {
        return new RegExp((glob + "$")
            .replace(/\*/g, "ALL")
            .replace(/\//g, "SLASH")
            .replace(/\./g, "\.")
            .replace(/ALLALLALL/g, "((.*)(?=\\/)(\\/)|)")
            .replace(/ALLALL/g, "(([a-zA-Z0-9-_]*)\\/|\.\/|)")
            .replace(/ALL/g, "([a-zA-Z0-9-_.]*)")
            .replace(/SLASH/g, ""));
    }

    spawnCommandProcess(command): any {
        if (this.commandProcess?.kill) this.commandProcess.kill();

        const processID = Math.round(Math.random() * 1000);
        this.waitingForProcess = processID;

        setTimeout(() => {
            if (this.waitingForProcess === processID) this.readyForNextReload = true;
        }, this.delay);

        return exec(command, (error: Error, stdout: string, stderr: string) => {
            (stdout || stderr).length > 2 && console.log((stdout || stderr).replace(/\n$/g, ""));
        });
    }

    private async getFiles(path: string = "./"): Promise<File[]> {
        const files = await Promise.all((await fs.readdir(path, { withFileTypes: true }))
            .filter((entry: Dirent): boolean => {
                return !entry.isDirectory()
                    && !entry.name.endsWith(".swp")
                    && (path + entry.name).replace(this.fileExpression, "") === ""
            })
            .map(async ({ name }): Promise<File> => {
                return {
                    name,
                    path: path + name,
                    modified: (await fs.stat(path + name)).mtime,
                    lastModified: this.cache.last.length === 0 ? "FIRST_RUN" : this.cache.last.find(file => file.path === path + name) && this.cache.last.find(file => file.path === path + name).modified
                }
            }));

        const folders = (await fs.readdir(path, { withFileTypes: true })).filter((folder: Dirent) => folder.isDirectory());

        for (const folder of folders)
            files.push(...await this.getFiles(`${path}${folder.name}/`));

        return files;
    }

    private async haveFilesBeenModified(): Promise<boolean> {
        this.cache.last = this.cache.current;
        this.cache.current = await this.getFiles();

        return this.cache.current.filter(file => (file.lastModified && file.lastModified.toString()) !== file.modified.toString() && file.lastModified !== "FIRST_RUN").length > 0;
    }
}
