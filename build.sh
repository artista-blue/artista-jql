#!/bin/bash

cd "$(dirname "$0")"

npm install

NAME=jql
PEG_FILE=${NAME}.pegjs
NODE_JS_FILE=${NAME}.js
SRC_DIR=src
DIST_DIR=dist
WORK_DIR=work

# build parser
mkdir ${WORK_DIR}
./node_modules/pegjs/bin/pegjs --export-var PEG ${PEG_FILE} ${WORK_DIR}/${NODE_JS_FILE}

# creat dist files
cat ${WORK_DIR}/${NODE_JS_FILE} ${SRC_DIR}/item-filter.js > ${DIST_DIR}/${NODE_JS_FILE}

# test
npm run test

# cleanup
#rm -rf node_modules
rm package-lock.json
rm -rf work
