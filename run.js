// 这个data, 是多个 B站收藏夹的list请求的 响应结果, 所以是一个数组
const data = require('./listdata.json')
const fs = require('fs')
const { func } = require('prop-types')
const keyMap = [
    {
        source: "前端",
        target: '<span style="color:red;">前端</span>'
    },
    {
        source: "后端",
        target: '<span style="color:red;">后端</span>'
    },
    {
        // 字符串
        source: ["CSS", "css", /Css/gi],
        target: '<span style="color:#FF770F;">CSS</span>'
    },
    {
        // 正则
        source: [/JavaScript/gi, /js/gi],
        target: '<span style="color:#FF770F;">JavaScript</span>'
    },
    {
        source: [/vue/gi, /vue.js/gi],
        target: '<span style="color:#FF770F;">Vue.JS</span>'
    },
    {
        source: [/vue-cli/gi],
        target: '<span style="color:#FF770F;">Vue-Cli</span>'
    },
    {
        source: [/vite/gi],
        target: '<span style="color:#FF770F;">Vite</span>'
    },
    {
        source: [/React/gi, /React.js/gi],
        target: '<span style="color:#FF770F;">React.JS</span>'
    }
]

/**
 * 替换视频信息中的一些字符
 * @param {object} value 一条视频信息
 */
function replaceKey(value) {
    value.intro = value.intro.replace('"', '“')
    value.intro = value.intro.replace('(', '（')
    value.intro = value.intro.replace(')', '）')
    value.intro = value.intro.replace('<', '＜')
    value.intro = value.intro.replace('>', '＞')
    value.intro = value.intro.replace('\\', '＼')
    value.intro = value.intro.replace('/', '／')
    // 替换关键字
    for (const key of keyMap) {
        if (typeof key.source == "string") {
            value.title = value.title.replace(key.source, key.target)
        }
        if (Array.isArray(key.source)) {
            for (const i of key.source) {
                value.title = value.title.replace(i, key.target)
            }
        }


    }
    // 这两个基本无效, 可能需要手动替换
    value.intro = value.intro.replace('\r', '')
    value.intro = value.intro.replace('\n', '')
    return value
}
/**
 * 拼接信息
 */
function jointInfo(i) {
    // 必须顶格
    return `
> <img src="${i.upper.face}" title="${i.upper.name} - ${i.upper.mid}" width="40px" heigth="40px" style="border-radius:50%;margin-botton:20px;"/> ${i.upper.name}
> ${i.title}

<a href="https://www.bilibili.com/video/${i.bv_id}"><img src="${i.cover}" title="${i.intro}" width="300px" heigth="200px"/></a>

---
\n\n\n\n
`
}


// 得到存放视频信息的数组(未考虑分类, 不同分类会混在一起)
let list = []
for (const i of data) {
    let medias = i.data.medias
    for (const j of medias) {
        list.push(j)
    }
}

let result = ``
for (const i of list) {
    result += jointInfo(replaceKey(i))
}

fs.writeFile('D:/test.md', result, err => {
    if (err) {
        console.error(err)
        return
    }
})
