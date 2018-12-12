<template>
    <div class="strucPattern"></div>
</template>

<script>
import * as d3 from "d3";
import connectedComponents from "./connectedComponents.js";
import { clearTimeout } from 'timers';
import * as frePatterns from  "../../../../data/output/publication-0.3.json";
// import * as strucPatternURI from "../../../../data/output/edges-0.5.csv";

function d3ForceCompute(graph) {
    return function(callback) {
        var simulation = d3
            .forceSimulation()
            .force(
                "link",
                d3.forceLink().id(function(d) {
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
    name: "StrucPattern",
    data: () => ({}),
    computed: {},
    methods: {},
    created: function() {},
    mounted: function() {
        // var byteString = atob(strucPatternURI.split(",")[1]);
        // var links = [];
        // byteString.split("\n").forEach(str => {
        //     var [source, target] = str.split(",");
        //     if (source && source.length > 0 && target && target.length > 0) {
        //         links.push({ source, target });
        //     }
        // });
        // var nodeSet = new Set();
        // links.forEach(link => {
        //     nodeSet.add(link.source);
        //     nodeSet.add(link.target);
        // });
        // var nodes = Array.from(nodeSet).map(id => ({ id }));

        // var frePatterns = connectedComponents({
        //     nodes,
        //     links
        // });

        // console.log(frePatterns);

        var w = this.$el.clientWidth,
            h = this.$el.clientHeight,
            n = frePatterns.length,
            x = Math.floor(Math.sqrt((w * n) / h)),
            y = Math.ceil(n / x),
            uw = w / x,
            uh = h / y;

        var svg = d3
            .select(this.$el)
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        for(let i = 1; i < x; i++) {
            svg.append('line')
                .attr('x1', i * uw)
                .attr('x2', i * uw)
                .attr('y1', 0)
                .attr('y2', h)
                .attr('stroke', '#eaecee')
                .attr('stroke-width', 1);
        }

        for(let j = 0; j < y; j++) {
            svg.append('line')
                .attr('y1', j * uh)
                .attr('y2', j * uh)
                .attr('x1', 0)
                .attr('x2', w)
                .attr('stroke', '#eaecee')
                .attr('stroke-width', 1);
        }

        var getFreBarHeight = () => 5;
        var maxFre = frePatterns.reduce((max, v) => Math.max(max, v.freq), 0);
        var getFreBarWidth = (fre) => {
            return fre / maxFre * (uw * 0.8);
        }

        svg.append('clipPath')
            .attr('id', 'cell-clip')
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', uw)
            .attr('height', uh);

        frePatterns.forEach((frePattern, i) => {
            var g = svg
                .append("g")
                .attr(
                    "transform",
                    `translate(${(i % x) * uw}, ${Math.floor(i / x) * uh})`
                )
                .attr('clip-path', 'url(#cell-clip)');

            // g.append('rect')
            // 	.attr('width', uw)
            // 	.attr('height', uh);

            d3ForceCompute(frePattern)(graph => {
				var { nodes, links } = graph;
				
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
                
                
                var diameter = Math.min(uw, uh)  * 0.5;
                for (var i = 0; i < nodes.length; ++i) {
                    if(Math.abs(max_x - min_x) <= 0.01) {
                        nodes[i].x = uw / 2;
                    } else {
                        nodes[i].x = ((nodes[i].x - min_x) / (max_x - min_x)) * diameter + uw / 2 - diameter / 2;
                    }

                    if(Math.abs(max_y - min_y) <= 0.01) {
                        nodes[i].y = uh / 2;
                    } else {
                        nodes[i].y = ((nodes[i].y - min_y) / (max_y - min_y)) * diameter + uh / 2 - diameter / 2;
                    }
                    nodes[i].y -= getFreBarHeight() / 2;
                }

				var lines = g.selectAll('line.line')
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

				var dots = g.selectAll('circle.dot')
					.data(nodes);

				dots.enter()
					.append('circle')
					.attr('class', 'dot')
					.attr('cx', d => d.x)
					.attr('cy', d => d.y)
					.attr('r', Math.min(diameter / 10, 5));
				
                dots.exit().remove();

                var bar = g.append('line')
                    .attr('x1', 0)
                    .attr('x2', getFreBarWidth(graph.freq))
                    .attr('y1', uh - getFreBarHeight() / 2)
                    .attr('y2', uh - getFreBarHeight() / 2)
                    .attr('stroke-width', getFreBarHeight())
                    .attr('stroke', '#FFB300')
                    .attr('stroke-linecap', 'round');
            });
        });
    }
};
</script>

<style lang="scss">
@import "../../../styles/Constants.scss";

.strucPattern {
    flex: 0 0 $PATTERN_FORCED_WIDTH;
    border-style: solid;
    border-width: 1px;
    border-color: $GRAY1;
    height: 100%;
    //width: calc(100% - #{$QUERY_ATTRIBUTE_DISTRIBUTION_HEIGHT});
    width: $PATTERN_FORCED_WIDTH;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    overflow: hidden;
    position: relative;
    overflow: hidden;

	.dot {
        fill: #000;
    }

    .line {
        stroke: #999;
    }
}
</style>
