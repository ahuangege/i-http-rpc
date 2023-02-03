# i-http-rpc
一个带智能提示的 http rpc

# Install

```bash
npm i i-http-rpc
```

# Usage

```
import { createHttpRpcClient, createHttpRpcServer, I_httpRpcClient } from "i-http-rpc";
let port = 3000;
class MyMath {
    add(a: number, b: number) {
        return a + b;
    }
}

interface RpcDemo {
    math: MyMath
}

createHttpRpcServer<RpcDemo>({
    "port": port,
    "handlers": {
        "math": new MyMath()
    }
});

let client: I_httpRpcClient<RpcDemo> = createHttpRpcClient({ "url": `http:127.0.0.1:${port}` });
async function test() {
    let res = await client.rpc().math.add(1, 2);
    console.log(res)
}
test();

```