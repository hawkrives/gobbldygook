import json
with open('./test/sis-degreeaudit.html') as infile:
    data = infile.read()
    with open('./test/sis-degreeaudit.json', 'w+') as outfile:
        outfile.write(json.dumps({'sis': data}))
