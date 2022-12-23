$(document).ready(function () {
  $.get('http://127.0.0.1:5001/api/v1/status/', (res) => {
    console.log(res);
    if (res.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  }).fail((err) => {
    console.error(err);
    $('#api_status').removeClass('available');
  });

  const objIds = {};
  $('input[type="checkbox"]').on('click', function () {
    if (this.checked) {
      objIds[$(this).data('id')] = $(this).data('name');
    } else {
      delete objIds[$(this).data('id')];
    }
    let msj = Object.values(objIds).join(', ');
    if (msj.length > 28) {
      msj = msj.slice(0, 28) + '...';
    }
    $('.amenities h4').html(msj.length === 0 ? '&nbsp' : msj);
  });
});
