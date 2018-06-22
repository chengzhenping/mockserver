const fs = require('fs')
const path = require('path')
const indexHtmlPath = './public/index.html'
let indexHtmlStr = fs.readFileSync(indexHtmlPath, { encoding: 'utf8' })
const reg3 = /(<!--\s?)?(<script src="\/index.js"><\/script>)(\s?-->)?/
indexHtmlStr = indexHtmlStr.replace(reg3, ($0, $1, $2, $3, $4, $5) => {
  return $2
})
const reg1 = /(<!--\s?)?(<script src="\/\/cdn.xiaoduoai.com\/cvd\/mock\/)(\d+)(\/.*\?)(\d+)("><\/script>)(\s?-->)?/
const reg2 = /(<!--\s?)?(<link rel="stylesheet" href="\/\/cdn.xiaoduoai.com\/cvd\/mock\/)(\d+)(\/dist\/index.css\?)(\d+)(" \/>)(\s?-->)?/

indexHtmlStr = indexHtmlStr.replace(reg1, ($0, $1, $2, $3, $4, $5, $6) => {
  return `<!--${$2}${$3}${$4}${$5}${$6}-->`
})
indexHtmlStr = indexHtmlStr.replace(reg2, ($0, $1, $2, $3, $4, $5, $6) => {
  return `<!--${$2}${$3}${$4}${$5}${$6}-->`
})

fs.writeFileSync(indexHtmlPath, indexHtmlStr)
