

(function () {


  var initialKeys = Object.keys(window);

  loadScript('test').then(function () {
    var newKeys = Object.keys(window);
    var diffKeys = getDiff(initialKeys, newKeys);
    console.log("Diffs are");
    console.log(diffKeys);
  });


  function loadScript (srcPath) {
    console.log("loding " + srcPath);
    var scriptLoadingDfd = $.Deferred();

    require(["inputScripts/" + srcPath], function (test) {
      scriptLoadingDfd.resolve();
    });

    return scriptLoadingDfd.promise();
  }

  function getDiff (origArr, newArr) {
    var diffArray = [];
    newArr.forEach(function (key) {
      if (origArr.indexOf(key) == -1)
          diffArray.push(key);
    });

    return diffArray;
  }

})();
