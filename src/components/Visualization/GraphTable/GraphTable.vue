<template>
<div id="graphtable">
    <div class="table-titles"></div>
    <div class="table-contents"></div>
    <!-- <div class="table-column"></div>
        <div class="table-body"></div>-->
    <!-- <svg></svg> -->
</div>
</template>

<script>
import * as d3 from "d3";

function d3ForceCompute(graph) {
    return function (callback) {
        var simulation = d3
            .forceSimulation()
            .force(
                "link",
                d3.forceLink().id(function (d) {
                    return d.id;
                })
            )
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(0.5, 0.5))
            .alphaMin(0.1);

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked)
            .on("end", () => {
                callback(graph);
            });

        simulation.force("link").links(graph.links);

        function ticked() {}
    };
}

export default {
    name: "GraphTable",
    data: () => ({}),
    computed: {},
    methods: {},
    created: function () {
        this.attrNames = ["year", "paper", "coNumber", "coWeight"];
        this.attrMap = {
            year: author => [+author.year],
            paper: author => [+author.paperNo],
            coNumber: author => [author.coauthors.length],
            coWeight: author => author.coauthors.map(ca => +ca.weight)
        };

        this.authors = this.$store.state.attribute.authorsFilted;

        this.structures = [{
            pattern: {
                nodes: [{
                    id: 0
                }, {
                    id: 1
                }, {
                    id: 2
                }],
                links: [{
                    source: 0,
                    target: 1
                }, {
                    source: 1,
                    target: 2
                }, {
                    source: 2,
                    target: 0
                }]
            },
            authors: [
                [3140, 3141, 3142, 3168, 3299, 3300, 3189, 3190, 3191, 3247, 3248, 3249, 3271, 3272, 3273, 3296, 3297, 3298, 3317, 3318, 3319, 3339, 3340, 3341, 3356, 3357, 3358, 3435, 3436, 3437, 3493, 3494, 3495, 3595, 3596, 3597, 3620, 3621, 3622, 3635, 3636, 3637, 3722, 3723, 3724, 3725, 3726, 3727, 3733, 3734, 3735],
                ["Paul Rosenthal", "Tran Van Long", "Stephan Rosswog", "Michael Ogawa", "Chad Jones", "Anna Tikhonova", "Edward Clarkson", "Krishna Desai", "James D. Foley", "Suvi Tarkkanen", "Kaisa Miettinen", "Jussi Hakanen", "Scott Butner", "Michelle L. Gregory", "Julia Walker", "Thorsten Liebig", "Olaf Noppens", "Friedrich W. von Henke", "David Allen", "Tsai-Ching Lu", "Dave Huber", "Brandon Wright", "Matthew Steckman", "Scott Stevson", "Yong Wan", "Hideo Otsuna", "Chi-Bin Chien", "Younis Hijazi", "Rolf Westerteiger", "Mathias Schott", "Minoo Erfani Joorabchi", "Ji-Dong Yim", "Mona Erfani Joorabchi", "Olga A. Karpenko", "Wilmot Li", "Niloy J. Mitra", "Seon Joo Kim", "Shaojie Zhuo", "Fanbo Deng", "Wei Zeng", "Joseph Marino", "Krishna Chaitanya Gurijala", "Jagoda Walny", "Gina Venolia", "Philip Fawcett", "Mark-Anthony Bray", "Anne E. Carpenter", "Roy A. Ruddle", "Hossam Sharara", "Awalin Sopan", "Galileo Namata"]
            ]
        }];

        console.log('matchResults', this.$store.state.matchResults);

        const {
            year,
            paper,
            coNumber,
            coWeight
        } = this.$store.state.attribute;

        this.attrNames.forEach(attrName => {
            this[attrName] = this.$store.state.attribute[attrName];
        });
    },
    mounted: function () {
        let columnTitles = [{
                content: "Conference",
                type: "text",
                attrName: 'conference'
            },
            {
                content: "Type",
                type: "text",
                attrName: 'type'
            },
            {
                content: "Published Time",
                type: "text",
                attrName: "year",
                sortBasis: 'yearAve'
            },
            {
                content: "Publications",
                type: "text",
                attrName: "paper",
                sortBasis: 'paperAve'
            },
            {
                content: "Coauthors",
                type: "text",
                attrName: "coNumber",
                sortBasis: 'coNumberAve'
            },
            {
                content: "Cooperation Times",
                type: "text",
                attrName: "coWeight",
                sortBasis: 'coWeightAve'
            }
        ];

        this.structures.forEach((d, i) => {
            columnTitles.push({
                content: d.pattern,
                type: 'pattern',
                attrName: "pattern" + i
            });
        })

        var statistic = {};

        var ranks = this.attrNames.map(attrName => {
            var rank = {};
            var attrs = Array.from(new Set(this.authors.map(author => d3.mean(this.attrMap[attrName](author)))));
            attrs.sort((a, b) => b - a);
            attrs.forEach((d, i) => rank[d] = i / attrs.length);
            return rank;
        });

        console.log(ranks);

        var authorMap = new Map();

        this.authors.forEach(author => {
            authorMap.set(author.author, author);
            var conference = author.conference;
            var type = author.type;
            statistic[conference] = statistic[conference] ?
                statistic[conference] : {};
            statistic[conference][type] = statistic[conference][type] ?
                statistic[conference][type] :
                this.attrNames.reduce((result, attrName) => {
                    result[attrName] = new Array(
                        this[attrName].options.length
                    ).fill(0);
                    result[attrName + 'Sum'] = 0;
                    result[attrName + 'Count'] = 0;
                    return result;
                }, {});

            this.attrNames.forEach(attrName => {
                var statis = statistic[conference][type];
                this.attrMap[attrName](author).forEach(value => {
                    statis[attrName + 'Sum'] += +value;
                    statis[attrName + 'Count']++;
                });

                for (var i = 0; i < this[attrName].options.length; i++) {
                    this.attrMap[attrName](author).forEach(value => {
                        if (value >= this[attrName].options[i].leftRange) {
                            if ((i == this[attrName].options.length - 1 && value == this[attrName].options[i].rightRange) ||
                                value < this[attrName].options[i].rightRange) {
                                statis[attrName][i]++;
                            }
                        }
                    });
                }
            });
        });

        var self = this;

        var dataTable = [];
        Object.keys(statistic).forEach(conf => {
            Object.keys(statistic[conf]).sort().forEach(type => {
                dataTable.push({
                    conference: conf,
                    type: type,
                    ...statistic[conf][type],
                    ...new Array(self.structures.length).fill(0).map((d, i) => i).reduce((r, i) => {
                        r['pattern' + i] = new Array(5).fill(0);
                        return r;
                    }, {}),
                    ...self.attrNames.reduce((result, attrName) => {
                        result[attrName + 'Ave'] = statistic[conf][type][attrName + 'Sum'] / statistic[conf][type][attrName + 'Count'];
                        return result;
                    }, {})
                });
            });
        });

        this.structures.forEach((d, i) => {
            d.authors[1].forEach(name => {
                var author = authorMap.get(name);
                var rank = d3.mean(this.attrNames.map((attrName, i) => {
                    return ranks[i][d3.mean(this.attrMap[attrName](author))]
                }));
                var dataRow = dataTable.filter(row => row.conference == author.conference && row.type == author.type)[0];
                console.log(author, rank, dataRow);
                if (dataRow) {
                    dataRow['pattern' + i][Math.floor(rank * 5)]++;
                } else {
                    console.error('jackie error!');
                }
            });
        });

        dataTable.sort((a, b) => {
            if (a.type > b.type) {
                return 1;
            } else if (a.type == b.type) {
                return 0;
            } else {
                return -1;
            }
        });
        dataTable.sort((a, b) => {
            if (a.conference > b.conference) {
                return 1;
            } else if (a.conference == b.conference) {
                return 0;
            } else {
                return -1;
            }
        });

        console.log(dataTable);

        var render = (dataTable) => {
            d3.select('.table-contents').remove();
            d3.select('#graphtable').append("div").attr('class', 'table-contents');

            var rowWidth = d3.select(".table-contents").node().clientWidth,
                rowHeight = 50;

            var diameter = -1,
                padding = -1;

            var rows = d3.select('.table-contents')
                .selectAll(".table-row")
                .data(dataTable, function (d, i) {
                    return i;
                });

            rows.exit().remove();

            rows.enter()
                .append('div')
                .attr('class', 'table-row')
                .attr('style', d => `height: ${rowHeight}px`)
                .each(function (rowData) {
                    var row = d3.select(this);
                    var columns = row.selectAll('.table-column').data(columnTitles);
                    columns.enter().append('div').attr('class', 'table-column');
                    columns.exit().remove();

                    row.selectAll('.table-column')
                        .each(function (dd) {
                            if (dd.content == 'Conference' || dd.content == 'Type') {
                                d3.select(this).text(rowData[dd.attrName]);
                                d3.select(this)
                                    .attr('style', `line-height: ${ rowHeight }px`);
                                if (dd.content == 'Conference') {
                                    d3.select(this).classed('conference', true);
                                }
                            } else if (dd.attrName) {
                                var svg = d3.select(this).select('svg');
                                if (svg.empty()) {
                                    svg = d3.select(this)
                                        .append('svg')
                                        .attr('class', 'table-column-svg');
                                }

                                var max = rowData[dd.attrName].reduce((max, value) => Math.max(value, max), 0),
                                    min = rowData[dd.attrName].reduce((min, value) => Math.min(value, min), 0);

                                var minOpacity = 0.05;

                                var fillOpacity = rowData[dd.attrName].map(value => max == min ? 0 : (value - min) / (max - min) * (1 - minOpacity) + minOpacity);

                                var bars = svg.selectAll('.bar')
                                    .data(fillOpacity);

                                bars.enter()
                                    .append('rect')
                                    .attr('class', 'bar');

                                bars.exit().remove();

                                diameter = diameter > 0 ? diameter : this.clientHeight * 0.4;
                                padding = padding > 0 ? padding : this.clientHeight * 0.3;

                                var begin = this.clientWidth / 2 - ((padding + diameter) * rowData[dd.attrName].length + padding) / 2 + padding;

                                svg.selectAll('.bar')
                                    .attr('x', function (d, i) {
                                        return begin + i * (padding + diameter)
                                    })
                                    .attr('y', padding)
                                    .attr('width', diameter)
                                    .attr('height', diameter)
                                    .attr('fill', '#FFB300')
                                    .attr('fill-opacity', d => d);
                            }
                        });
                });

            d3.selectAll('.conference')
                .each(function (d, i) {
                    if ((i - 1) % 3 != 0) {
                        d3.select(this).text('');
                    }
                })
        };

        var tableTitles = d3.select(".table-titles")
            .selectAll("div.table-title")
            .data(columnTitles);

        tableTitles
            .enter()
            .append("div")
            .attr("class", "table-title");
        tableTitles.exit().remove();

        d3.selectAll("div.table-title").each(function (d) {
            // d3.select(this)
            //     .append("div")
            //     .attr("class", "table-title");
            if (d.type == "text") {
                let title = d3.select(this);
                title.text(d.content);
                title.attr("style", `box-sizing: border-box;`);

                if (d.sortBasis) {
                    var sortButton = title.append('button')
                        .text('↕')
                        .attr('title', 'sort');

                    let flag = 1;

                    sortButton.on('click', () => {
                        flag = -1 * flag;
                        dataTable.sort((a, b) => {
                            return (a[d.sortBasis] - b[d.sortBasis]) * flag;
                        });
                        dataTable.sort((a, b) => {
                            if (a.conference > b.conference) {
                                return 1;
                            } else if (a.conference == b.conference) {
                                return 0;
                            } else {
                                return -1;
                            }
                        });
                        render(dataTable);
                    });
                }
            } else if (d.type == "pattern") {
                var uw = this.clientWidth,
                    uh = this.clientHeight;
                var svg = d3.select(this)
                    .append("svg")
                    .attr("class", "table-title")
                    .attr('width', uw)
                    .attr('height', uh);

                d3ForceCompute(d.content)(graph => {
                    var {
                        nodes,
                        links
                    } = graph;

                    var id2node = new Map(nodes.map(node => [node.id, node]));

                    var positions = [];
                    var min_x = Infinity,
                        min_y = Infinity,
                        max_x = -Infinity,
                        max_y = -Infinity;

                    for (var i = 0; i < nodes.length; ++i) {
                        min_x = Math.min(nodes[i].x, min_x);
                        max_x = Math.max(nodes[i].x, max_x);
                        min_y = Math.min(nodes[i].y, min_y);
                        max_y = Math.max(nodes[i].y, max_y);
                    }

                    var diameter = Math.min(uw, uh) * 0.5;
                    for (var i = 0; i < nodes.length; ++i) {
                        if (Math.abs(max_x - min_x) <= 0.01) {
                            nodes[i].x = uw / 2;
                        } else {
                            nodes[i].x = ((nodes[i].x - min_x) / (max_x - min_x)) * diameter + uw / 2 - diameter / 2;
                        }

                        if (Math.abs(max_y - min_y) <= 0.01) {
                            nodes[i].y = uh / 2;
                        } else {
                            nodes[i].y = ((nodes[i].y - min_y) / (max_y - min_y)) * diameter + uh / 2 - diameter / 2;
                        }
                    }

                    var lines = svg.selectAll('line.line')
                        .data(links);

                    lines.enter()
                        .append('line')
                        .attr('class', 'line')
                        .attr('x1', d => d.source.x)
                        .attr('y1', d => d.source.y)
                        .attr('x2', d => d.target.x)
                        .attr('y2', d => d.target.y)
                        .attr('stroke-width', Math.min(5, diameter / 10));

                    lines.exit().remove();

                    var dots = svg.selectAll('circle.dot')
                        .data(nodes);

                    dots.enter()
                        .append('circle')
                        .attr('class', 'dot')
                        .attr('cx', d => d.x)
                        .attr('cy', d => d.y)
                        .attr('r', Math.min(diameter / 10, 5));

                    dots.exit().remove();
                });

            }
        });

        render(dataTable);
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss">
div#graphtable {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    div.table-titles {
        width: 100%;
        height: 120px;
        display: flex;
        border-bottom: 2px solid #dadada;

        .table-title {
            flex: 1;
            line-height: 120px;
            position: relative;

            button {
                position: absolute;
                justify-content: center;
                align-items: center;
                display: flex;
                line-height: 24px;
                font-size: 14px;
                color: #777;
                padding: 0 10px;
                margin: 0 5px;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 200ms, color 200ms;

                position: absolute;
                right: 20px;
                top: 45px;
                font-size: 20px;

            }

            .dot {
                fill: #000;
            }

            .line {
                stroke: #999;
            }
        }
    }

    div.table-contents {
        flex: 1;
        overflow: auto;

        div.table-row {
            width: 100%;
            display: flex;

            div.table-column {
                flex: 1;
                // background: gray;
                // border: 1px solid black;
                border-bottom: 1px solid #eaecee;
                display: flex;
                flex-direction: column;
            }

            div.conference {
                border: none;
            }
        }
    }
}
</style>
