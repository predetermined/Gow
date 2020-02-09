import { ChildProcess, spawn } from "child_process";

export class GowProcess {
    private process: ChildProcess;
    private p: { messages } = {
        messages: ""
    };

    constructor() {
        this.process = !/^win/.test(process.platform) ? spawn("gow -f **/*.md") : spawn("cmd", ["/s", "/c", "gow", "-f", "**/*.md"]);
        this.process.stdout.on("data", (data: string) => this.p.messages += data.toString());
    }

    public get messages() {
        return this.p.messages;
    }
}
