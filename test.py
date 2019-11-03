import os
import sys

import cv2

from API_Backend.Helpers.function import *
from API_Backend.Helpers.PathConfig import *

root_path = dirname(os.path.realpath(__file__))
GT_folder = FilePaths.groundtruth
for query_file in glob.glob(join(GT_folder, '*_query.txt')):
    query = open(query_file, 'r')
    query_image = query.read().split()[0] + '.jpg'
    img = cv2.imread(join(FilePaths.dataset, query_image.replace('oxc1_', '')))
    modes = ['color', 'edge']
    for mode in modes:
        ret_file_name = 'result_{}_{}.txt'.format(
            query_image.replace('oxc1_', '')[:-4], mode)

        if not exists(join(FilePaths.result, ret_file_name)):
            data_json = find_image(img, mode)
            result = open(join(FilePaths.result, ret_file_name), 'w')
            for line in data_json:
                result.write(line.replace(
                    './data\\', '').replace('.jpg', '')+'\n')
            result.close()
        print(ret_file_name, basename(query_file))
        os.system(FilePaths.exe + ' {} {}'.format(join(root_path, query_file.replace('_query.txt', '')),
         join(join(root_path, FilePaths.result), ret_file_name)))
