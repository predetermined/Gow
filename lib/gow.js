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
var fs_1 = require("fs");
var child_process_1 = require("child_process");
var Gow = /** @class */ (function () {
    function Gow(path, config, normalizedPath) {
        var _this = this;
        if (normalizedPath === void 0) { normalizedPath = path.replace(/(\/|\\)/, "/"); }
        this.readyForNextReload = true;
        this.reloadInQueue = false;
        this.cache = {
            last: [],
            current: []
        };
        this.excludes = config.excludes || ["node_modules"];
        this.delay = config.delay || 1000;
        this.fileExpression = this.getRegularExpressionByGlob(config.files || "***/*");
        this.commandProcess = this.spawnCommandProcess(config.command || "node .");
        this.path = normalizedPath.endsWith("/") ? normalizedPath : normalizedPath + "/";
        this.runtimePath = this.path + ".gowing/";
        console.log(process.cwd() + "/");
        this.copyIntoRuntime();
        child_process_1.execSync("cd .gowing");
        if (!config.silent)
            console.log("\x1b[97;42m Gow \x1b[0m Created process");
        setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.reloadInQueue && this.readyForNextReload) {
                            this.readyForNextReload = false;
                            this.reloadInQueue = false;
                            this.commandProcess = this.spawnCommandProcess(config.command || "node .");
                            if (!config.silent)
                                console.log("\x1b[97;42m Gow \x1b[0m Reloaded");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.haveFilesBeenModified()];
                    case 1:
                        if (!(_a.sent()))
                            return [2 /*return*/];
                        if (!this.readyForNextReload) {
                            this.reloadInQueue = true;
                            return [2 /*return*/];
                        }
                        this.readyForNextReload = false;
                        this.commandProcess = this.spawnCommandProcess(config.command || "node .");
                        if (!config.silent)
                            console.log("\x1b[97;42m Gow \x1b[0m Reloaded");
                        return [2 /*return*/];
                }
            });
        }); }, 1000 / 5);
    }
    Gow.prototype.getRegularExpressionByGlob = function (glob) {
        return new RegExp(((glob.includes("/") ? glob : "./" + glob) + "$")
            .replace(/\*/g, "ALL")
            .replace(/\//g, "SLASH")
            .replace(/\./g, "\.")
            .replace(/ALLALLALL/g, "((.*)(?=\\/)(\\/)|)")
            .replace(/ALLALL/g, "(([a-zA-Z0-9-_]*)\\/|\.\/|)")
            .replace(/ALL/g, "([a-zA-Z0-9-_.]*)")
            .replace(/SLASH/g, ""));
    };
    Gow.prototype.spawnCommandProcess = function (command) {
        var _this = this;
        var _a;
        if ((_a = this.commandProcess) === null || _a === void 0 ? void 0 : _a.kill)
            this.commandProcess.kill();
        var processID = Math.round(Math.random() * 1000);
        this.waitingForProcess = processID;
        setTimeout(function () {
            if (_this.waitingForProcess === processID)
                _this.readyForNextReload = true;
        }, this.delay);
        return child_process_1.exec(command, function (error, stdout, stderr) {
            (stdout || stderr).length > 2 && console.log((stdout || stderr).replace(/\n$/g, ""));
        });
    };
    Gow.prototype.copyIntoRuntime = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1, files, _i, files_1, _a, path, _b, normalizedPath, _c, relativePath, folders, _d, folders_1, folder, e_2;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, fs_1.promises.readdir(this.runtimePath)];
                    case 1:
                        _e.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        e_1 = _e.sent();
                        return [4 /*yield*/, fs_1.promises.mkdir(this.runtimePath)];
                    case 3:
                        _e.sent();
                        return [3 /*break*/, 4];
                    case 4: return [4 /*yield*/, this.getFiles(this.path)];
                    case 5:
                        files = _e.sent();
                        _i = 0, files_1 = files;
                        _e.label = 6;
                    case 6:
                        if (!(_i < files_1.length)) return [3 /*break*/, 16];
                        _a = files_1[_i], path = _a.path, _b = _a.normalizedPath, normalizedPath = _b === void 0 ? path.replace(/(\/|\\)/, "/") : _b, _c = _a.relativePath, relativePath = _c === void 0 ? normalizedPath.replace(this.path, "") : _c;
                        folders = relativePath.match(/([a-zA-Z0-9]*)(?=\/)/g);
                        if (!folders) return [3 /*break*/, 13];
                        _d = 0, folders_1 = folders;
                        _e.label = 7;
                    case 7:
                        if (!(_d < folders_1.length)) return [3 /*break*/, 13];
                        folder = folders_1[_d];
                        _e.label = 8;
                    case 8:
                        _e.trys.push([8, 10, , 12]);
                        return [4 /*yield*/, fs_1.promises.readdir(this.runtimePath + folder)];
                    case 9:
                        _e.sent();
                        return [3 /*break*/, 12];
                    case 10:
                        e_2 = _e.sent();
                        return [4 /*yield*/, fs_1.promises.mkdir(this.runtimePath + folder)];
                    case 11:
                        _e.sent();
                        return [3 /*break*/, 12];
                    case 12:
                        _d++;
                        return [3 /*break*/, 7];
                    case 13: return [4 /*yield*/, fs_1.promises.copyFile(relativePath, this.runtimePath + relativePath)];
                    case 14:
                        _e.sent();
                        _e.label = 15;
                    case 15:
                        _i++;
                        return [3 /*break*/, 6];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    Gow.prototype.getFiles = function (path) {
        if (path === void 0) { path = "./"; }
        return __awaiter(this, void 0, void 0, function () {
            var files, _a, _b, folders, _i, folders_2, folder, _c, _d, _e;
            var _this = this;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _b = (_a = Promise).all;
                        return [4 /*yield*/, fs_1.promises.readdir(path, { withFileTypes: true })];
                    case 1: return [4 /*yield*/, _b.apply(_a, [(_f.sent())
                                .filter(function (entry) {
                                return !entry.isDirectory()
                                    && !entry.name.endsWith(".swp")
                                    && (path + entry.name).replace(_this.fileExpression, "") === ""
                                    && !_this.excludes.includes(entry.name);
                            })
                                .map(function (_a) {
                                var name = _a.name;
                                return __awaiter(_this, void 0, void 0, function () {
                                    var _b;
                                    return __generator(this, function (_c) {
                                        switch (_c.label) {
                                            case 0:
                                                _b = {
                                                    name: name,
                                                    path: path + name
                                                };
                                                return [4 /*yield*/, fs_1.promises.stat(path + name)];
                                            case 1: return [2 /*return*/, (_b.modified = (_c.sent()).mtime,
                                                    _b.lastModified = this.cache.last.length === 0 ? "FIRST_RUN" : this.cache.last.find(function (file) { return file.path === path + name; }) && this.cache.last.find(function (file) { return file.path === path + name; }).modified,
                                                    _b)];
                                        }
                                    });
                                });
                            })])];
                    case 2:
                        files = _f.sent();
                        return [4 /*yield*/, fs_1.promises.readdir(path, { withFileTypes: true })];
                    case 3:
                        folders = (_f.sent()).filter(function (folder) { return folder.isDirectory() && !_this.excludes.includes(folder.name) && !folder.name.startsWith("."); });
                        _i = 0, folders_2 = folders;
                        _f.label = 4;
                    case 4:
                        if (!(_i < folders_2.length)) return [3 /*break*/, 7];
                        folder = folders_2[_i];
                        _d = (_c = files.push).apply;
                        _e = [files];
                        return [4 /*yield*/, this.getFiles("" + path + folder.name + "/")];
                    case 5:
                        _d.apply(_c, _e.concat([_f.sent()]));
                        _f.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/, files];
                }
            });
        });
    };
    Gow.prototype.haveFilesBeenModified = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.cache.last = this.cache.current;
                        _a = this.cache;
                        return [4 /*yield*/, this.getFiles()];
                    case 1:
                        _a.current = _b.sent();
                        return [2 /*return*/, this.cache.current.filter(function (file) { return (file.lastModified && file.lastModified.toString()) !== file.modified.toString() && file.lastModified !== "FIRST_RUN"; }).length > 0];
                }
            });
        });
    };
    return Gow;
}());
exports.Gow = Gow;
//# sourceMappingURL=gow.js.map