const fs = require('fs')
const path = require('path')
const loading = require('./loading')

const main = async() => {
    // 读取数据
    const input = fs.readFileSync(path.join(__dirname, '../data/input/papers.csv'), { encoding: 'utf8' })
        // 处理输入，构建网络，包括作者 list 和关系 object
    const data = loading.parseInput2(input)

    // 处理数据，转化为 CSV 字符串
    const dataCSV = loading.handleData(data.papersSet, data.relations)
        // 结果写入文件
    fs.writeFileSync(path.join(__dirname, '../data/output/papers.csv'), dataCSV.papersCSV, { encoding: 'utf8' })
    fs.writeFileSync(path.join(__dirname, '../data/output/paperRelations.csv'), dataCSV.relationsCSV, { encoding: 'utf8' })

}

main()