#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

// 是否是一个目录
const isDirctory = (path) => fs.statSync(path).isDirectory();

// let config = require(path.resolve(process.cwd(), "./ftp.config.js"));

function ftp(config, callback) {
  try {
    if (isValidate(config)) {
      upload(config);
      callback()
    }
  } catch (e) {
    console.error(e);
    callback(e)
  }
}

/**
 * 验证配置是否正确
 */
function isValidate(config) {
  if (!isDirctory(config.from)) {
    throw new Error("上传的不是一个目录!");
    return false;
  }
  return true;
}

/**
 * 上传文件夹到ftp服务器
 */
function upload(config) {
  let { server, username, password, from, to } = config;
  let queue = [
    {
      local: path.resolve(process.cwd(), from),
      remote: to,
    },
  ];

  while (queue.length) {
    let dir = queue.shift();
    let files = [];

    mkdirOnRemote(server, username, password, dir.remote);
    fs.readdirSync(dir.local).forEach((file) => {
      let filePath = {
        local: path.resolve(dir.local, file),
        remote: path.resolve(dir.remote, file),
      };

      isDirctory(filePath.local) ? queue.push(filePath) : files.push(file);
    });
    putFilesOnRemote(server, username, password, dir, files);
  }
}

// 在远程ftp服务器上新建文件夹
function mkdirOnRemote(server, username, password, dir) {
  let shellScript = `
      ftp -in ${server} << EndOfSession
      user ${username} ${password}
      binary
      mkdir ${dir}
      bye
      EndOfSession
      `;

  child_process.execSync(shellScript);
  console.log(`成功创建目录：${dir}`);
}

// 上传多个文件到远程ftp服务器
function putFilesOnRemote(server, username, password, dir, files) {
  let shellScript = `
      ftp -in ${server} << EndOfSession
      user ${username} ${password}
      binary
      lcd ${dir.local}
      cd ${dir.remote}
      mput ${files.join(" ")}
      bye
      EndOfSession
      `;

  if (files.length) {
    child_process.execSync(shellScript);
    files.forEach((file) =>
      console.log(`成功上传文件：${path.resolve(dir.remote, file)}`)
    );
  }
}

module.exports =  ftp;