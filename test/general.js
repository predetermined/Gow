"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var GowProcess_1 = require("../lib/GowProcess");
var ava_1 = require("ava");
var fs_1 = require("fs");
var allowedStartTime = 1000;
var allowedTimeToReactToFileChanges = 1000;
ava_1.default("Does Gow create a process?", function (test) { return __awaiter(void 0, void 0, void 0, function () {
    var process;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                process = new GowProcess_1.GowProcess();
                return [4 /*yield*/, new Promise(function (resolve) {
                        setTimeout(function () {
                            if (process.messages.includes("Created process")) {
                                test.pass("Gow created a process successfully");
                            }
                            else {
                                test.fail("Gow couldn't even create a process (within a second)");
                            }
                            resolve();
                        }, allowedStartTime);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
ava_1.default("Is Gow reacting to a .txt file although Gow should react to .md files?", function (test) { return __awaiter(void 0, void 0, void 0, function () {
    var process;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                process = new GowProcess_1.GowProcess();
                return [4 /*yield*/, new Promise(function (resolve) {
                        setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, fs_1.promises.writeFile("test.txt", "Just a sample file")];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, new Promise(function (resolve2) {
                                                setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0:
                                                                if (process.messages.includes("Reloaded")) {
                                                                    test.pass("Gow ignored changes to the text.txt successfully");
                                                                }
                                                                else {
                                                                    test.fail("Gow reacted to changes in the text.txt although Gow should only react to .md files");
                                                                }
                                                                return [4 /*yield*/, fs_1.promises.unlink("test.txt")];
                                                            case 1:
                                                                _a.sent();
                                                                resolve2();
                                                                resolve();
                                                                return [2 /*return*/];
                                                        }
                                                    });
                                                }); }, allowedTimeToReactToFileChanges);
                                            })];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, allowedStartTime);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
ava_1.default("Is Gow reacting to .md files as it should?", function (test) { return __awaiter(void 0, void 0, void 0, function () {
    var process;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                process = new GowProcess_1.GowProcess();
                return [4 /*yield*/, new Promise(function (resolve) {
                        setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, fs_1.promises.writeFile("test.md", "Just a sample file")];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, new Promise(function (resolve2) {
                                                setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0:
                                                                if (process.messages.includes("Reloaded")) {
                                                                    test.pass("Gow reacted to the changes in the test.md successfully");
                                                                }
                                                                else {
                                                                    test.fail("Gow ignored changes to the test.md file");
                                                                }
                                                                return [4 /*yield*/, fs_1.promises.unlink("test.md")];
                                                            case 1:
                                                                _a.sent();
                                                                resolve2();
                                                                resolve();
                                                                return [2 /*return*/];
                                                        }
                                                    });
                                                }); }, allowedTimeToReactToFileChanges);
                                            })];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, allowedStartTime);
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=general.js.map