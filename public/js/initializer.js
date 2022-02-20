$(document).ready(function () {
  const module = (() => {
    function init() {
      showNotifications();
      initValidator();
      initBootstrapSwitch();
    }

    function initValidator() {
      $.validator.setDefaults({
        errorElement: 'span',
        errorPlacement: function (error, element) {
          error.addClass('invalid-feedback');
          element.closest('.form-group').append(error);
        },
        highlight: function (element, errorClass, validClass) {
          $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
          $(element).removeClass('is-invalid');
        },
      });

      $.validator.addMethod(
        'isAlias',
        function (value, element) {
          return /^[a-zA-Z0-9_-]+$/.test(value);
        },
        'This field accepts only aA-zZ, 0-9 and _ -',
      );
    }

    function initBootstrapSwitch() {
      $('input[data-bootstrap-switch]').each(function () {
        $(this).bootstrapSwitch('state', $(this).prop('checked'));
      });
    }

    function showNotifications() {
      const notificationInput = $('#base-edge-notifications');

      if (!notificationInput) {
        return;
      }
      try {
        const notifications = JSON.parse(notificationInput.val());
        console.log(notifications);
        Object.keys(notifications).map((key) => {
          notifications[key].map((message) => {
            toastr[key](message);
          });
        });
      } catch (err) {}
    }

    return { init: init };
  })();

  module.init();
});
