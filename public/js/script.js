$('.btn-login').on('click', function () {
  $('.modal-container').removeClass('hidden');
});

$('.btn-close').on('click', function () {
  $('.modal-container').addClass('hidden');
});

$(window).on('click', function (e) {
  if (e.target == $('.modal-container')[0])
    $('.modal-container').addClass('hidden');
});
