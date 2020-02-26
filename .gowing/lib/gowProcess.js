"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var GowProcess = /** @class */ (function () {
    function GowProcess() {
        var _this = this;
        this.p = {
            messages: ""
        };
        this.process = !/^win/.test(process.platform) ? child_process_1.spawn("gow -f **/*.md") : child_process_1.spawn("cmd", ["/s", "/c", "gow", "-f", "**/*.md"]);
        this.process.stdout.on("data", function (data) { return _this.p.messages += data.toString(); });
    }
    Object.defineProperty(GowProcess.prototype, "messages", {
        get: function () {
            return this.p.messages;
        },
        enumerable: true,
        configurable: true
    });
    return GowProcess;
}());
exports.GowProcess = GowProcess;
//# sourceMappingURL=gowProcess.js.map