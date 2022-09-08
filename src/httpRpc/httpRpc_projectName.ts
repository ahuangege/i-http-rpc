/**
 * version: 1.0.0
 * 这是测试项目的声明文件
 */

/** 项目名 */
export interface httpRpc_projectName {
    /** 测试文件名 */
    testFile: httpRpc_projectName.files.testFile

}

/** 项目名 */
export namespace httpRpc_projectName {
    /** 文件列表 */
    export namespace files {
        export interface testFile {
            /** 加法 */
            add: (num1: number, num2: number) => Promise<number>;
        }
    }

    // 以下是部分接口定义
    interface mail {
        id: number,
        uid: number
    }

}