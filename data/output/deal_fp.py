import json

prefix = '/Users/jackie/Repository/Graph-Query/data/output/'
filename = 'publication-0.7'
fp = open(prefix + filename + '.fp', 'r')
patterns = []
pattern = {}
for line in fp:
    strs = line.split('\n')[0].split(' ')
    print(strs)
    if strs[0] == 't':
        pattern = {}
        pattern['id'] = int(strs[2])
        pattern['freq'] = int(strs[4])
        pattern['nodes'] = []
        pattern['links'] = []
    elif strs[0] == 'v':
        pattern['nodes'].append({
            'id': strs[1],
            'value': strs[2]
        })
    elif strs[0] == 'e':
        pattern['links'].append({
            'source': strs[1],
            'target': strs[2],
            'value': strs[3]
        })
    elif strs[0] == 'x':
        pattern['x'] = strs
        patterns.append(pattern)

with open(prefix + filename + '.json', 'w') as outfile:
    json.dump(patterns, outfile)
