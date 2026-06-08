# astottaramsa/clustering/karmic_clustering.py

from sklearn.cluster import KMeans
import numpy as np

class KarmicClustering:

    def cluster(self, data):

        model = KMeans(
            n_clusters=3,
            n_init="auto"
        )
        
        # Ensure data is 2D array if it's a list of lists or similar
        arr = np.array(data)
        if len(arr.shape) == 1:
            arr = arr.reshape(-1, 1)
            
        # Avoid error if samples < clusters
        if len(arr) < 3:
            return [0] * len(arr)

        labels = model.fit_predict(arr)

        return labels.tolist()
