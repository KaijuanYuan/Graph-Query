import Vue from 'vue'
import Vuex from 'vuex'
import authorsCsvUri from '../../data/output/paperRelations.csv'
import authorsCsvRel from '../../data/output/relations.csv'
import papersCsvUrl from '../../data/output/papers.csv'
import scholarsCsvUrl from '../../data/output/authors.csv'
Vue.use(Vuex)

import Attributes from './modules/Attribute'
import Structures from './modules/Structure';
export default new Vuex.Store({
    state: {
        authors: [], //全部数据，key:(author, title)
        relations: [],
        yearNo: [], //年份分布
        conferenceNo: [], //会议分布
        typeNo: [], //类型分布
        paperNo: [],
        coauthorNo: [],
        coauthorWei: [],
    },
    modules: {
        attribute: Attributes,
        structure: Structures,
    },
    getters: {},
    mutations: {
        addAuthor(state, author) {
            state.authors.push({...author })

        },
        addRelation(state, relation) {
            state.relations.push({...relation })
        },
        mixAutRel(state) {
            state.authors.forEach((author, index) => {
                const ind = state.relations.findIndex(function(value) {
                    return value.author == author.author
                })
                if (ind >= 0) {
                    state.authors[index].coauthors = [...state.relations[ind].coauthors]
                } else {
                    state.authors[index].coauthors = []
                }
            })
        },
        addYear(state, year) {
            state.yearNo.push(year)
        },
        addConference(state, confer) {
            state.conferenceNo.push(confer)
        },
        addType(state, type) {
            state.typeNo.push(type)
        },
        addPaperNo(state, scholar) {
            //state.typeNo.push(type)
            const ind = state.authors.findIndex(function(value) {
                return value.author == scholar
            })
            state.paperNo.push(state.authors[ind].paperNo)
                //console.log(scholar)
                //console.log(state.authors[ind].paperNo)

        },
        addCoNo(state, scholar) {
            //state.typeNo.push(type)
            const ind = state.authors.findIndex(function(value) {
                return value.author == scholar
            })
            const length = state.authors[ind].coauthors.length
            if (length > 0) {
                state.coauthorNo.push(state.authors[ind].coauthors.length)
            }

        },
        addCoWei(state, scholar) {
            //state.typeNo.push(type)
            const ind = state.authors.findIndex(function(value) {
                return value.author == scholar
            })
            const length = state.authors[ind].coauthors.length
            if (length > 0) {
                state.authors[ind].coauthors.forEach(coauthor => {
                    state.coauthorWei.push(coauthor.weight)
                })
            }

        },
    },
    actions: {
        async loadAuthors(context) {
            const resp = await fetch(authorsCsvUri)
            const text = await resp.text()
                //alert('Now is in actions.loadAuthors')
            const scholars = text.split('\n')
                //author,title,index,conference,year,type,DOI,link,autLength,autRank,autList,paperNo,paperList, coauthors
                //每条记录具体项为：作者名,论文题目,(key) 论文id,发表会议,发表年份,论文类型,DOI,链接,作者数量,作者排名,作者列表,作者发表论文总数,发表论文列表, 合作作者列表
            scholars.forEach(scholar => {
                if (scholar.length > 0) {
                    const items = scholar.split(',')
                    const author = items[0]
                    const title = items[1]
                    const index = items[2]
                    const conference = items[3]
                    const year = items[4]
                    const type = items[5]
                    const DOI = items[6]
                    const link = items[7]
                    let autList = items[10]
                    autList = autList.split(';')
                    const paperNo = items[11]
                    context.commit('addAuthor', { author, title, index, conference, year, type, DOI, link, autList, paperNo })
                }
            })
        },
        async loadRelations(context) {
            const resp = await fetch(authorsCsvRel)
            const text = await resp.text()
            const autRel = {}
                //alert('Now is in actions.loadRelations')
            const relations = text.split('\n')
            relations.forEach(relation => {
                if (relation.length > 0) {
                    const items = relation.split(',')
                    const start = items[0]
                    const end = items[1]
                    const weight = items[2]
                    if (autRel[start]) {
                        if (!autRel[start][end]) {
                            autRel[start][end] = weight
                        }
                    } else {
                        autRel[start] = {}
                        autRel[start][end] = weight
                    }
                    if (autRel[end]) {
                        if (!autRel[end][start]) {
                            autRel[end][start] = weight
                        }
                    } else {
                        autRel[end] = {}
                        autRel[end][start] = weight
                    }
                }
            })
            for (const rel in autRel) {
                const author = rel
                const coauthors = []
                for (const coauthor in autRel[rel]) {
                    coauthors.push({ name: coauthor, weight: autRel[rel][coauthor] })
                }
                context.commit('addRelation', { author, coauthors })
            }
        },
        mixAutRel(context) {
            context.commit('mixAutRel')
                //alert('Now is in actions.mixAutRel')
        },
        async loadPapers(context) {
            const resp = await fetch(papersCsvUrl)
            const text = await resp.text()
            const papers = text.split('\n')
            papers.forEach(paper => {
                if (paper.length > 0) {
                    const items = paper.split(',')
                    context.commit('addYear', items[3])
                    context.commit('addConference', items[2])
                    context.commit('addType', items[4])
                }
            })
        },
        async loadScholars(context) {
            const resp = await fetch(scholarsCsvUrl)
            const text = await resp.text()
            const scholars = text.split('\n')
            scholars.forEach((scholar, index) => {
                if (scholar.length > 0 && index > 0) {
                    context.commit('addPaperNo', scholar)
                    context.commit('addCoNo', scholar)
                    context.commit('addCoWei', scholar)

                }
            })
        },
    },
})

/*Format  -----  authors
authors is an array, in which each element is an author, aurhots records all the data which is organized as follows:
authors[
{
    author: 作者名，
    title: 论文题目，
    index: 论文id，
    conference: 发表会议,
    year: 发表年份,
    type: 论文类型，
    DOI: DOI,
    link: 链接，
    autLength: 作者数量,
    autRank: 作者排名，
    autList: 作者列表，[aut1, aut2, aut3...]
    paperNo: 作者发表论文总数，
    paperList：发表论文列表，[paper1, paper2, paper3...]

},
{...},
{...},
...
]
*/