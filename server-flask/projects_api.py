from flask import Flask, request, Response
from ConfigParser import SafeConfigParser
import json
from os import path
import urllib

app = Flask(__name__)

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

def create_dash_projects_file(name, projects_data, output_dir):
    """Create the dash projects file"""

    def get_project_data(project):
        vars = []

        for entry in project:
            vars.append([entry, ",".join(project[entry])])
        print(vars)
        return vars

    parser = SafeConfigParser()
    config_file = path.join(output_dir, name + "_gaas.conf")

    fd = open(config_file, 'w')

    sections = []

    for project in projects_data:
        parser.add_section(project)
        project_vars = get_project_data(projects_data[project])
        for var in project_vars:
            parser.set(project, var[0], var[1])

    parser.write(fd)
    fd.close()

@app.route("/api/projects")
def projects():
    """ Return a JSON with all projects data in the dash projects file """
    config_file = "github_test.conf"
    options = read_main_conf(config_file)
    return json.dumps(options)

def check_projects_url(projects):
    """ Check that all urls are valid """
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
    return urls_bad

@app.route("/api/check_projects",methods = ['POST'])
def check_projects():
    """ Check that all projects information is valid, including URLs """
    if request.headers['Content-Type'] == 'application/json':
        print(request.json)
        urls_bad = check_projects_url(request.json)
        if len(urls_bad) == 0:
            return "All URLs are OK"
        else:
            # 502: Bad gateway
            resp = Response(json.dumps(urls_bad), status=502, mimetype='application/json')
            return resp

@app.route("/api/create_projects_file",methods = ['POST'])
def create_projects_file():
    """ Create the dash projects file needed to create the real dash  """
    if request.headers['Content-Type'] == 'application/json':
        print(request.json)
        urls_bad = []
        # urls_bad = check_projects_url(request.json)
        if len(urls_bad) == 0:
            name = "test"
            output_dir = "."
            projects_data = request.json
            create_dash_projects_file(name, projects_data, output_dir)
            return "Created dash project file for " + name + " project"
        else:
            # 502: Bad gateway
            resp = Response(json.dumps(urls_bad), status=502, mimetype='application/json')
            return resp

if __name__ == "__main__":
    app.debug = True
    app.run()
