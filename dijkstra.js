

$(document).ready(function(){
	loadDefaultGraph();
	handleInput();
	$('#graphInput').on('input',handleInput);
	$('#startVectis').on('input',handleInput);
});


function loadDefaultGraph(){
	var graph = [];
	graph.push(new Edge('A','B',15));
	graph.push(new Edge('A','C',7));
	graph.push(new Edge('C','B',4));
	graph.push(new Edge('B','D',2));
	graph.push(new Edge('C','D',12));
	graph.push(new Edge('B','A',3));
	graph.push(new Edge('D','E',12));
	graph.push(new Edge('E','A',12));
	var json = JSON.stringify(graph,null,'\t');
	$("#graphInput")[0].value=json;

}

function Edge(_vec1,_vec2, _cost){
	this.from = _vec1;
	this.to = _vec2;
	this.cost = _cost;	
}

function readInput(){
	var input = $('#graphInput')[0].value;
	return JSON.parse(input);
}

function findCheapeatPathsDijkstra(start, graph){
	var visited = new Array();	
	var result = createResultArray(start,graph);	
	
	var queue = new Queue();
	queue.enqueue(start);
	while(queue.peek()!=undefined)
	{
		var node = queue.dequeue();
		visited.push(node);
		graph.forEach( function(edge, index) {

			if(edge.from ==node){
				if(!visited.includes(edge.to)){
					queue.enqueue(edge.to);
				}

				var targetNodeResult = getNode(result,edge.to);
				//compare the current cost to the to-node and the cost to go from from-node to to-node
				var newPathCost = edge.cost + getNode(result,edge.from).cost;
				if(newPathCost < targetNodeResult.cost){
					targetNodeResult.from = edge.from;
					targetNodeResult.cost = newPathCost;
				}
			}
		});
	}
	return result;
}



function resultNode(_node,_from,_cost)
{
	this.node=_node;
	this.from = _from;
	this.cost = _cost;
}

function getNode(result, node){
	for (var i = result.length - 1; i >= 0; i--) {
		if(result[i].node==node)
			return result[i];
	}
};

function createResultArray(start, graph)
{
	var result = [];
	result.push(new resultNode(start,start,0));
	graph.forEach( function(edge, index) {		
		if(!containsVectis(result,edge.from)){
			result.push(new resultNode(edge.from,edge.from,Number.MAX_SAFE_INTEGER));
		}
		if(!containsVectis(result,edge.to)){
			result.push(new resultNode(edge.to,edge.to,Number.MAX_SAFE_INTEGER));
		}
	});
	//console.log(result);
	return result;
}

function handleInput(){
	var start = $('#startVectis')[0].value;
	var graphJSON = $('#graphInput')[0].value;
	var graph = JSON.parse(graphJSON);

	var result = findCheapeatPathsDijkstra(start,graph);
	var paths = buildPath(start, result);
	$('#displayStartVectis')[0].textContent = $('#startVectis')[0].value;
	$('#resultPaths')[0].value= JSON.stringify(paths, null,'\t');

}

function buildPath(start, result)
{
	
	var paths = new Array(result.length);
	result.forEach( function(nodeResult, index) {
		var description = "";
		var path;
		if(nodeResult.cost >= Number.MAX_SAFE_INTEGER-1){
			paths[index] = "No path goes to "+ nodeResult.node;
			return;
		}

		path = new Array();
		path.push(nodeResult.node);
		var timeoutCounter = result.length*20;
		while (path[0]!=start) {
			path.unshift(getNode(result,path[0]).from);
			timeoutCounter--;	
			
		}
		
		for (var i = 0; i < path.length-1; i++) {
			description+=path[i]+" -> ";
		}
		description+=path[path.length-1];
		description+=" cost: "+nodeResult.cost;
		paths[index]=description;
	});
	return paths;
		
}

function handleEdge(result, edge)
{
	// if(containsVectis(result,edge.to)==false)
	// 	result.push(new resultNode(edge.to,edge.from,))
}

function containsVectis(result,vectis)
{
	for (var i = 0; i < result.length; i++) {
		if(result[i].node ==vectis)
			return true;
	}
	return false;
}

