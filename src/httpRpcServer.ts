import * as http from "http";
import * as https from "https";

let errList = {
    noHandler: JSON.stringify({ "err": "no msg handler" }),
    needPost: JSON.stringify({ "err": "need Post" }),
    needJson: JSON.stringify({ "err": "need Json" }),
}

export class HttpRpcServer<T> {

    private handlers: { [file: string]: { [method: string]: Function } } = {};

    constructor(initOptions: I_initOptionsServer<T>) {
        this.start(initOptions);
    }

    private start(initOptions: I_initOptionsServer<T>) {

        this.handlers = initOptions.handlers as any;

        let isHttps = !!initOptions.ssl;
        let httpCon = isHttps ? https : http;
        let server = (httpCon as typeof http).createServer({}, (request: http.IncomingMessage, response: http.ServerResponse) => {

            response.setHeader("Access-Control-Allow-Origin", "*");
            response.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
            response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            if (initOptions.headers) {
                for (let x in initOptions.headers) {
                    response.setHeader(x, initOptions.headers[x]);
                }
            }

            if (request.url === "/favicon.ico") {
                return response.end();
            }
            if (request.method !== "POST") {
                return response.end(errList.needPost);
            }

            let msg = "";
            request.on("data", (chuck) => {
                msg += chuck;
            });
            request.on("end", async () => {
                let msgObj: { "file": string, "method": string, "args": any[] };
                try {
                    msgObj = JSON.parse(msg);
                } catch (e) {
                    return response.end(errList.needJson);
                }
                let file = this.handlers[msgObj.file];
                if (!file || !file[msgObj.method]) {
                    return response.end(errList.noHandler);
                }
                let data = await file[msgObj.method](...msgObj.args);
                if (data === undefined) {
                    data = null;
                }
                response.end(JSON.stringify({ "data": data }));
            });

        });

        server.listen(initOptions.port, () => {
            if (isHttps) {
                console.log("https listening at", initOptions.port);
            } else {
                console.log("http listening at", initOptions.port);
            }
        });
        server.on("error", (err: Error) => {
            console.log(err);
        });
    }
}


export interface I_initOptionsServer<T> {
    port: number,
    handlers: T,
    ssl?: { "key": any, "cert": any },
    headers?: { [key: string]: any },
    server?: any,   // 自定义 rpc server
    [key: string]: any,
}
