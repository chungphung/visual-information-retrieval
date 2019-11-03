from os.path import dirname, join, realpath


class FilePaths:
    root = dirname(realpath(__file__))
    print(root)
    "filenames and paths to data"
    color_index = join(root, 'color_index.csv')
    edge_index = join(root, 'edge_index.csv')
    dataset = join(dirname(root), 'Data')
    upload = join(dirname(root), 'Upload')
    groundtruth = join(dirname(root), 'GroundTruth/groundtruth')
    result = join(dirname(root), 'Result')
    exe = join(groundtruth, 'compute_ap.exe')
