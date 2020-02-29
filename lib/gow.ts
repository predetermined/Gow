import { Dirent, promises as fs } from "fs";
import { exec, ChildProcess } from "child_process";

export interface Config {
    command?: string;
    files?: string[];
    silent?: boolean;
    delay?: number;
}

interface File {
    name: string;
    path: string;
    modified: Date | string;
    lastModified: Date | string;
    [key: string]: any;
}

export class Gow {
    private readonly path: string;
    private readonly command: string;
    private readonly delay: number;
    private readonly runtimePath: string;
    private readonly silent: boolean;
    private ignoreRuntimeChanges: string[];
    private fileExpression: RegExp;
    private projectProcess: ChildProcess;
    private runtimeProcess: ChildProcess;
    private readyForNextReload: boolean = true;
    private reloadInQueue: boolean = false;
    private waitingForProcess: number;
    private cache: { project, runtime } = {
        project: { last: [], current: [] },
        runtime: { last: [], current: [] }
    };

    constructor(path: string, config?: Config) {
        this.delay = config.delay || 1000;
        this.command = config.command || "node .";
        this.silent = config.silent || false;
        this.fileExpression = config.files ? new RegExp(config.files.map((fileGlob: string) => this.getRegularExpressionByGlob(fileGlob)).join("|")) : new RegExp(this.getRegularExpressionByGlob("***/*.js"));
        this.path = this.normalizePath(path);
        this.runtimePath = this.path + ".gowing/";

        this.createRuntime(true);
    }

    createProcesses(): void {
        this.projectProcess = this.spawnCommandProcess(this.command, "PROJECT");

        process.chdir(this.runtimePath);
        this.runtimeProcess = this.spawnCommandProcess(this.command, "RUNTIME");
    }

    async createRuntime(firstRun: boolean = false): Promise<void> {
        if (firstRun) {
            await this.copyIntoRuntime();
            this.createProcesses();

            if (!this.silent) console.log("\x1b[97;42m Gow \x1b[0m Created process");
            
            setInterval(async () => {
                const modifiedRuntimeFiles: boolean | File[] = await this.getModifiedRuntimeFiles();
                const haveProjectFilesBeenModified: boolean = await this.haveProjectFilesBeenModified();

                if (modifiedRuntimeFiles) {
                    for (const modifiedRuntimeFile of (modifiedRuntimeFiles as File[])) {
                        await fs.copyFile(modifiedRuntimeFile.path, this.normalizePath(modifiedRuntimeFile.path).replace(this.runtimePath, this.path));
                        this.ignoreRuntimeChanges.push(modifiedRuntimeFile.name);
                    }

                    if (!this.silent) console.log("\x1b[97;42m Gow \x1b[0m Runtime files have been modified, copying them to the project root");
                }

                if (this.reloadInQueue && this.readyForNextReload) {
                    this.readyForNextReload = false;
                    this.reloadInQueue = false;
                    this.createProcesses();
                    if (!this.silent) console.log("\x1b[97;42m Gow \x1b[0m Reloaded");
                    return;
                }

                if (!haveProjectFilesBeenModified) return;
                if (!this.readyForNextReload) {
                    this.reloadInQueue = true;
                    return;
                }

                this.readyForNextReload = false;
                this.createProcesses();
                if (!this.silent) console.log("\x1b[97;42m Gow \x1b[0m Reloaded");
            }, 1000 / 5);
            return;
        }
    }

    normalizePath(path: string, tailingSlash: boolean = true) {
        const normalizedPath = path.replace(/(\/|\\)/, "/");

        return tailingSlash && !normalizedPath.endsWith("/") ? normalizedPath + "/" : normalizedPath;
    }

    getRegularExpressionByGlob(glob: string): string {
        return ((glob.includes("/") ? glob : "./" + glob) + "$")
            .replace(/\*/g, "ALL")
            .replace(/\//g, "SLASH")
            .replace(/\./g, "\.")
            .replace(/\[!/g, "[^")
            .replace(/ALLALLALL/g, "((.*)(?=\\/)(\\/)|)")
            .replace(/ALLALL/g, "(([a-zA-Z0-9-_]*)\\/|\.\/|)")
            .replace(/ALL/g, "([a-zA-Z0-9-_.]*)")
            .replace(/SLASH/g, "");
    }

    spawnCommandProcess(command: string, env: "PROJECT" | "RUNTIME" = "PROJECT"): any {
        switch (env) {
            case "PROJECT":
                this.projectProcess?.kill();
                break;
            case "RUNTIME":
                this.runtimeProcess?.kill();
                break;
        }

        const processID: number = Math.round(Math.random() * 1000);
        this.waitingForProcess = processID;

        setTimeout(() => {
            if (this.waitingForProcess === processID) this.readyForNextReload = true;
        }, this.delay);

        return exec(command, (error: Error, stdout: string, stderr: string) => {
            (stdout || stderr).length > 2 && console.log((stdout || stderr).replace(/\n$/g, ""));
        });
    }

    private async copyIntoRuntime() {
        try {
            await fs.readdir(this.runtimePath);
        }catch(e) {
            await fs.mkdir(this.runtimePath);
        }

        const files: File[] = await this.getFiles(this.path, { last: [], current: [] });
        
        for (const { path, normalizedPath = path.replace(/(\/|\\)/, "/"), relativePath = normalizedPath.replace(this.path, "") } of files) {
            const folders: string[] = relativePath.match(/([a-zA-Z0-9\/]*)(?=\/)/g);

            if (folders) {
                for (const folder of folders) {
                    try {
                        await fs.readdir(this.runtimePath + folder);
                    }catch(e) {
                        await fs.mkdir(this.runtimePath + folder);
                    }
                }
            }

            await fs.copyFile(relativePath, this.runtimePath + relativePath);
        }
    }

    private async getFiles(path: string = "./", cache: { last, current }): Promise<File[]> {
        const files: File[] = await Promise.all((await fs.readdir(path, { withFileTypes: true }))
            .filter((entry: Dirent): boolean => {
                return !entry.isDirectory()
                    && !entry.name.endsWith(".swp")
            })
            .map(async ({ name }: { name: string }): Promise<File> => {
                return {
                    name,
                    path: path + name,
                    modified: (await fs.stat(path + name)).mtime,
                    lastModified: cache.last.length === 0 ? "FIRST_RUN" : cache.last.find(file => file.path === path + name) && cache.last.find(file => file.path === path + name).modified
                }
            }));

        const folders: Dirent[] = (await fs.readdir(path, { withFileTypes: true })).filter((folder: Dirent): boolean => {
            return folder.isDirectory() 
                && !folder.name.startsWith(".")
                && folder.name !== "node_modules";
        });

        for (const folder of folders)
            files.push(...await this.getFiles(`${path}${folder.name}/`, cache));

        return files;
    }

    private async getModifiedRuntimeFiles(): Promise<boolean | File[]> {
        this.cache.runtime.last = this.cache.runtime.current;
        this.cache.runtime.current = await this.getFiles(this.runtimePath, this.cache.runtime);

        const changedFiles: File[] = this.cache.runtime.current.filter((file: File): boolean => {
            return (this.normalizePath(file.path, false).replace(this.runtimePath, "")).replace(this.fileExpression, "")  === ""
                && (file.lastModified && file.lastModified.toString()) !== file.modified.toString() 
                && file.lastModified !== "FIRST_RUN";
        });

        return changedFiles.length > 0 ? changedFiles : false;
    }

    private async haveProjectFilesBeenModified(): Promise<boolean> {
        this.cache.project.last = this.cache.project.current;
        this.cache.project.current = await this.getFiles(this.path, this.cache.project);

        const haveProjectFilesBeenModified: boolean = this.cache.project.current.filter((file: File): boolean => {
            return (this.normalizePath(file.path, false).replace(this.path, "")).replace(this.fileExpression, "")  === ""
                && (file.lastModified && file.lastModified.toString()) !== file.modified.toString() 
                && file.lastModified !== "FIRST_RUN"
                && !this.ignoreRuntimeChanges.includes(file.name);
        }).length > 0;

        this.ignoreRuntimeChanges = [];
        return haveProjectFilesBeenModified;
    }
}
