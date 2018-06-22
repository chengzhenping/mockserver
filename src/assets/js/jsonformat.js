const jsonStringify = function (data, space) {
  var seen = [];
  return JSON.stringify(data, function (key, val) {
    if (!val || typeof val !== 'object') {
      return val;
    }
    if (seen.indexOf(val) !== -1) {
      return '[Circular]';
    }
    seen.push(val);
    return val;
  }, space);
};
export default jsonStringify