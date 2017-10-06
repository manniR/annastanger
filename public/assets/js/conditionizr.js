/*! conditionizr v4.5.0 | (c) 2014 @toddmotto, @markgdyr | https://github.com/conditionizr */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.conditionizr = factory();
  }
})(this, function () {

  'use strict';

  var conditionizr = {};
  var assets;

  conditionizr.config = function (config) {
    assets = config.assets || '';
    for (var prop in config.tests) {
      conditionizr[prop] && load(prop, config.tests[prop]);
    }
  };

  conditionizr.add = function (prop, fn) {
    conditionizr[prop] = typeof fn === 'function' ? fn() : fn;
  };

  conditionizr.on = function (prop, fn) {
    (conditionizr[prop] || /\!/.test(prop) && !conditionizr[prop.slice(1)]) && fn();
  };

  conditionizr.load = conditionizr.polyfill = function (file, props) {
    for (var i = props.length; i--;) {
      conditionizr[props[i]] && load(file, [/\.js$/.test(file) ? 'script' : 'style'], true);
    }
  };

  function load (prop, tasks, external) {
    for (var i = tasks.length; i--;) {
      run(tasks[i]);
    }
    function run (task) {
      var file;
      var path = external ? prop : assets + prop + (task === 'style' ? '.css' : '.js');
      switch (task) {
      case 'script':
        file = document.createElement('script');
        file.src = path;
        break;
      case 'style':
        file = document.createElement('link');
        file.href = path;
        file.rel = 'stylesheet';
        break;
      case 'class':
        document.documentElement.className += ' ' + prop;
        break;
      }
      !!file && (document.head || document.getElementsByTagName('head')[0]).appendChild(file);
    }
  }

  return conditionizr;

});

/*!
 * Chrome
 * We return `!!window.chrome` to test the truthy value,
 * but Opera 14+ responds true to this, so we need to test
 * the `navigator.vendor` to make sure it's from Google
 */
conditionizr.add('chrome', !!window.chrome && /google/i.test(navigator.vendor));

/*!
 * Safari
 * The only browser where the HTMLElement
 * contains `Constructor`
 */
conditionizr.add('safari', /Constructor/.test(window.HTMLElement));

/*!
 * Firefox
 * Evaluate the presence of `InstallTrigger`
 */
conditionizr.add('firefox', 'InstallTrigger' in window);

/*!
 * IE11
 * RegExp to check out the new IE UserAgent:
 * Trident/7.0; rv:11.0
 */
conditionizr.add('ie11', /(?:\sTrident\/7\.0;.*\srv:11\.0)/i.test(navigator.userAgent));

/*!
 * IE10
 * @cc_on Conditional Compilation to test the
 * JavaScript version and MSIE 10 in the UserAgent
 */
conditionizr.add('ie10', !!(Function('/*@cc_on return document.documentMode===10@*/')()));

/*!
 * IE9
 * @cc_on Conditional Compilation to test the
 * JavaScript version and MSIE 9 in the UserAgent
 */
conditionizr.add('ie9', !!(Function('/*@cc_on return (/^9/.test(@_jscript_version) && /MSIE 9\.0(?!.*IEMobile)/i.test(navigator.userAgent)); @*/')()));
