"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHttpRpcServer = exports.createHttpRpcClient = void 0;
const httpRpcClient_1 = require("./httpRpcClient");
const httpRpcServer_1 = require("./httpRpcServer");
function createHttpRpcClient(initOptions) {
    return initOptions.client ? new initOptions.client(initOptions) : new httpRpcClient_1.HttpRpcClient(initOptions);
}
exports.createHttpRpcClient = createHttpRpcClient;
function createHttpRpcServer(initOptions) {
    return initOptions.server ? new initOptions.server(initOptions) : new httpRpcServer_1.HttpRpcServer(initOptions);
}
exports.createHttpRpcServer = createHttpRpcServer;
