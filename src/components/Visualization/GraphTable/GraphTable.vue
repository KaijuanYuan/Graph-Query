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
export default {
    name: "GraphTable",
    data:{
      matchResults :[],
      authors:[]
    },
    computed: {},
    methods: {},

    created: function () {
        this.attrNames = ["year", "paper", "coNumber", "coWeight"];
        this.attrMap = {
            year: author => [author.year],
            paper: author => [author.paperNo],
            coNumber: author => [author.coauthors.length],
            coWeight: author => author.coauthors.map(ca => ca.weight)
        };
        this.authors = this.$store.state.attribute.authorsFilted;
        this.matchResults= this.$store.state.attribute.matchResults;
        console.log(this.matchResults)

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

        var statistic = {};

        this.authors.forEach(author => {
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
                })

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
                    ...self.attrNames.reduce((result, attrName) => {
                        result[attrName + 'Ave'] = statistic[conf][type][attrName + 'Sum'] / statistic[conf][type][attrName + 'Count'];
                        return result;
                    }, {})
                });
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
                                if(dd.content == 'Conference') {
                                    d3.select(this).classed('conference', true);
                                }
                            } else if (dd.attrName && dd.attrName in self.attrMap) {
                                var svg = d3.select(this).select('svg');
                                if (svg.empty()) {
                                    svg = d3.select(this)
                                        .append('svg')
                                        .attr('class', 'table-column-svg');
                                }

                                var max = rowData[dd.attrName].reduce((max, value) => Math.max(value, max), 0),
                                    min = rowData[dd.attrName].reduce((min, value) => Math.min(value, min), 0);

                                var minOpacity = 0.05;

                                var fillOpacity = rowData[dd.attrName].map(value => (value - min) / (max - min) * (1 - minOpacity) + minOpacity);

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
                .each(function(d, i) {
                    if((i - 1) % 3 != 0) {
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
            d3.select(this)
                .append("div")
                .attr("class", "table-title");
            if (d.type == "text") {
                let title = d3.select(this).select("div.table-title");
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
            } else if (d.type == "pattern") {}
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

        div.table-title {
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
