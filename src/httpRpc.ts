import { HttpRpcClient, I_initOptionsClient } from "./httpRpcClient";
import { HttpRpcServer, I_initOptionsServer } from "./httpRpcServer";

export interface I_httpRpcClient<T> {
    rpc(options?: any): T
}

export function createHttpRpcClient(initOptions: I_initOptionsClient) {
    return initOptions.client ? new initOptions.client(initOptions) : new HttpRpcClient(initOptions);
}

export function createHttpRpcServer<T>(initOptions: I_initOptionsServer<T>) {
    return initOptions.server ? new initOptions.server(initOptions) : new HttpRpcServer<T>(initOptions);
}