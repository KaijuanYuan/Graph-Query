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
    data: () => ({}),
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
        console.log({ ...this.$store.state.attribute
        });
        this.authors = this.$store.state.attribute.authorsFilted;

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
                attrName: "year"
            },
            {
                content: "Publications",
                type: "text",
                attrName: "paper"
            },
            {
                content: "Coauthors",
                type: "text",
                attrName: "coNumber"
            },
            {
                content: "Cooperation Times",
                type: "text",
                attrName: "coWeight"
            }
        ];

        var tableTitles = d3
            .select("#graphtable .table-titles")
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
            } else if (d.type == "pattern") {}
        });

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
                    return result;
                }, {});

            this.attrNames.forEach(attrName => {
                for (var i = 0; i < this[attrName].options.length; i++) {
                    var statis = statistic[conference][type][
                        attrName
                    ];
                    this.attrMap[attrName](author).forEach(value => {
                        if (value >= this[attrName].options[i].leftRange) {
                            if ((i == this[attrName].options.length - 1 && value == this[attrName].options[i].rightRange) ||
                                value < this[attrName].options[i].rightRange) {
                                statis[i]++;
                            }
                        }
                    });
                }
            });
        });

        var dataTable = [];
        Object.keys(statistic).forEach(conf => {
            Object.keys(statistic[conf]).sort().forEach(type => {
                dataTable.push({
                    conference: conf,
                    type: type,
                    ...statistic[conf][type]
                });
            });
        });

        var rowWidth = d3.select(".table-contents").node().clientWidth,
            rowHeight = 50;

        var rows = d3.select('.table-contents')
            .selectAll(".table-row")
            .data(dataTable);

        rows.enter()
            .append('div')
            .attr('class', 'table-row')
            .attr('style', d => `height: ${rowHeight}px`);

        rows.exit().remove();

        rows = d3.select('.table-contents')
            .selectAll(".table-row");

        var self = this;

        var diameter = -1, padding = -1;

        rows.each(function (rowData) {
            var row = d3.select(this);
            var columns = row.selectAll('.table-column').data(columnTitles);
            columns.enter().append('div').attr('class', 'table-column');
            columns.exit().remove();

            row.selectAll('.table-column')
                .each(function (dd) {
                    if (dd.content == 'Conference' || dd.content == 'Type') {
                        d3.select(this).text(rowData[dd.attrName]);
                        d3.select(this)
                            .attr('style', `line-height: ${ rowHeight }px`)
                    } else if (dd.attrName && dd.attrName in self.attrMap) {
                        var svg = d3.select(this)
                            .append('svg')
                            .attr('class', 'table-column-svg');

                        var max = rowData[dd.attrName].reduce((max, value) => Math.max(value, max), 0),
                            min = rowData[dd.attrName].reduce((min, value) => Math.min(value, min), 0);

                        var minOpacity = 0.05;

                        rowData[dd.attrName] = rowData[dd.attrName].map(value => (value - min) / (max - min) * (1 - minOpacity) + minOpacity);

                        var bars = svg.selectAll('.bar')
                            .data(rowData[dd.attrName]);

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
    },
    updated: function () {
        console.log('graphtable updated!');
    },
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
        height: 60px;
        display: flex;
        border-bottom: 2px solid #dadada;

        div.table-title {
            flex: 1;
            line-height: 60px;
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
        }
    }
}
</style>
