$(document).ready(function () {
  const module = (() => {
    function init() {
      console.log('init module');
      initFormValidator();
    }

    function initFormValidator() {
      $('#application-form').validate({
        rules: {
          name: {
            required: true,
            minlength: 2,
          },
          alias: {
            required: true,
            isAlias: true,
          },
        },
      });
    }

    return { init: init };
  })();

  module.init();
});
