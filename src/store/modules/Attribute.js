export default {
    state: {
        count: 0,
        year: { attrName: 'Time', attrUnit: 'year', left: 0, right: 0, leftX: 0, rightX: 0, shadow: 100, attrValue: [], options: [], }, //年份分布
        conference: {}, //会议分布
        type: {}, //类型分布
        paper: { attrName: 'Publications', attrUnit: 'number', left: 0, right: 0, leftX: 0, rightX: 0, shadow: 100, attrValue: [], options: [], },
        coNumber: { attrName: 'Coauthors', attrUnit: 'number', left: 0, right: 0, leftX: 0, rightX: 0, shadow: 100, attrValue: [], options: [], },
        coWeight: { attrName: 'Cooperation Times', attrUnit: 'number', left: 0, right: 0, leftX: 0, rightX: 0, shadow: 100, attrValue: [], options: [], },
        barNo: 8,
        leftRangeDelta: 0.8,
        barWidth: 11,
        midBarDelta: 1,
        magnification: 15, //缩小bar间的倍数差异
        constraints: [], //属性约束列表

    },
    getters: {
        getYear(state) {
            return state.year
        }
    },
    mutations: {
        increment(state) {
            state.count++
        },
        decrement(state) {
            state.count--
        },
        attrYear(state, yearNo) {
            state.year['attrName'] = 'Time Published'
            state.year['attrUnit'] = 'year'
            state.year['attrValue'] = []
            state.year['options'] = []
            yearNo.forEach(year => {
                const ind = state.year['attrValue'].findIndex(function(item) {
                    return item.value == parseInt(year)
                })
                if (ind >= 0) {
                    state.year['attrValue'][ind].count++
                } else {
                    state.year['attrValue'].push({ value: parseInt(year), count: 1 })
                }
            })
            state.year['attrValue'].sort((a, b) => {
                return a.value - b.value
            })

            const minDelta = Math.abs(state.year['attrValue'][1].value - state.year['attrValue'][0].value)
            const minValue = state.year['attrValue'][0].value
            const maxValue = state.year['attrValue'][state.year.attrValue.length - 1].value
            const delta = (maxValue - minValue) / state.barNo
            state.year['minDelta'] = minDelta
            state.year['minValue'] = minValue
            state.year['maxValue'] = maxValue
            state.year['delta'] = delta
            state.year['left'] = minValue
            state.year['right'] = maxValue

            // console.log(minDelta)
            // console.log(maxValue)
            // console.log(minValue)
            // console.log(delta)
            let heightMax = 0
            for (let i = 0; i < state.barNo; i++) {
                const left = i * (state.midBarDelta + 11) + state.leftRangeDelta
                const width = state.barWidth
                let height = 0
                const leftRange = minValue + i * delta
                const rightRange = minValue + (i + 1) * delta
                state.year.attrValue.forEach(item => {
                    if (item.value >= leftRange) {
                        if (rightRange < maxValue && item.value < rightRange) {
                            height += item.count
                        } else if (rightRange == maxValue && item.value <= rightRange) {
                            height += item.count
                        }
                    }
                })
                if (height > heightMax) {
                    heightMax = height
                }

                const shadow = 100
                    //console.log(left + ' ' + width + ' ' + height + ' ' + leftRange + ' ' + rightRange)
                state.year.options.push({ left, width, height, leftRange, rightRange, shadow })
            }
            state.year.options.forEach(item => {
                item.height = item.height / heightMax * 100

            })
            state.year['leftX'] = state.year.options[0].left
            state.year['rightX'] = state.year.options[state.year.options.length - 1].left + state.barWidth

            // let allNo = 0
            // console.log(state.year['attrName'])
            // console.log(state.year['attrUnit'])
            // state.year['attrValue'].forEach(value => {
            //     console.log(value.value + ' ' + value.count)
            //     allNo += value.count

            // })
            // console.log(allNo)

            console.log(state.year.options[state.year.options.length - 1].rightRange)

        },
        attrPaper(state, paperNo) {
            state.paper['attrName'] = 'Publications'
            state.paper['attrUnit'] = 'number'
            state.paper['attrValue'] = []
            state.paper['options'] = []
            paperNo.forEach(paper => {
                const ind = state.paper['attrValue'].findIndex(function(item) {
                    return item.value == parseInt(paper)
                })
                if (ind >= 0) {
                    state.paper['attrValue'][ind].count++
                } else {
                    state.paper['attrValue'].push({ value: parseInt(paper), count: 1 })
                }
            })
            state.paper['attrValue'].sort((a, b) => {
                return a.value - b.value
            })

            const minDelta = Math.abs(state.paper['attrValue'][1].value - state.paper['attrValue'][0].value)
            const minValue = state.paper['attrValue'][0].value
            const maxValue = state.paper['attrValue'][state.paper.attrValue.length - 1].value
            const delta = (maxValue - minValue) / state.barNo
            state.paper['minDelta'] = minDelta
            state.paper['minValue'] = minValue
            state.paper['maxValue'] = maxValue
            state.paper['delta'] = delta
            state.paper['left'] = minValue
            state.paper['right'] = maxValue
                // console.log(minDelta)
                // console.log(maxValue)
                // console.log(minValue)
                // console.log(delta)
            let heightMax = 0
            for (let i = 0; i < state.barNo; i++) {
                const left = i * (state.midBarDelta + 11) + state.leftRangeDelta
                const width = state.barWidth
                let height = 0
                const leftRange = minValue + i * delta
                const rightRange = minValue + (i + 1) * delta
                state.paper.attrValue.forEach(item => {
                    if (item.value >= leftRange) {
                        if (rightRange < maxValue && item.value < rightRange) {
                            height += item.count
                        } else if (rightRange == maxValue && item.value <= rightRange) {
                            height += item.count
                        }
                    }
                })
                if (height > heightMax) {
                    heightMax = height
                }
                const shadow = 100
                    //console.log(left + ' ' + width + ' ' + height + ' ' + leftRange + ' ' + rightRange)
                state.paper.options.push({ left, width, height, leftRange, rightRange, shadow })
            }
            state.paper.options.forEach((item, index) => {
                item.height = item.height / heightMax * 100
                if (index > 0) {
                    item.height *= state.magnification
                }

                //console.log(item.height)
            })

            state.paper['leftX'] = state.paper.options[0].left
            state.paper['rightX'] = state.paper.options[state.paper.options.length - 1].left + state.barWidth

            // console.log(paperNo.length)
            // let allNo = 0
            // console.log(state.paper['attrName'])
            // console.log(state.paper['attrUnit'])
            // state.paper['attrValue'].forEach(value => {
            //     console.log(value.value + ' ' + value.count)
            //     allNo += value.count

            // })
            // console.log(allNo)
            console.log(state.paper.options[state.paper.options.length - 1].rightRange)
        },
        attrNumber(state, coauthorNo) {
            state.coNumber['attrName'] = 'Coauthors'
            state.coNumber['attrUnit'] = 'number'
            state.coNumber['attrValue'] = []
            state.coNumber['options'] = []
            coauthorNo.forEach(coauthor => {
                const ind = state.coNumber['attrValue'].findIndex(function(item) {
                    return item.value == parseInt(coauthor)
                })
                if (ind >= 0) {
                    state.coNumber['attrValue'][ind].count++
                } else {
                    state.coNumber['attrValue'].push({ value: parseInt(coauthor), count: 1 })
                }
            })
            state.coNumber['attrValue'].sort((a, b) => {
                return a.value - b.value
            })

            const minDelta = Math.abs(state.coNumber['attrValue'][1].value - state.coNumber['attrValue'][0].value)
            const minValue = state.coNumber['attrValue'][0].value
            const maxValue = state.coNumber['attrValue'][state.coNumber.attrValue.length - 1].value
            const delta = (maxValue - minValue) / state.barNo
            state.coNumber['minDelta'] = minDelta
            state.coNumber['minValue'] = minValue
            state.coNumber['maxValue'] = maxValue
            state.coNumber['delta'] = delta
            state.coNumber['left'] = minValue
            state.coNumber['right'] = maxValue
                // console.log(minDelta)
                // console.log(maxValue)
                // console.log(minValue)
                // console.log(delta)
            let heightMax = 0
            for (let i = 0; i < state.barNo; i++) {
                const left = i * (state.midBarDelta + 11) + state.leftRangeDelta
                const width = state.barWidth
                let height = 0
                const leftRange = minValue + i * delta
                const rightRange = minValue + (i + 1) * delta
                state.coNumber.attrValue.forEach(item => {
                    if (item.value >= leftRange) {
                        if (rightRange < maxValue && item.value < rightRange) {
                            height += item.count
                        } else if (rightRange == maxValue && item.value <= rightRange) {
                            height += item.count
                        }
                    }
                })
                if (height > heightMax) {
                    heightMax = height
                }
                const shadow = 100
                    //console.log(left + ' ' + width + ' ' + height + ' ' + leftRange + ' ' + rightRange)
                state.coNumber.options.push({ left, width, height, leftRange, rightRange, shadow })
            }
            state.coNumber.options.forEach((item, index) => {
                item.height = item.height / heightMax * 100
                if (index > 0) {
                    item.height *= state.magnification / 1.5
                }

            })

            state.coNumber['leftX'] = state.coNumber.options[0].left
            state.coNumber['rightX'] = state.coNumber.options[state.coNumber.options.length - 1].left + state.barWidth

            // console.log(coauthorNo.length)
            // let allNo = 0
            // console.log(state.coNumber['attrName'])
            // console.log(state.coNumber['attrUnit'])
            // state.coNumber['attrValue'].forEach(value => {
            //     console.log(value.value + ' ' + value.count)
            //     allNo += value.count

            // })
            // console.log(allNo)
            console.log(state.coNumber.options[state.coNumber.options.length - 1].rightRange)
        },
        attrWeight(state, coauthorWei) {
            state.coWeight['attrName'] = 'Cooperation Times'
            state.coWeight['attrUnit'] = 'number'
            state.coWeight['attrValue'] = []
            state.coWeight['options'] = []
            coauthorWei.forEach(coauthor => {
                const ind = state.coWeight['attrValue'].findIndex(function(item) {
                    return item.value == parseInt(coauthor)
                })
                if (ind >= 0) {
                    state.coWeight['attrValue'][ind].count++
                } else {
                    state.coWeight['attrValue'].push({ value: parseInt(coauthor), count: 1 })
                }
            })
            state.coWeight['attrValue'].sort((a, b) => {
                return a.value - b.value
            })

            const minDelta = Math.abs(state.coWeight['attrValue'][1].value - state.coWeight['attrValue'][0].value)
            const minValue = state.coWeight['attrValue'][0].value
            const maxValue = state.coWeight['attrValue'][state.coWeight.attrValue.length - 1].value
            const delta = (maxValue - minValue) / state.barNo
            state.coWeight['minDelta'] = minDelta
            state.coWeight['minValue'] = minValue
            state.coWeight['maxValue'] = maxValue
            state.coWeight['delta'] = delta
            state.coWeight['left'] = minValue
            state.coWeight['right'] = maxValue
                // console.log(minDelta)
                // console.log(maxValue)
                // console.log(minValue)
                // console.log(delta)
            let heightMax = 0
            for (let i = 0; i < state.barNo; i++) {
                const left = i * (state.midBarDelta + 11) + state.leftRangeDelta
                const width = state.barWidth
                let height = 0
                const leftRange = minValue + i * delta
                const rightRange = minValue + (i + 1) * delta
                state.coWeight.attrValue.forEach(item => {
                    if (item.value >= leftRange) {
                        if (rightRange < maxValue && item.value < rightRange) {
                            height += item.count
                        } else if (rightRange == maxValue && item.value <= rightRange) {
                            height += item.count
                        }
                    }
                })
                if (height > heightMax) {
                    heightMax = height
                }
                const shadow = 100
                    //console.log(left + ' ' + width + ' ' + height + ' ' + leftRange + ' ' + rightRange)
                state.coWeight.options.push({ left, width, height, leftRange, rightRange, shadow })
            }
            state.coWeight.options.forEach((item, index) => {
                item.height = item.height / heightMax * 100
                if (index > 0) {
                    item.height *= state.magnification
                }

            })

            state.coWeight['leftX'] = state.coWeight.options[0].left
            state.coWeight['rightX'] = state.coWeight.options[state.coWeight.options.length - 1].left + state.barWidth


            // console.log(coauthorWei.length)
            // let allNo = 0
            // console.log(state.coWeight['attrName'])
            // console.log(state.coWeight['attrUnit'])
            // state.coWeight['attrValue'].forEach(value => {
            //     console.log(value.value + ' ' + value.count)
            //     allNo += value.count

            // })
            // console.log(allNo)
            console.log(state.coWeight.options[state.coWeight.options.length - 1].rightRange)
        },

    },
    actions: {
        attrYear({ state, commit, rootState }) {

            commit('attrYear', rootState.yearNo)
            commit('attrPaper', rootState.paperNo)
            commit('attrNumber', rootState.coauthorNo)
            commit('attrWeight', rootState.coauthorWei)
            alert('Now is in attrYear~')


        }
    },
}


/*Format  -----  year, paper, coNumber, coWeight, constraints

year 
{
    attrName: '',属性名
    attrUnit: '',属性单位
    attrValue: [{value:属性值, count:数量}, {}, ...],
    minDelta: 最小变量,
    minValue: 最小属性值,
    maxValue: 最大属性值,
    delta: bar间变量delta,
    left: 当前左值，
    right: 当前右值,
    leftX: 当前左坐标，
    rightX: 当前右坐标，
    options: [
        {left:该bar左侧位置（单位%）,
         width:该bar宽度,
         height:该bar高度,
         leftRange:该bar最左侧属性值（>=最小值）,
         rightRange:该bar最右侧属性值（<最大值）,
         shadow:该bar阴影高度
        }, 
        {},
         ...],

}


constraints
[
{
    //是否为当前应用的属性约束
    inApply: true/false,

    //每个属性约束的range
    attributes: [
        {
            attrName: '',
         left: value,
         right: value,
        },
        {},
        ...
    ]
},
{},
]

*/