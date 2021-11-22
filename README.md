# ax-ftp用法

在package.json的同级目录下创建`ftp.config.js`文件导出ftp服务器配置，例

```js
module.exports = {
  "server": "", //服务器地址
  "username": "", //文件名
  "password": "", //密码
  "from": "./dist", // 可以是绝对路径，也可以是相对路径
  "to": "" // 上传的路径地址
}
```


### 配置上传
```
{
  ...
  "scripts": {
    "build:ftp": "zl-ftp"
  },
  ...
}
```
### node集成

```
const {exec} = require('child_process');
const ftp = require('zl-ftp')
const path = require("path");
ftp({
  "server": "", //服务器地址
  "username": "", //用户名
  "password": "", //密码
  "from": `${path.resolve(process.cwd(), "./dist")}`, // 上传路劲
  "to": "./dist" // 上传的路径地址
}, () => {
  //callback
})
```