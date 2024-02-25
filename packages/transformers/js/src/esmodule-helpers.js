exports.interopDefault = function (a) {
  return a && a.__esModule ? a : {default: a};
};

exports.defineInteropFlag = function (a) {
  Object.defineProperty(a, '__esModule', {value: true});
};

exports.exportAll = function (source, dest) {
  Object.keys(source).forEach(function (key) {
    if (
      key === 'default' ||
      key === '__esModule' ||
      Object.prototype.hasOwnProperty.call(dest, key)
    ) {
      return;
    }

    Object.defineProperty(dest, key, {
      enumerable: true,
      configurable: true,
      get: function () {
        return source[key];
      },
    });
  });

  return dest;
};

exports.export = function (dest, destName, get) {
  Object.defineProperty(dest, destName, {
    enumerable: true,
    get: get,
    configurable: true,
  });
};
