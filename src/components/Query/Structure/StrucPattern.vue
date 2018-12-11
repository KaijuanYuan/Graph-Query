<template>
    <div class="strucPattern"></div>
</template>

<script>
import * as d3 from "d3";
import connectedComponents from './connectedComponents.js';
// import * as graph from  "../../../../data/output/gen_data.json";
import * as strucPatternURI from "../../../../data/output/edges-0.5.csv";
export default {
    name: "StrucPattern",
    data: () => ({}),
    computed: {},
    methods: {},
    created: function() {},
    mounted: function() {
		var byteString = atob(strucPatternURI.split(",")[1]);
		var links = [];
		byteString.split("\n").forEach(str => {
			var [source, target] = str.split(',');
			if(source && source.length > 0 && target && target.length > 0) {
				links.push({source, target});
			}
		});
		var nodeSet = new Set();
		links.forEach(link => {
			nodeSet.add(link.source);
			nodeSet.add(link.target);
		});
		var nodes = Array.from(nodeSet);
		var graph = {
			nodes,
			links
		}
		console.log(graph);
		console.log(connectedComponents(graph));
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
}
</style>
