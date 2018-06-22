/*
  构建前执行的脚本
  一、CDN每次构建前生成新的唯一文件目录,修改index.html中的CDN引用，修改.roadhogrc配置中的引用，修改ossTool上传工具中的引用
  二、若有修改package.json中的version， 同步到设置首页底部的版本显示
*/
const fs = require('fs')
const path = require('path')

function getCompleteStr (str, len) {
  return (`0000000000${str}`).slice(-len)
}
const d = new Date()
const milliseconds = getCompleteStr(d.getMilliseconds(), 3)
// 唯一的cdn目录
const dir = `${getCompleteStr(d.getFullYear(), 4)}${getCompleteStr(d.getMonth() + 1, 2)}${getCompleteStr(d.getDate(), 2)}${getCompleteStr(d.getHours(), 2)}${getCompleteStr(d.getMinutes(), 2)}${getCompleteStr(d.getSeconds(), 2)}`

/* 1. 修改public/index.html */
//   <script src="//cdn.xiaoduoai.com/cvd/mock/201706231000/dist/index.js?10"></script>
const reg1 = /(<!--\s?)?(<script src="\/\/cdn.xiaoduoai.com\/cvd\/mock\/)(\d+)(\/.*\?)(\d+)("><\/script>)(\s?-->)?/
const reg2 = /(<!--\s?)?(<link rel="stylesheet" href="\/\/cdn.xiaoduoai.com\/cvd\/mock\/)(\d+)(\/dist\/index.css\?)(\d+)(" \/>)(\s?-->)?/
//   <link rel="stylesheet" href="//cdn.xiaoduoai.com/cvd/mock/201706231000/dist/index.css?10" />
const indexHtmlPath = './public/index.html'
let indexHtmlStr = fs.readFileSync(indexHtmlPath, { encoding: 'utf8' })
indexHtmlStr = indexHtmlStr.replace(reg1, ($0, $1, $2, $3, $4, $5, $6) => {
  return $2 + dir + $4 + milliseconds + $6
})
indexHtmlStr = indexHtmlStr.replace(reg2, ($0, $1, $2, $3, $4, $5, $6) => {
  return $2 + dir + $4 + milliseconds + $6
})
const reg3 = /(<!--\s?)?(<script src="\/index.js"><\/script>)(\s?-->)?/
/* const reg4 = /(<!--)?(<link rel="stylesheet" href="index.css" \/>)(-->)?/*/
indexHtmlStr = indexHtmlStr.replace(reg3, ($0, $1, $2, $3, $4, $5) => {
  return `<!--${$2}-->`
})
/* indexHtmlStr = indexHtmlStr.replace(reg4, function($0, $1, $2, $3, $4, $5){
  return '<!--' + $2 + '-->'
})*/
fs.writeFileSync(indexHtmlPath, indexHtmlStr)

/* 2. 修改ossTool.js */
const ossToolPath = './ossTool.js'
const reg6 = /(cvd\/mock\/)(\d+)(\/)/
let ossToolStr = fs.readFileSync(ossToolPath, { encoding: 'utf8' })
ossToolStr = ossToolStr.replace(reg6, ($0, $1, $2, $3, $4, $5) => {
  return $1 + dir + $3
})
fs.writeFileSync(ossToolPath, ossToolStr)

/* 3. 修改.roadhogrc */
const roadhogrcPath = './.roadhogrc'
let roadhogrcStr = fs.readFileSync(roadhogrcPath, { encoding: 'utf8' })
const reg7 = /("publicPath": ")(.*)(",)/
roadhogrcStr = roadhogrcStr.replace(reg7, ($0, $1, $2, $3, $4, $5) => {
  return `${$1}//cdn.xiaoduoai.com/cvd/mock/${dir}/dist/${$3}`
})

fs.writeFileSync(roadhogrcPath, roadhogrcStr)



