$(document).ready(function () {
  $.get('http://127.0.0.1:5001/api/v1/status/', (res) => {
    // console.log(res);
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

  $.ajax({
    type: 'POST',
    url: 'http://127.0.0.1:5001/api/v1/places_search',
    data: '{}',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json'
  }).then(function (places) {
    for (const place of places) {
      console.log(place);
      $('section.places').append(`
        <article>

          <div class="title_box">
            <h2>${place.name}</h2>
            <div class="price_by_night">$${place.price_by_night}</div>
          </div>

          <div class="information">
            <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
            <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
            <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
          </div>

          <div class="user">
          </div>

          <div class="description">
            ${place.description}
          </div>

        </article>`);
    }
  }).catch(function (err) {
    console.log(err);
  });
});
