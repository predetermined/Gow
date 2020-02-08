import { spawn } from "child_process";
import ava from "ava";

ava("Does Gow create a process?", async test => {
    let messages = "";
    const gowProcess = !/^win/.test(process.platform) ? spawn("gow") : spawn("cmd", ["/s", "/c", "gow"]);
    gowProcess.stdout.on("data", data => messages += data.toString());

    await new Promise(resolve => {
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
