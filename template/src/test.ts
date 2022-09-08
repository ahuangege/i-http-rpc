import * as path from "path";
import { createHttpRpcClient, createHttpRpcServer } from "i-http-rpc";
import { httpRpc_projectName } from "./httpRpc/httpRpc_projectName";

let server = createHttpRpcServer({ "port": 3000, "msgPath": path.join(__dirname, "./handler") })

let client = createHttpRpcClient<httpRpc_projectName>({ "url": "http://127.0.0.1:3000" });

async function test() {
    let res = await client.rpc().testFile.add(1, 2);
    console.log("client get res:", res)
}
test();
