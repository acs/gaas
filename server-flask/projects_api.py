import json
from flask import Flask, request, Response
app = Flask(__name__)
from ConfigParser import SafeConfigParser
import urllib

def read_main_conf(conf_file):
    options = {}

    parser = SafeConfigParser()
    fd = open(conf_file, 'r')
    parser.readfp(fd)
    fd.close()

    sec = parser.sections()
    for s in sec:
        options[s] = {}
        opti = parser.options(s)
        for o in opti:
            # first, some special cases
            if o in ('source','trackers'):
                data_sources = parser.get(s,o).split(',')
                options[s][o] = [ds.replace('\n', '') for ds in data_sources]
            else:
                options[s][o] = parser.get(s,o)

    return options

@app.route("/api/projects")
def projects():
    config_file = "github_test.conf"
    options = read_main_conf(config_file)
    return json.dumps(options)

@app.route("/api/check_projects",methods = ['POST'])
def check_projects():
    """ Check that all projects information is valid, including URLs """
    if request.headers['Content-Type'] == 'application/json':
        print(request.json)
        urls_bad = []
        urls = []
        projects = request.json
        # Time to check all URLs
        for project in projects:
            for url in projects[project]['source']:
                urls.append(url)
            for url in projects[project]['trackers']:
                urls.append(url)
            for url in urls:
                if urllib.urlopen(url.replace('"','')).getcode() != 200:
                    urls_bad.append(url)
        if len(urls_bad) == 0:
            return "JSON Message: " + json.dumps(request.json)
        else:
            # 502: Bad gateway
            resp = Response(json.dumps(urls_bad), status=502, mimetype='application/json')
            return resp


if __name__ == "__main__":
    app.debug = True
    app.run()
