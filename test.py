import argparse
import glob
import json
from datetime import timedelta
from functools import update_wrapper
from os.path import basename, exists, join

import cv2
from flask import (Flask, current_app, jsonify, make_response, request,
                   send_file)
from werkzeug.utils import secure_filename

from colordescriptor import ColorDescriptor
from edge import Edge
from PathConfig import FilePaths
from searcher import Searcher
import multiprocessing

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = FilePaths.upload

# initialize the image descriptor
cd = ColorDescriptor((8, 12, 3))
ed = Edge()


class InvalidUsage(Exception):
    status_code = 500

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def read_image(object):
    filename = secure_filename(object.filename)
    path = join(app.config['UPLOAD_FOLDER'], filename)
    object.save(path)
    image = cv2.imread(path)
    return image, path


def crossdomain(origin=None, methods=None, headers=None, max_age=21600,
                attach_to_all=True, automatic_options=True):
    """Decorator function that allows crossdomain requests.
      Courtesy of
      https://blog.skyred.fi/articles/better-crossdomain-snippet-for-flask.html
    """
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    # use str instead of basestring if using Python 3.x
    if headers is not None and not isinstance(headers, list):
        headers = ', '.join(x.upper() for x in headers)
    # use str instead of basestring if using Python 3.x
    if not isinstance(origin, list):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        """ Determines which methods are allowed
        """
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        """The decorator function
        """

        def wrapped_function(*args, **kwargs):
            """Caries out the actual cross domain code
            """
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers
            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            h['Access-Control-Allow-Credentials'] = 'true'
            h['Access-Control-Allow-Headers'] = \
                "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)

    return decorator


def feature_extration(imagePath):
    imageID = basename(imagePath)
    image = cv2.imread(imagePath)

    # describe the image
    features = desc.describe(image)

    # write the features to file
    features = [str(f) for f in features]
    return


def index_data(idx_file, desc):

    # use glob to grab the image paths and loop over them
    file_list = glob.glob(join(FilePaths.dataset, '*'))
    l = len(file_list)
    count = 0
    for imagePath in file_list:
        # extract the image ID (i.e. the unique filename) from the image
        # path and load the image itself
        imageID = basename(imagePath)
        image = cv2.imread(imagePath)

        # describe the image
        features = desc.describe(image)

        # write the features to file
        features = [str(f) for f in features]
        idx_file.write("%s,%s\n" % (imageID, ",".join(features)))
        count += 1
        print(count/l*100)


def update_corpus():
    assert exists(FilePaths.dataset)
    if not exists(FilePaths.color_index):
        idx_file = open(FilePaths.color_index, 'w')
        index_data(idx_file, cd)
        idx_file.close()
    if not exists(FilePaths.edge_index):
        idx_file = open(FilePaths.edge_index, 'w')
        index_data(idx_file, ed)
        idx_file.close()


def get_image_path(results):
    paths = []
    for (score, resultID) in results:
        # load the result image and display it
        paths.append(join(FilePaths.dataset, resultID))
    return paths


def find_image(query, mode):

    # load the query image and describe it
    color_features = cd.describe(query)
    edge_features = ed.describe(query)

    # perform the search
    if mode == 'color':
        color_searcher = Searcher(FilePaths.color_index)
        color_results = color_searcher.search(color_features)
        paths = get_image_path(color_results)
    elif mode == 'edge':
        edge_searcher = Searcher(FilePaths.edge_index)
        edge_results = edge_searcher.search(edge_features)
        paths = get_image_path(edge_results)
    return paths
