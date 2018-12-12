# coding=utf-8
from sklearn.neighbors import NearestNeighbors
import networkx as nx
import os
import numpy as np
import copy
import time
from pymongo import MongoClient
import networkx as nx
import random
import json
from scipy.sparse import csr_matrix, csgraph
from fun.gk_weisfeiler_lehman import compare

from sklearn.cluster import DBSCAN


class GlobalV:
	mark_history = []
	matrix = np.array([])  # 当前的
	knn_nodes = []
	nbrs = []
	vectors = []  # 当前的vectors
	matrix_l = 0
	search_l = 0
	index_to_id = {}  # int->int
	id_to_index = {}  # int->int
	file_vector = "./data/emb/twitter_80k.embchange"
	file_graph = "./data/graph/twitter_combinede.edgelistchange"
	start_time = ""
	knn_nodes_list = []
	knn_nodes_np = np.array([])
	nodes = []  # 当前的点
	max_k = 0
	k_arr = []
	creat_k = 0  # 当前算好的最大的k
	first_read = 1
	cos_min = 0.01
	group = 0.01


gl = GlobalV()


def bisect_ch(a, x, lo = 0, hi = None):
	if lo < 0:
		raise ValueError('lo must be non-negative')
	if hi is None:
		hi = len(a)
	while lo < hi:
		mid = (lo + hi) // 2
		if a[mid] <= x:
			lo = mid + 1
		else:
			hi = mid
	return lo


def sub_knn_graph(matrix, knn_nodes_list, search_nodes, max_num, min_num, f = True):
	stack = list(set(knn_nodes_list))
	stack = np.array(stack)

	if len(stack) == 0:
		return {}
	ma = matrix[stack[:, None], stack]

	num, label = csgraph.connected_components(ma, directed = False)

	# G = nx.from_numpy_matrix(ma)

	r = {}
	for i in range(len(label)):
		if str(label[i]) not in r:
			r[str(label[i])] = []
		r[str(label[i])].append(int(stack[i]))
	r = sorted(r.items(), key = lambda item: len(item[1]), reverse = True)

	k = 0
	res = {}
	ls = len(search_nodes)
	print('sub_knn_num 原有', len(r))
	if f:
		for i, v in r:
			lv = len(v)
			if len(v) >= max_num:
				continue
			if len(v) < min_num:
				break
			res[str(k)] = v
			k += 1
	else:
		return r[0][1]
	# print(' len(search_nodes)', len(search_nodes))
	print('sub_knn_num', len(res.keys()))
	# for i in res.values():
	# 	print('num', len(i))
	return res  # 排序好，去除一个


def sub_knn_graph_match_new(gl, search_nodes_arg, knn_nodes_graph, distant, vectors = []):
	draw_f = True
	if vectors == []:
		draw_f = False
	match_label = {}
	save_nodes = set([])
	r = {}
	rz = 0
	# knn_nodes_graph 已经排好序 去掉只有一个点的了
	search_nodes_arg_np = np.array(search_nodes_arg)
	# search_nodes_arg_ma = gl.matrix[search_nodes_arg_np[:, None], search_nodes_arg_np].toarray()
	# for i in range(len(search_nodes_arg)):
	#
	for ii in knn_nodes_graph.keys():
		sub_list = copy.copy(knn_nodes_graph[ii])  ## 当前的子图
		# sub_set = set(sub_list)  ## 当前的子图
		# if len(i) < 2:  # len(search_nodes_arg):#knn的子图多一点
		# 	continue
		r[str(rz)] = {}
		match_label[str(rz)] = {}
		d = {}
		# sub_list_np = np.array(sub_list)
		# sub_list_ma = gl.matrix[sub_list_np[:,None],sub_list_np].toarray()
		for a_i in range(len(search_nodes_arg)):  # 找两两之间最小值
			a = search_nodes_arg[a_i]
			d[a] = {}
			# a_degree = len(np.where(search_nodes_arg_ma[a_i]==1)[0])
			for b_i in range(len(sub_list)):
				b = sub_list[b_i]
				# b_degree = len(np.where(sub_list_ma[b_i] == 1)[0])
				# if len(distant) == 0:
				if draw_f:
					vector1 = vectors[a]  # 这里是新的向量
					vector2 = gl.vectors[b]
					# if gl.dis == 'e':
					# 	d[a][b] = np.linalg.norm(vector1 - vector2)
					# else:
					d[a][b] = 0.5 + 0.5 * np.dot(vector1, vector2) / (
							np.linalg.norm(vector1) * (np.linalg.norm(vector2)))

				# 	d[a][b] = 100
				else:
					if a in distant and str(b) in distant[a]:
						d[a][b] = distant[a][str(b)]
					else:
						d[a][b] = 100
			# if b_degree-a_degree>0:
			# 	d[a][b] = math.sqrt(b_degree-a_degree)
			# else:
			# 	d[a][b] = abs(b_degree-a_degree)
			d[a] = sorted(d[a].items(), key = lambda item: item[1])
		search_index_list = list(range(len(search_nodes_arg)))
		sub_l = 0
		while sub_l != len(sub_list):
			for j in range(len(search_index_list)):  # 当前应该搜的原图点顺序
				node_old = search_nodes_arg[search_index_list[j]]  # 当前原图点
				for vl in range(len(d[node_old])):  # 在最短list里面找没有被选走的sub_knn点
					v = d[node_old][vl][0]
					if v in save_nodes:
						continue
					if str(node_old) not in r[str(rz)]:
						r[str(rz)][str(node_old)] = []
					r[str(rz)][str(node_old)].append(int(v))  # 添加进来
					match_label[str(rz)][int(v)] = int(node_old)
					save_nodes.add(v)  #
					sub_l += 1
					del d[node_old][vl]
					break
				t = search_index_list[j]
				del search_index_list[j]
				search_index_list.append(t)
				break
		rz += 1
	return r, match_label

def init():
	global gl
	gl.vectors = np.load('./data/author_ma_vetor.npy')
	gl.matrix = np.load('./data/author_ma.npy')
def back_test(search_nodes, k, cos_min, max_num, min_num, links):
	time_start0 = time.clock()
	global gl
	gl.max_num = max_num
	gl.min_num = min_num
	# nbrs = NearestNeighbors(n_neighbors = k, algorithm = "auto", metric = 'cosine').fit(gl.vectors)
	search_nodes_one = []
	if type(search_nodes[0]) == list:
		a = np.array(search_nodes)
		l = a.max() + 1
		ma = np.zeros((l, l), dtype = 'int')
		for i in search_nodes:
			search_nodes_one.extend(i)
			ma[i[0], i[1]] = ma[i[1], i[0]] = 1
		search_nodes = search_nodes_one
	else:
		m_search = np.array(search_nodes)
		ma = np.zeros((len(search_nodes), len(search_nodes)), dtype = int)
		for i in range(len(links)):
			ma[links[i][0], links[i][1]] = 1
			ma[links[i][1], links[i][0]] = 1
		# ma = gl.matrix[m_search[:, None], m_search].toarray()
		a = np.array(nx.from_numpy_matrix(ma).edges())
	time_start_read = time.clock()
	np.savetxt('./data/graphlets_test_csv.npz', a, fmt = '%d')
	os.system('RAGE.exe ./data/graphlets_test_csv.npz')
	f2 = './Results/UNDIR_RESULTS_.csv'
	tmp = np.loadtxt(f2, dtype = np.str, delimiter = ",")
	data = tmp[1:, 0:len(tmp[0]) - 1].astype('int64')
	vectors_obj = {}
	vectors_list = []
	for i in data:
		vector = i[1:]
		vectors_obj[search_nodes[i[0]]] = vector
		vectors_list.append(vector)
	print('train', time.clock() - time_start_read)

	time_start_read = time.clock()
	gl.nbrs = NearestNeighbors(n_neighbors = len(gl.vectors), algorithm = "auto", metric = 'cosine').fit(
		gl.vectors)
	distances, knn_nodes = gl.nbrs.kneighbors(vectors_list)
	max_e = np.max(distances)
	min_e = np.min(distances)

	gl.knn_nodes_set = set([])
	for i in range(len(vectors_list)):
		index = bisect_ch(distances[i], (max_e - min_e) * cos_min + min_e)
		if index > k:
			index = k
		gl.knn_nodes_set = gl.knn_nodes_set | set(knn_nodes[i][0:index])
	print('knn', time.clock() - time_start_read)
	# gl.knn_nodes_set &= gl.nodes_set
	gl.type_graph = gl_search_nodes_extract(gl, ma, search_nodes, 'draw')  # 直接用id 去查vector
	gl.search_nodes_id = copy.copy(search_nodes)
	gl.search_nodes = search_nodes
	gl.search_nodes_ma = ma
	gl.search_l = len(search_nodes)
	knn_nodes_graph = sub_knn_graph(gl.matrix, gl.knn_nodes_set, search_nodes, gl.max_num, gl.min_num)
	gl.knn_graph_match, mathch_label = sub_knn_graph_match_new(gl, search_nodes, knn_nodes_graph, [], vectors_obj)
	gl.sub_graph = {}
	gl.knn_type_graphs = [[]] * len(gl.knn_graph_match.keys())

	r = {}
	for i in range(len(gl.type_graph['type_list'])):
		for j in gl.type_graph['type_list'][i]:
			r[j] = i

	for i, v in gl.knn_graph_match.items():
		gl.knn_type_graphs[int(i)] = []
		for ii in range(len(gl.type_graph['type_list'])):
			gl.knn_type_graphs[int(i)].append([])
		for j, vj in v.items():
			gl.knn_type_graphs[int(i)][r[int(j)]].extend(vj)  # !!!

	simi_obj = {}
	time_start1 = time.clock()
	for i, v in knn_nodes_graph.items():
		v_np = np.array(v)
		labels = []
		for j in v:
			labels.append(mathch_label[i][j])
		v_ma = gl.matrix[v_np[:, None], v_np]
		labels_set = set(labels)
		search_nodes_now = list(filter(lambda x: x in labels_set, search_nodes))
		search_nodes_now_np = np.array(search_nodes_now)
		search_nodes_now_ma = gl.matrix[search_nodes_now_np[:, None], search_nodes_now_np]
		simi_obj[str(i)] = compare(search_nodes_now_ma, v_ma, search_nodes_now, labels)
	# simi_obj[str(i)] = compare(gl.search_nodes_ma, v_ma, search_nodes, labels)
	print('simi time', time.clock() - time_start1)
	simi_obj = sorted(simi_obj.items(), key = lambda item: item[1], reverse = True)
	r = {}
	rz = 0
	gl.simi_obj = {}
	for i in simi_obj:
		idd = i[0]
		v = i[1]
		r[str(rz)] = gl.knn_graph_match[str(idd)]
		gl.simi_obj[str(rz)] = v
		rz += 1
	gl.knn_graph_match = r
	print('sum time', time.clock() - time_start0)
	zzz = 0
	for i, v in gl.simi_obj.items():
		zzz += float(v)
	if gl.simi_obj:
		zzz = zzz / len(gl.simi_obj)
	print('simi avg', zzz)
	return gl.knn_graph_match, gl.sub_graph, {}, gl.type_graph, gl.knn_type_graphs, gl.simi_obj, zzz, knn_nodes_graph


def gl_dbscan(gl, nodes):
	time1 = time.clock()
	vectors = []
	for i in nodes:
		# vector[i] = np.array(gl.vectors[i])
		vectors.append(gl.vectors[i])
	# print(nodes)
	dbs = DBSCAN(eps = gl.group, min_samples = 2,
	             metric = 'euclidean', metric_params = None, algorithm = 'auto', leaf_size = 30, p = None,
	             n_jobs = 1).fit(vectors)
	# dbs = DBSCAN(eps = 0.0001, min_samples = 2,
	#              metric = 'euclidean', metric_params = None, algorithm = 'auto', leaf_size = 30, p = None,
	#              n_jobs = 1).fit(vectors)
	print('dbscan_time', time.clock() - time1)

	label_graph = dbs.fit_predict(vectors)
	r = {}
	for i in range(len(label_graph)):
		n = nodes[i]
		label = label_graph[i]
		if label not in r:
			r[label] = []
		r[label].append(n)
	label_arr = []
	if -1 in r:
		for i in r[-1]:
			label_arr.append([i])
		del r[-1]
	label_arr.extend(list(r.values()))

	print('graph num', len(label_arr))
	return label_arr


def gl_search_nodes_extract(gl, matrix, nodes, opt = ''):  # 这里search_node 是id
	nodes = list(map(lambda x: int(x), nodes))
	res = {'type_list': [], 'type_links': [], 'node_links': []}
	label_arr = gl_dbscan(gl, nodes)
	res['type_list'] = label_arr
	node_to_type = {}
	for i in range(len(label_arr)):
		for j in label_arr[i]:
			node_to_type[j] = i
	# for i in range(len(nodes) - 1):
	# 	for j in range(i + 1, len(nodes)):
	# 		# if nodes[i] in knn_list[j] or nodes[j] in knn_list[i]:
	# 		vector1 = vector[nodes[i]]
	# 		vector2 = vector[nodes[j]]
	# 		if gl.dis == 'c':
	# 			cos_d = np.dot(vector1, vector2) / (np.linalg.norm(vector1) * (np.linalg.norm(vector2)))
	# 			if 1 - abs(cos_d) < cos_min:
	# 				if find(nodes[i]) != find(nodes[j]):
	# 					f[find(nodes[i])] = find(nodes[j])
	# 		else:
	# 			if gl.dis == 'e':
	# 				e_d = np.linalg.norm(vector1 - vector2)
	# 				if e_d < cos_min:
	# 					if find(nodes[i]) != find(nodes[j]):
	# 						f[find(nodes[i])] = find(nodes[j])
	# 			else:
	# 				print(gl.dis + '!!!!!!!!!!!!!!!!!!!!!164')
	# r = {}
	# for i, v in f.items():
	# 	root = find(v)
	# 	if root not in r:
	# 		r[root] = []
	# 	r[root].append(i)
	# res = {'type_list': [], 'type_links': [], 'node_links': []}
	# k = 0
	# types = {}
	# for i, v in r.items():
	# 	res['type_list'].append(v)
	# 	types[i] = k
	# 	k += 1
	if opt == 'draw':
		ma = matrix
	else:
		ma = matrix[np.array(nodes)[:, None], np.array(nodes)].toarray()
	x_arr, y_arr = np.where(ma == 1)
	link_set = set([])
	type_set = set([])
	for i in range(len(x_arr)):
		x = int(nodes[x_arr[i]])
		y = int(nodes[y_arr[i]])
		if str(x) + '+' + str(y) not in link_set and str(y) + '+' + str(x) not in link_set:
			link_set.add(str(x) + '+' + str(y))
			res['node_links'].append({'source': x, 'target': y})
			x_type = int(node_to_type[x])
			y_type = int(node_to_type[y])
			if x_type != y_type and str(x_type) + '+' + str(y_type) not in type_set and str(y_type) + '+' + str(
					x_type) not in type_set:
				type_set.add(str(x_type) + '+' + str(y_type))
				res['type_links'].append({'source': x_type, 'target': y_type})

	return res


if __name__ == '__main__':
	search_nodes = [0, 1, 2, 3, 4]
	k = 100
	cos_min = 0.01
	max_num = 100
	min_num = 5
	links = [[0, 1], [0, 2], [0, 3], [0, 4]]
	init()
	res = back_test(search_nodes, k, cos_min, max_num, min_num, links)
	print(res)
