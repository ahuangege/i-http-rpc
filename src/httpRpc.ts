import { HttpRpcClient, I_initOptionsClient } from "./httpRpcClient";
import { HttpRpcServer, I_initOptionsServer } from "./httpRpcServer";


export function createHttpRpcClient<T>(initOptions: I_initOptionsClient): { rpc(options?: any): T } {
    return initOptions.client ? new initOptions.client(initOptions) : new HttpRpcClient<T>(initOptions);
}

export function createHttpRpcServer(initOptions: I_initOptionsServer) {
    return initOptions.server ? new initOptions.server(initOptions) : new HttpRpcServer(initOptions);
}