import * as http from "http";
import * as https from "https";

export class HttpRpcClient<T> {

    private rpcObj: T = null as any;
    private initOptions: any = {};
    private options: any = null;
    private httpRequest: I_httpRequest = null as any;

    constructor(initOptions: I_initOptionsClient) {
        this.initOptions = initOptions;
        this.httpRequest = initOptions.httpRequest || defaultHttpRequest;

        let self = this;
        this.rpcObj = new Proxy({}, {
            get(_fileDic: any, file: string) {
                let methodDic = _fileDic[file];
                if (!methodDic) {
                    methodDic = new Proxy({}, {
                        get(_methodDic: any, method: string) {
                            let func = _methodDic[method];
                            if (!func) {
                                func = self.rpcFuncAwaitProxy([file, method]);
                                _methodDic[method] = func;
                            }
                            return func;
                        }
                    });
                    _fileDic[file] = methodDic
                }
                return methodDic;
            }
        });

    }

    private rpcFuncAwaitProxy(cmds: string[]) {
        let self = this;
        let func = function (...args: any[]): Promise<any> {
            return self.httpRequest(self.initOptions, self.options, cmds, args);
        }
        return func;
    }

    rpc(options?: any) {
        this.options = options;
        return this.rpcObj;
    }
}

interface I_httpRequest {
    (initOptions: I_initOptionsClient, options: any, cmds: string[], args: any[]): Promise<any>
}

export interface I_initOptionsClient {
    url: string,
    timeout?: number,
    headers?: { [key: string]: any }
    httpRequest?: I_httpRequest,    // 自定义 http 发送函数
    client?: any,   // 自定义 rpc client
    [key: string]: any,
}


/** 默认的 http 发送函数 */
function defaultHttpRequest(initOptions: I_initOptionsClient, options: any, cmds: string[], args: any[]): Promise<any> {
    return new Promise((resolve) => {
        let request = (initOptions.url.startsWith("https") ? https : http).request(initOptions.url, { "method": "POST" }, (res) => {

            let msg = "";
            res.on("data", (chunk) => {
                msg += chunk;
            });
            res.on('end', () => {
                let msgObj: { "err": string, "data": any };
                try {
                    msgObj = JSON.parse(msg);
                } catch (e) {
                    return resolve(e);
                }
                if (msgObj.err) {
                    return resolve(new Error(msgObj.err));
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
            resolve(e);
        });
        request.on("timeout", () => {
            request.destroy(new Error("timeout"));
        });

        let data = {
            "file": cmds[0],
            "method": cmds[1],
            "args": args
        }
        request.write(JSON.stringify(data));
        request.end();
    });
}
