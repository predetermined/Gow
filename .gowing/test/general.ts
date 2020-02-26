import { GowProcess } from "../lib/GowProcess";
import ava, { ExecutionContext } from "ava";
import { promises as fs } from "fs";

const allowedStartTime = 1000;
const allowedTimeToReactToFileChanges = 1000;

ava("Does Gow create a process?", async (test: ExecutionContext) => {
    const process: GowProcess = new GowProcess();

    await new Promise((resolve: any): void => {
        setTimeout(() => {
            if (process.messages.includes("Created process")) {
                test.pass("Gow created a process successfully");
            }else {
                test.fail("Gow couldn't even create a process (within a second)");
            }
            resolve();
        }, allowedStartTime);
    });
});

ava("Is Gow reacting to a .txt file although Gow should react to .md files?", async (test: ExecutionContext) => {
    const process: GowProcess = new GowProcess();

    await new Promise((resolve: any): void => {
        setTimeout(async () => {
            await fs.writeFile("test.txt", "Just a sample file");

            await new Promise((resolve2: any): void => {
                setTimeout(async () => {
                    if (process.messages.includes("Reloaded")) {
                        test.pass("Gow ignored changes to the text.txt successfully");
                    } else {
                        test.fail("Gow reacted to changes in the text.txt although Gow should only react to .md files");
                    }
                    await fs.unlink("test.txt");
                    resolve2();
                    resolve();
                }, allowedTimeToReactToFileChanges);
            });
        }, allowedStartTime);
    });
});

ava("Is Gow reacting to .md files as it should?", async (test: ExecutionContext) => {
    const process: GowProcess = new GowProcess();

    await new Promise((resolve: any): void => {
        setTimeout(async () => {
            await fs.writeFile("test.md", "Just a sample file");

            await new Promise((resolve2: any): void => {
                setTimeout(async () => {
                    if (process.messages.includes("Reloaded")) {
                        test.pass("Gow reacted to the changes in the test.md successfully");
                    } else {
                        test.fail("Gow ignored changes to the test.md file");
                    }
                    await fs.unlink("test.md");
                    resolve2();
                    resolve();
                }, allowedTimeToReactToFileChanges);
            });
        }, allowedStartTime);
    });
});
