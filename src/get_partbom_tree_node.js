"use strict";
var Stack = require("stack-lifo");

//bfs data object containing edges returned from arangodb graph query
const data = require("../data/partbom_edges.json");

// Instance variables
var parents = {};
var idx = 1;
var positionIdx = 1;
var parentsIdx = {};

// GET unique parent with childs list in dict map
for (var j = 0; j < data.length; j++) {
  var keyParent = data[j].parent;
  var valueChilds = [];
  valueChilds.push(data[j].child);
  while (data[j + 1] != null && data[j].parent == data[j + 1].parent) {
    j = j + 1;
    valueChilds.push(data[j].child);
  }

  parents[keyParent] = {
    id: idx,
    children: valueChilds,
    isVisited: false,
  };
  idx++;
}

// Recursion implementation to get indented tree list of edges
function bfs_traversal(data, positionIdx) {
  // base case to exit recursion function
  if (data.length == 0 || data.length == undefined) {
    return;
  }

  // loop through edges
  for (j = 0; j < data.length; j++) {
    var stack = new Stack();
    var parent = data[j].parent;

    // add first child to stack
    stack.push(data[j]);

    // loop through childs and add to stack
    while (data[j + 1] != null && data[j].parent == data[j + 1].parent) {
      j = j + 1;
      stack.push(data[j]);
    }

    // child index starts at 1
    var childIdx = 1;

    // loop through stacked children, unstack until empty, and check if child is a sub-assembly/parent object
    while (!stack.isEmpty()) {
      var tmpChild = stack.pop();
      parentsIdx[tmpChild.child] = positionIdx + "." + childIdx;

      // Print statement for indent tree
      console.log("\t", positionIdx + "." + childIdx, parent, tmpChild.child);

      // Check if child is available in Parents dict object (parents)
      if (tmpChild.child in parents && tmpChild.child == data[j + 1].parent) {
        // append indentation
        var newPositionIdx = positionIdx + "." + childIdx;

        // Insert index position and parent in dict object (parentsIdx)
        parentsIdx[tmpChild.child] = newPositionIdx;

        // loop through recursive function to traverse until end of the depth
        bfs_traversal(tmpChild, newPositionIdx);
      }
      childIdx++;
    }
    // Reset the positionIdx based-on parentsIdx dict object.
    if (data[j + 1] != null && data[j + 1].parent in parentsIdx) {
      console.log(data[j + 1].parent, "is new Sub-assembly: ");
      positionIdx = parentsIdx[data[j + 1].parent];
    }
  }
}

// call the recursive function
console.log();
console.log(bfs_traversal(data, positionIdx));
console.log();
// console.log(parentsIdx);
