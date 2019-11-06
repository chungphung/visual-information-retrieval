import csv

import numpy as np
from scipy import spatial


class Searcher:
    def __init__(self, indexPath):
        self.indexPath = indexPath

    def search(self, queryFeatures, limit=25, algo='chi2'):
        results = {}
        with open(self.indexPath) as f:
            reader = csv.reader(f)
            for row in reader:
                features = [float(x) for x in row[1:]]
                if algo == 'chi2':
                    d = self.chi2_distance(features, queryFeatures)
                else:
                    d = self.distance(features, queryFeatures)
                results[row[0]] = d
            f.close()
        results = sorted([(v, k) for (k, v) in results.items()])
        return results[:limit]

    def chi2_distance(self, histA, histB, eps=1e-10):
        return 0.5 * np.sum([((a - b) ** 2) / (a + b + eps)
                          for (a, b) in zip(histA, histB)])

    def distance(self, v1, v2):
        return spatial.distance.cosine(v1, v2)
