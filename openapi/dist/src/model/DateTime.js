(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(['ApiClient'], factory);
    } else if (typeof module === 'object' && module.exports) {
      // CommonJS-like environments that support module.exports, like Node.
      module.exports = factory(require('../ApiClient'));
    } else {
      // Browser globals (root is window)
      if (!root.HardenizeOrgApi) {
        root.HardenizeOrgApi = {};
      }
      root.HardenizeOrgApi.Datetime = factory(root.HardenizeOrgApi.ApiClient);
    }
}(this, function(ApiClient) {
    'use strict';
      
    var exports = function(raw) {
      var _this = this;
  
  
      _this['raw'] = raw;
    };
  
    exports.constructFromObject = function(data, obj) {
        if (data) {
            obj = obj || new exports();

            obj['raw'] = data;
            if (typeof data === 'string') {
                obj['raw'] = data;
            }
            return obj;
        };
    };

    exports.prototype['raw'] = undefined;

    return exports;
}));
