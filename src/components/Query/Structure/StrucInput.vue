<template>
    <div class="strucInput">
      <button class="apply0"  v-on:click="sendStruct" >Search</button>
    </div>
</template>

<script>
import d3v2 from "./d3.v2";

var drawSketchView = $el => {
    let container = d3v2.select($el);
    var width = $el.clientWidth,
        height = $el.clientHeight,
        fill = d3v2.scale.category20();
    // mouse event vars
    var selected_node = null,
        selected_link = null,
        mousedown_link = null,
        mousedown_node = null,
        mouseup_node = null;

    // init svg
    var outer = container
        .insert("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .attr("pointer-events", "all");

    var vis = outer
        .append("svg:g")
        .call(d3v2.behavior.zoom().on("zoom", rescale))
        .on("dblclick.zoom", null)
        .append("svg:g")
        .on("mousemove", mousemove)
        .on("mousedown", mousedown)
        .on("mouseup", mouseup);

    vis.append("svg:rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "white");

    // init force layout
    var force = d3v2.layout
        .force()
        .size([width, height])
        .nodes([{}]) // initialize with a single node
        .linkDistance(50)
        .charge(-200)
        .on("tick", tick);

    // line displayed when dragging new nodes
    var drag_line = vis
        .append("line")
        .attr("class", "drag_line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", 0);

    // get layout properties
    var nodes = force.nodes(),
        links = force.links(),
        node = vis.selectAll(".node"),
        link = vis.selectAll(".link");

    // add keyboard callback
    d3v2.select(window).on("keydown", keydown);

    redraw();

    // focus on svg
    // vis.node().focus();

    function mousedown() {
        if (!mousedown_node && !mousedown_link) {
            // allow panning if nothing is selected
            vis.call(d3v2.behavior.zoom().on("zoom"), rescale);
            return;
        }
    }

    function mousemove() {
        if (!mousedown_node) return;

        // update drag line
        drag_line
            .attr("x1", mousedown_node.x)
            .attr("y1", mousedown_node.y)
            .attr("x2", d3v2.svg.mouse(this)[0])
            .attr("y2", d3v2.svg.mouse(this)[1]);
    }

    function mouseup() {
        if (mousedown_node) {
            // hide drag line
            drag_line.attr("class", "drag_line_hidden");

            if (!mouseup_node) {
                // add node
                var point = d3v2.mouse(this),
                    node = { x: point[0], y: point[1] },
                    n = nodes.push(node);

                // select new node
                selected_node = node;
                selected_link = null;

                // add link to mousedown node
                links.push({ source: mousedown_node, target: node });
            }

            redraw();
        }
        // clear mouse event vars
        resetMouseVars();
    }

    function resetMouseVars() {
        mousedown_node = null;
        mouseup_node = null;
        mousedown_link = null;
    }

    function tick() {
        link.attr("x1", function(d) {
            return d.source.x;
        })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });

        node.attr("cx", function(d) {
            return d.x;
        }).attr("cy", function(d) {
            return d.y;
        });
    }

    // rescale g
    function rescale() {
        trans = d3v2.event.translate;
        scale = d3v2.event.scale;

        vis.attr(
            "transform",
            "translate(" + trans + ")" + " scale(" + scale + ")"
        );
    }

    // redraw force layout
    function redraw() {
        link = link.data(links);

        link.enter()
            .insert("line", ".node")
            .attr("class", "link")
            .on("mousedown", function(d) {
                mousedown_link = d;
                if (mousedown_link == selected_link) selected_link = null;
                else selected_link = mousedown_link;
                selected_node = null;
                redraw();
            });

        link.exit().remove();

        link.classed("link_selected", function(d) {
            return d === selected_link;
        });

        node = node.data(nodes);

        node.enter()
            .insert("circle")
            .attr("class", "node")
            .attr("r", 5)
            .on("mousedown", function(d) {
                // disable zoom
                vis.call(d3v2.behavior.zoom().on("zoom"), null);

                mousedown_node = d;
                if (mousedown_node == selected_node) selected_node = null;
                else selected_node = mousedown_node;
                selected_link = null;

                // reposition drag line
                drag_line
                    .attr("class", "link")
                    .attr("x1", mousedown_node.x)
                    .attr("y1", mousedown_node.y)
                    .attr("x2", mousedown_node.x)
                    .attr("y2", mousedown_node.y);

                redraw();
            })
            .on("mousedrag", function(d) {
                // redraw();
            })
            .on("mouseup", function(d) {
                if (mousedown_node) {
                    mouseup_node = d;
                    if (mouseup_node == mousedown_node) {
                        resetMouseVars();
                        return;
                    }

                    // add link
                    var link = { source: mousedown_node, target: mouseup_node };
                    links.push(link);

                    // select new link
                    selected_link = link;
                    selected_node = null;

                    // enable zoom
                    vis.call(d3v2.behavior.zoom().on("zoom"), rescale);

                    redraw();
                }
            })
            .transition()
            .duration(750)
            .ease("elastic")
            .attr("r", 6.5);

        node.exit()
            .transition()
            .attr("r", 0)
            .remove();

        node.classed("node_selected", function(d) {
            return d === selected_node;
        });

        if (d3v2.event) {
            // prevent browser's default behavior
            d3v2.event.preventDefault();
        }

        force.start();
    }

    function spliceLinksForNode(node) {
        toSplice = links.filter(function(l) {
            return l.source === node || l.target === node;
        });
        toSplice.map(function(l) {
            links.splice(links.indexOf(l), 1);
        });
    }

    function keydown() {
        if (!selected_node && !selected_link) return;
        switch (d3v2.event.keyCode) {
            case 8: // backspace
            case 46: {
                // delete
                if (selected_node) {
                    nodes.splice(nodes.indexOf(selected_node), 1);
                    spliceLinksForNode(selected_node);
                } else if (selected_link) {
                    links.splice(links.indexOf(selected_link), 1);
                }
                selected_link = null;
                selected_node = null;
                redraw();
                break;
            }
        }
    }

    function getStructure() {
      var nodesArr = [], linksArr =[]
      for (let i=0;i<nodes.length;i++){
        nodesArr.push(i)
      }
      var linksArr = links.map(d=>[d.source.index,d.target.index])
        return {
          nodesArr,
          linksArr
        };
    }
    return getStructure;
};
import axios from 'axios'

export default {
    name: "StrucInput",
    data: {
      getStructure : null
    },
    computed: {},
    methods: {
      sendStruct: function(){
        var res = this.getStructure()
        var nodes = res.nodesArr
        var links = res.linksArr
        var name = this.$store.state.attribute.authorsFilted.map(d=>d.author)
        var rela ={}
        this.$store.state.attribute.authorsRelation.forEach(d=>{ rela[d.author] = d.coauthors})
        axios.post('http://127.0.0.1:5000/knnQuery', { search_nodes:nodes, search_links:links,name:name, rela:rela})
          .then((d) =>{
            console.log(d.data)
            this.$store.commit("getMatchResults", d.data);
          })
      }

    },
    created: function() {},
    mounted: function() {
        this.getStructure = drawSketchView(this.$el);
    }
};
</script>

<style lang="scss">
@import "../../../styles/Constants.scss";

.apply0 {
  width: 20%;
  position: relative;
  top: 290px;
  left: 350px;
  justify-content: center;
  align-items: center;
  display: flex;
  height: 24px;
  font-size: 14px;
  color: #777;
  padding: 0 10px;
  margin: 0 5px;
  background-color: $GRAY0;
  border: 1px solid $GRAY3;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 200ms, color 200ms;

  &:hover {
    background-color: $GRAY1;
  }

}
.strucInput {

    flex: 0 0 calc(100% - #{$PATTERN_FORCED_WIDTH});
    border-style: solid;
    border-width: 1px;
    border-color: $GRAY1;
    height: 100%;
    width: calc(100% - #{$PATTERN_FORCED_WIDTH});
    //width: $PATTERN_FORCED_WIDTH;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    overflow: hidden;
    .node {
        fill: #000;
        cursor: crosshair;
    }

    .node_selected {
        fill: #ff7f0e;
        stroke: #ff7f0e;
    }

    .drag_line {
        stroke: #999;
        stroke-width: 5;
        pointer-events: none;
    }

    .drag_line_hidden {
        stroke: #999;
        stroke-width: 0;
        pointer-events: none;
    }

    .link {
        stroke: #999;
        stroke-width: 5;
        cursor: crosshair;
    }

    .link_selected {
        stroke: #ff7f0e;
    }
}
</style>
