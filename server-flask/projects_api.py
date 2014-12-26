import json
from flask import Flask, request
app = Flask(__name__)
from ConfigParser import SafeConfigParser

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

if __name__ == "__main__":
    app.debug = True
    app.run()
