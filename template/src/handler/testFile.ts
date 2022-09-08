import { httpRpc_projectName } from "../httpRpc/httpRpc_projectName";

export default class implements httpRpc_projectName.files.testFile {
    async add(num1: number, num2: number) {
        console.log("add", num1, num2)
        return num1 + num2;
    }
}