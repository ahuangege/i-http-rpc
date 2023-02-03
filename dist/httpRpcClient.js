"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpRpcClient = void 0;
const http = __importStar(require("http"));
const https = __importStar(require("https"));
class HttpRpcClient {
    constructor(initOptions) {
        this.rpcObj = null;
        this.initOptions = {};
        this.options = null;
        this.httpRequest = null;
        this.initOptions = initOptions;
        this.httpRequest = initOptions.httpRequest || defaultHttpRequest;
        let self = this;
        this.rpcObj = new Proxy({}, {
            get(_fileDic, file) {
                let methodDic = _fileDic[file];
                if (!methodDic) {
                    methodDic = new Proxy({}, {
                        get(_methodDic, method) {
                            let func = _methodDic[method];
                            if (!func) {
                                func = self.rpcFuncAwaitProxy([file, method]);
                                _methodDic[method] = func;
                            }
                            return func;
                        }
                    });
                    _fileDic[file] = methodDic;
                }
                return methodDic;
            }
        });
    }
    rpcFuncAwaitProxy(cmds) {
        let self = this;
        let func = function (...args) {
            return self.httpRequest(self.initOptions, self.options, cmds, args);
        };
        return func;
    }
    rpc(options) {
        this.options = options;
        return this.rpcObj;
    }
}
exports.HttpRpcClient = HttpRpcClient;
/** 默认的 http 发送函数 */
function defaultHttpRequest(initOptions, options, cmds, args) {
    return new Promise((resolve, reject) => {
        let request = (initOptions.url.startsWith("https") ? https : http).request(initOptions.url, { "method": "POST" }, (res) => {
            let msg = "";
            res.on("data", (chunk) => {
                msg += chunk;
            });
            res.on('end', () => {
                let msgObj;
                try {
                    msgObj = JSON.parse(msg);
                }
                catch (e) {
                    return reject(e);
                }
                if (msgObj.err) {
                    return reject(new Error(msgObj.err));
                }
                resolve(msgObj.data);
            });
        });
        if (initOptions.headers) {
            for (let x in initOptions.headers) {
                request.setHeader(x, initOptions.headers[x]);
            }
        }
        if (initOptions.timeout) {
            request.setTimeout(initOptions.timeout);
        }
        request.on('error', (e) => {
            reject(e);
        });
        request.on("timeout", () => {
            request.destroy(new Error("timeout"));
        });
        let data = {
            "file": cmds[0],
            "method": cmds[1],
            "args": args
        };
        request.write(JSON.stringify(data));
        request.end();
    });
}
