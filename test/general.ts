import { ChildProcess, spawn } from "child_process";
import ava, { ExecutionContext } from "ava";

ava("Does Gow create a process?", async (test: ExecutionContext) => {
    let messages: string = "";
    const gowProcess: ChildProcess = !/^win/.test(process.platform) ? spawn("gow") : spawn("cmd", ["/s", "/c", "gow"]);
    gowProcess.stdout.on("data", (data: string) => messages += data.toString());

    await new Promise((resolve: any): void => {
        setTimeout(() => {
            if (messages.includes("Created process")) {
                test.pass("Gow created a process successfully");
            }else {
                test.fail("Gow couldn't even create a process (within a second)");
            }
            resolve();
        }, 1000);
    });
});
