////////////////// IMPORTS /////////////////////

const fs = require('fs'),
      config = require('@config'),
      Log = require('@log');

///////// GET TREE FROM CLOC OUTPUT //////////

/**
 * Convert a simple json object into another specifying children as an array
 * Works recursively
 *
 * example input:
 * { a: { b: { c: { size: 12 }, d: { size: 34 } }, e: { size: 56 } } }
 * example output
 * { name: a, children: [
 *   { name: b, children: [
 *     { name: c, size: 12 },
 *     { name: d, size: 34 }
 *   ] },
 *   { name: e, size: 56 }
 * ] } }
 */

function getChildren(json) {
  var children = [];
  if (json.language) return children;
  for (var key in json) {
    var child = { name: key };
    if (typeof json[key].size !== 'undefined') {
      // value node
      child.size = json[key].size;
      child.language = json[key].language;
      child.blank = json[key].blank;
      child.comment = json[key].comment;
    } else {
      // children node
      var childChildren = getChildren(json[key]);
      if (childChildren) child.children = childChildren;
    }
    children.push(child);
    delete json[key];
  }
  return children;
}

function clocToTree(clocData) {
  delete clocData.header
  delete clocData.SUM

  var json = {}
  Object.keys(clocData).forEach(key => {
    var filename = key;
    if (!filename) return;
    var elements = filename.split(/[\/\\]/);
    var current = json;
    elements.forEach(function(element) {
      if (!current[element]) {
        current[element] = {};
      }
      current = current[element];
    });
    const file = clocData[key]
    current.language = file.language;
    current.size = file.code;
    current.blank = file.blank;
    current.comment = file.comment;
  })

  json = getChildren(json)[0];
  json.name = 'root';

  return json;
}

function getTree(ctrl) {
  const repoDir = config.paths.repo(ctrl.repo.repoId)
  const file = `${repoDir}/${config.cloc.dataFile}`
  return fs.promises.readFile(file, 'utf-8')
    .then(clocData => clocToTree(JSON.parse(clocData)))
    .catch(err => {
      if (err.code === 'ENOENT')
        // if cloc did not create a file (e.g., because there are no
        // code files in the repo), create dummy json
        return {
          name: "root",
          children: []
        }
      else
        throw new Error(err)
    })
}

///////// GET IGNORED FILES FROM CLOC OUTPUT //////////

function cleanIgnoredFiles(ignoredFiles) {
  return ignoredFiles
    .filter(el => el.file !== 'repo')
    .map(el => ({
      ...el,
      file: el.file.replace('repo', '')
    }))
}

function getIgnored(ctrl) {
  const repoDir = config.paths.repo(ctrl.repo.repoId)
  const file = `${repoDir}/${config.cloc.ignoredFile}`
  return fs.promises.readFile(file, 'utf8')
    .then(ignored => cleanIgnoredFiles(JSON.parse(ignored)))
}

///////////// UNITE TREE AND IGNORED FILES /////////

// converts a cloc file to json
function convertClocFileToJson(ctrl) {
  Log(2, '6. Converting Cloc File To Json');
  ctrl.onUpdate('\nConverting cloc file to json...');

  return Promise.all([
    getTree(ctrl),
    getIgnored(ctrl)
  ]).then(([tree, ignored]) => {
    ctrl.repo.cloc = {
      tree,
      ignored
    };
    return ctrl;
  });
}

//////////// EXPORTS //////////////

module.exports = convertClocFileToJson;
