# zl-ftp用法
> yarn add zl-ftp


### node集成

```
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