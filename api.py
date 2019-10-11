from test import *

# send multiple images
# https://stackoverflow.com/questions/44728047/return-multiple-image-files-with-flask


update_corpus()

@app.route('/search', methods=['POST'])
@crossdomain(origin='*')
def upload_file():
    if request.method == 'POST':
        file = request.files['file']
        mode = request.form['mode']
        if file and allowed_file(file.filename):
            img, path = read_image(file)
            data_json = find_image(img, mode)
            return json.dumps({'data': data_json})
    return json.dumps({'data': None})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
