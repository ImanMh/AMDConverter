(function () {
  var ui_delay_ms = 500;

  $('#detectApi').click(function () {
    resetView();
    var inputSource = $('#source').val();
    var newKeys = detectApi(inputSource);
    transitionToChooseAPI();
    renderApiStep(newKeys);
    $(this).prop('disabled', true);
  });

  $('#convert-script').click(function () {
    var scriptBody = $('#source').val();
    var deps = $('#deps').val();
    var names = $('#names').val();
    var chosenMethods = $('#step-api [type=checkbox]:checked');
    var apiMethods = [];
    chosenMethods.each(function (i, checkbox) {
      var $checkbox = $(checkbox);
      if ($checkbox.prop('checked') === true)
        apiMethods.push($checkbox.data('var-name'));
    });

    var converted = convertToAMD(scriptBody, deps, names, apiMethods);
    $('#output-code').html(converted);
    transitionToOutput();

  });

  $('#newScript').click(function () {
    document.location = '/';
  });

  function transitionToOutput () {
    var $progress = $('#step-api-progress');
    $progress.removeClass('hidden');
    setTimeout(function () {
      $progress.addClass('hidden');
      $('#step-output').fadeIn();
    }, ui_delay_ms);
  }

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

  function detectApi (source) {
    var initialKeys = Object.keys(window);
    try {
      eval.call(window, source);
    } catch (err) {
      alert('The script you inserted have errors. Please make sure your code is clean before you hit the detect button.');
      throw(err);
    }
    var newKeys = Object.keys(window);
    var diffKeys = getDiff(initialKeys, newKeys);
    return diffKeys;
  }

  function convertToAMD (body, deps, names, api) {
    var source = 'define({{deps}}, function ({{names}}) {\n' +
      '{{body}}\n' +
      'return {\n' +
        '{{api}}\n' +
      '}\n' +
    '});\n';
    var apiMethods = "";

    source = source.replace('{{body}}', body);
    source = source.replace('{{deps}}', JSON.stringify(deps.split(',')));
    source = source.replace('{{names}}', names.split(','));
    api.forEach(function (method, i) {
      if (i == api.length - 1)
        apiMethods += method + ': ' + method + '\n';
      else
        apiMethods += method + ': ' + method + ',\n';

    });
    source = source.replace('{{api}}', apiMethods);

    return source;
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
