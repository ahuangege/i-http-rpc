# i-http-rpc
一个方便不同项目合作的带智能提示的 http rpc 约定

# Install

```bash
npm i i-http-rpc
```

# Usage

源文件 `template` 文件夹中有使用示例。  
默认使用约定为：服务器的消息处理为 `文件名-方法名`的形式，  
智能提示文件`httpRpc_projectName.ts`由接口提供者，即`server`方编写，里面就是服务器的所有接口文档。   
客户端调用`let res = await client.rpc().testFile.add(1, 2)`，服务器将会在`testFile.ts`文件中的`add`方法处收到并处理。  
当项目间需要调用接口时，只需要把接口提示文件发给他，便可以方便的进行调用了。   
框架提供了自定义的功能，开发者可以按需修改。  