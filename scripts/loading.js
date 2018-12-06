const parse = require('csv-parse/lib/sync')

// 链表法
const parseInput2 = (input) => {

    // 论文信息统计
    const papers = parse(input)
        //console.log(papers)
    const papersSet = {}

    // 论文遍历
    papers.forEach((paper, index) => {
        // 作者遍历
        if (index < 1) {
            return
        }
        const authors = paper[9].split(';')
        const conference = paper[0]
        const year = paper[1]
        const title = paper[2].replace(/,/g, "")
        const type = paper[7]
        const autList = paper[9]
        const DOI = paper[3]
        const link = paper[4]

        //console.log(autList)
        papersSet[title] = { index, title, conference, year, type, DOI, link, autList }

    })

    // 构建作者网络（author-paper）
    const relations = {}

    papers.forEach((paper, ind) => {
        if (ind < 1) {
            return
        }
        const authors = paper[9].split(';')
        const title = paper[2].replace(/,/g, "")
        const len = authors.length
        const autLength = len
        const autList = paper[9]
        const DOI = paper[3]
        const link = paper[4]

        for (let i = 0; i < len; i++) {
            if (!relations[authors[i]]) {
                const index = papersSet[title].index
                const conference = papersSet[title].conference
                const year = papersSet[title].year
                const type = papersSet[title].type
                const autRank = i + 1
                relations[authors[i]] = {}
                if (!relations[authors[i]][paper[2]]) {
                    relations[authors[i]][paper[2]] = { index, title, conference, year, type, DOI, link, autLength, autRank, autList }
                }

            } else {
                const index = papersSet[title].index
                const conference = papersSet[title].conference
                const year = papersSet[title].year
                const type = papersSet[title].type
                const autRank = i + 1
                if (!relations[authors[i]][paper[2]]) {
                    relations[authors[i]][paper[2]] = { index, title, conference, year, type, DOI, link, autLength, autRank, autList }
                }
            }
        }
    })

    return { papersSet, relations }
}

// 处理数据成字符串
const handleData = (papers, relations) => {

    let papersCSV = ''
    let relationsCSV = ''
    for (const paper in papers) {
        const DOI = papers[paper].DOI
        const link = papers[paper].link
        papersCSV += `${papers[paper].index},${papers[paper].title},${papers[paper].conference},${papers[paper].year},${papers[paper].type},${DOI},${link},${papers[paper].autList}\n`

    }


    for (const author in relations) {
        const articles = relations[author]
        let paperNo = 0
        let paperList = ''
        for (const article in articles) {
            paperNo++
            paperList += article + ';'
        }
        for (const article in articles) {
            const index = relations[author][article].index
            const conference = relations[author][article].conference
            const year = relations[author][article].year
            const type = relations[author][article].type
            const title = article.replace(/,/g, "")
            const autLength = relations[author][article].autLength
            const autRank = relations[author][article].autRank
            const autList = relations[author][article].autList
            const DOI = relations[author][article].DOI
            const link = relations[author][article].link
            relationsCSV += `${author},${title},${index},${conference},${year},${type},${DOI},${link},${autLength},${autRank},${autList},${paperNo},${paperList}\n`
                //每条记录具体项为：作者名,论文题目,(key) 论文id， 发表会议，  发表年份， 论文类型， 作者数量， 作者排名， 作者列表，作者发表论文总数，发表论文列表
        }

    }

    //console.log(relationsCSV)

    return { papersCSV, relationsCSV }

}

module.exports = {
    parseInput2,
    handleData
}