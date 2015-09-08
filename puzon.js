(function(factory) {
    if (typeof define === "function" && define.amd) {
        define(["backbone", "underscore"], factory);
    }
}(function(Backbone, _) {

    function Puzon(options) {
    }

    Puzon.prototype.sit = function() {
      console.log('sitting...');
    };

    return Puzon;
}));
