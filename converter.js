

(function () {


  var initialKeys = Object.keys(window);

  require(["inputScripts/test"], function (test) {
    var newKeys = Object.keys(window);
    var diffKeys = getDiff(initialKeys, newKeys);
  });


  function loadScript (srcPath) {
    console.log("loding " + srcPath);
  }

  function getDiff (arr1, arr2) {
    console.log("some diffs found");
    return 'some diffs found';
  }
  
})();
