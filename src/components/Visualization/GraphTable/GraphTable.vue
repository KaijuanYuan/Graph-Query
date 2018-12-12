<template>
    <div id="graphtable">
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
    created: function() {
        // console.log({...this.$store.state.attribute})
        this.attributes = this.$store.state.attribute.authorsFilted;
        const year = { ...this.$store.state.attribute.year };
        const paper = { ...this.$store.state.attribute.paper };
        const coNumber = { ...this.$store.state.attribute.coNumber };
        const coWeight = { ...this.$store.state.attribute.coWeight };
        console.log({ year, paper, coNumber, coWeight });
        // this.attributes = [year, paper, coNumber, coWeight];
    },
    mounted: function() {
        let titleColor = d3.scaleOrdinal()
            .domain([0,1,2,3])
            .range(['#ffffff', '#d7efe2', "#e4f0fe", "#fdf0d4"]);

        let columnTitles = [
            {
                content: "Journal",
                type: "text",
                group: 0
            },
            {
                content: "Topics",
                type: "text",
                group: 0
            },
            {
                content: "Edge Weight",
                type: "text",
                group: 1
            },
            {
                content: "Cooperations",
                type: "text",
                group: 2
            },
            {
                content: "Publications",
                type: "text",
                group: 2
            },
            {
                content: "H-index",
                type: "text",
                group: 2
            },
            {
                content: "Cited",
                type: "text",
                group: 2
            }
        ];

        var tableTitles = d3
            .select("#graphtable")
            .selectAll("div.table-column")
            .data(columnTitles);

        tableTitles
            .enter()
            .append("div")
            .attr("class", "table-column");
        tableTitles.exit().remove();

        d3.selectAll("div.table-column").each(function(d) {
            d3.select(this).append('div').attr('class', 'table-title');
            d3.select(this).append('div').attr('class', 'table-content');
            if (d.type == "text") {
                let title = d3.select(this).select('div.table-title');
                title.text(d.content);
                title.attr('style', `background-color: ${titleColor(d.group)}; border: 1px solid #eee; box-sizing: border-box;`);
            } else if (d.type == "pattern") {
            }
        });

        console.log("GraphTable Mounted", { ...this.attributes[0] });
        var weightStat = this.attributes.reduce((stat, article) => {
            article.coauthors.forEach(ca => {
                stat[ca.weight] = stat[ca.weight] ? stat[ca.weight] : 0;
                stat[ca.weight] += 1;
            });
            return stat;
        }, {});
        console.log("weight statistic", weightStat);
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
div#graphtable {
    flex: 1;
    display: flex;
    div.table-column {
        flex: 1;
        display: flex;
        flex-direction: column;
        div.table-title {
            width: 100%;
            height: 60px;
            line-height: 60px;
        }
        div.table-content {
            width: 100%;
            flex: 1;
        }
    }
}
</style>
