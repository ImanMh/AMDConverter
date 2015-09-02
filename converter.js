

(function () {
  var ui_delay_ms = 500;

  $('#detectApi').click(function () {
    resetView();
    var newKeys = detectApi();
    transitionToChooseAPI();
    renderApiStep(newKeys);
  });

  function renderApiStep (newKeys) {
    var tmpl = $('#api-methods-tmpl').html();
    $('#api-methods').empty();

    newKeys.forEach(function (method) {
      var node = tmpl.replace(/\{\{methodName\}\}/g, method);
      $('#api-methods').append($(node));
    });
  }

  function transitionToChooseAPI () {
    var $progress = $('#step-input-progress');
    $progress.removeClass('hidden');
    setTimeout(function () {
      $progress.addClass('hidden');
      $('#step-api').fadeIn();
    }, ui_delay_ms);
  }

  function resetView () {
    $('#step-api, #step-output').hide();
  }

  function detectApi () {
    var initialKeys = Object.keys(window);
    var inputSource = $('#source').val();
    try {
      eval.call(window, inputSource);
    } catch (err) {
      alert('The script you inserted have errors. Please make sure your code is clean before you hit the detect button.');
      throw(err);
    }
    var newKeys = Object.keys(window);
    var diffKeys = getDiff(initialKeys, newKeys);
    return diffKeys;
  }

  function Template (source) {
    this.src = source;
    this.render = function () {
      Array.prototype.forEach.call(arguments, function (placeholder) {
        console.log(placeholder);
      });
      return 'string';
    };
    return this;
  }

  function convertToAMD (body, deps, api) {
    var source = 'define([{{deps}}], function ({{names}}) {\n' +
      '{{body}}\n' +
      'return {\n' +
        '{{api}}\n' +
      '}\n' +
    '});\n';

    var t = new Template(source);
    return t.render({
      deps: deps,
      api: api
    });
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
