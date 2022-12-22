$(document).ready(function () {
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
