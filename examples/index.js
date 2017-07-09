/**
 * @file examples index
 * @author panyuqi (pyqiverson@gmail.com)
 */

/* eslint-disable fecs-no-require */

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

cleanAllExamples();

function getExamples() {
    return fs.readdirSync(__dirname)
        .filter(readdirItem => fs.statSync(path.join(__dirname, readdirItem)).isDirectory());
}

function cleanAllExamples() {
    let examplesDistPathNames = getExamples()
        .map(exampleName => path.join(__dirname, exampleName, 'dist'));

    for (let path of examplesDistPathNames) {
        fs.stat(path, (err, stat) => {
            if (err) {
                return;
            }
            if (stat.isDirectory()) {
                rimraf.sync(path);
            }
        });
    }
}

exports.getExamples = getExamples;
exports.cleanAllExamples = cleanAllExamples;
