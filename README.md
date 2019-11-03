# VISUAL INFORMATION RETRIEVAL

## OXFORD BUILDINGS DATASET
**DATA:** [5K DATASET IMAGES](http://www.robots.ox.ac.uk/~vgg/data/oxbuildings/oxbuild_images.tgz)

**GROUND TRUTH:** [GROUND TRUTH FILES](http://www.robots.ox.ac.uk/~vgg/data/oxbuildings/gt_files_170407.tgz)

## HOW TO RUN

### 1. TO RUN THE PROJECT
Steps to extract features from dataset:
- Put the data need to extract features from to *data* dir. 
- Delete the old *csv* file if using new dataset
- Run file *extract_features.py* to extract features from dataset (this will take a while to finish)
- Run file *run.bat* to turn on the API and open web UI to use

### 2. TO GET THE SCORE OF PROJECT QUERIES COMPARE TO OXFORD BUILDINGS DATASET QUERIES

- Run file *test.py* to get results of queries used in comparison and scores
