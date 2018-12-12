# coding=utf-8
from flask import Flask, jsonify, request, json
from flask_cors import CORS
from knn import back_test


url = "bolt://localhost:7687"
user = 'neo4j'
password = 'vis2018'
host = '0.0.0.0'
port = 1234
nbrs = {}
res = {}
result = {}
app = Flask(__name__)
CORS(app, supports_credentials = True)
opt = ''


@app.route('/knnQuery', methods = ['POST'])
def knn_query():
	## 传入{search_nodes:[],search_links:[]}
	k = 325
	cos_min = 0.1209
	max_num = 2
	min_num = 0.5
	search_nodes = [0, 1, 2]
	global result
	dic = request.get_json()

	if 'k' in dic:
		k = dic['k']
	if 'cos_min' in dic:
		cos_min = float(dic['cos_min'])
	if 'search_nodes' in dic:
		search_nodes = dic['search_nodes']
	if 'maxNumber' in dic:
		max_num = dic['maxNumber']
	if 'minNumber' in dic:
		min_num = dic['minNumber']
	if 'search_links' in dic:
		links = dic['search_links']
	if 'search_links' in dic:
		search_links = dic['search_links']
	print('search_nodes', search_nodes)
	print('k', k)
	print('cos_min', cos_min)
	search_nodes = list(map(lambda x: int(x), search_nodes))
	sub_knn, sub_graphs, knn_nodes, type_graph, knn_type_graphs, simi_obj, zzz, knn_nodes_graph = back_test(
		search_nodes, k, cos_min, max_num, min_num, search_links)
	print(sub_knn, sub_graphs, knn_nodes, type_graph, knn_type_graphs, simi_obj, zzz, knn_nodes_graph )

if __name__ == '__main__':
	app.run(host = host, port = 1250)
