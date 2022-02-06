/* Author: Mohan Raj */

$(function () {
  "use strict";

  //Replace with Retina Resolution images
  $('img.retina').retina({
    suffix: "@2x",
    checkIfImageExists: true
  });

  $('.dropdown-toggle-remote').click(function (e) {
    console.log('clicked');
    var targetMenuClass = $(e.currentTarget).attr('data-menu-class');
    if ((targetMenuClass !== null) && ($('.' + targetMenuClass).length !== 0)) {
      if ($('.list-menu-open').length > 0) {
        $('.dropdown-toggle-remote').not(e.currentTarget).parents('.dropdown').removeClass('open');
        $('.list-menu:not(.' + targetMenuClass + ')').removeClass('list-menu-open');
      }
      $(e.currentTarget).parents('.dropdown').toggleClass('open');
      $('.' + targetMenuClass).toggleClass('list-menu-open');
    }
  });

 $('#form-table-details').validate();
  $('#form-customer-details').validate();

  $('#form-table-details .btn-red').click(function (e) {
    console.log('clicked');
    $('#form-table-details').submit();
  });

  $('#form-customer-details .btn-redWine').click(function (e) {
    console.log('clicked');
    $('#form-customer-details').submit();
  });

});


