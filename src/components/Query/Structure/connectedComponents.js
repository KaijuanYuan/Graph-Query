import Map2 from './Map2';
var init = function(graph) {
    var connectedComponents = [];
    // var unexploredLinks = new Set(graph.links.map(link => link.source + '+' + link.target));
    var unexploredNodes = new Map(graph.nodes.map(node => [node.id, node]));
    var nodeAdjEdges = {};
    var adj = {};
    graph.links.forEach(link => {
        nodeAdjEdges[link.source] = nodeAdjEdges[link.source] ? nodeAdjEdges[link.source] : new Map2();
        nodeAdjEdges[link.target] = nodeAdjEdges[link.target] ? nodeAdjEdges[link.target] : new Map2();
        adj[link.source] = adj[link.source] ? adj[link.source] : new Set();
        adj[link.target] = adj[link.target] ? adj[link.target] : new Set();
        if(link.source != link.target) {
            adj[link.source].add(link.target);
            adj[link.target].add(link.source);
            nodeAdjEdges[link.source].set([link.source, link.target], link);
            nodeAdjEdges[link.target].set([link.source, link.target], link);
        }
    });
    
    // var link = graph.links[0];
    
    while(unexploredNodes.size > 0) {
        var connectedNodes = new Map(), connectedLinks = new Map2();
        var node = Array.from(unexploredNodes)[0][1];
        console.log('node', node);
        extract(adj, node, unexploredNodes, connectedNodes);
        connectedNodes.forEach(node => {
            nodeAdjEdges[node.id].forEach((link, key) => {
                connectedLinks.set(key, link);
            });
        })
        connectedComponents.push({
            nodes: Array.from(connectedNodes).map(node => node[1]),
            links: connectedLinks.values()
        });
    }
    return connectedComponents;
};

var extract = function(adj, node, unexploredNodes, connectedNodes) {
    connectedNodes.set(node.id, node);
    unexploredNodes.delete(node.id);
    adj[node.id].forEach(n => {
        if(unexploredNodes.has(n)) {
            extract(adj, unexploredNodes.get(n), unexploredNodes, connectedNodes);
        }
    })
}

export default init;