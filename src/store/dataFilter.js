//根据新应用的约束过滤数据
function filtData(constrInApply, autList) {
    alert("test test test~")

    let year = [0, 0]
    let paper = [0, 0]
    let number = [0, 0]
    let weight = [0, 0]

    constrInApply.forEach(cons => {
        if (cons.attrName == 'Time Published') {
            year[0] = cons.left
            year[1] = cons.right
        } else if (cons.attrName == 'Publications') {
            paper[0] = cons.left
            paper[1] = cons.right
        } else if (cons.attrName == 'Coauthors') {
            number[0] = cons.left
            number[1] = cons.right
        } else if (cons.attrName == 'Cooperation Times') {
            weight[0] = cons.left
            weight[1] = cons.right
        }
    })

    const authors = autList.filter(function(item) {
        if (parseInt(item.year) >= year[0] && parseInt(item.year) < year[1]) {
            if (parseInt(item.paperNo) >= paper[0] && parseInt(item.paperNo) < paper[1]) {
                if (item.coauthors.length >= number[0] && item.coauthors.length < number[1]) {
                    const wei = item.coauthors.findIndex(function(coauthor) {
                        if (parseInt(coauthor.weight) >= weight[0] && parseInt(coauthor.weight) < weight[1]) {
                            return coauthor
                        }
                    })
                    if (wei >= 0) {
                        return item
                    }

                }

            }

        }

    })

    return authors
}


export { filtData }