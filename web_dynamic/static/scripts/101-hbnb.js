$(document).ready(function () {
  // checks for API availability
  $.get('http://127.0.0.1:5001/api/v1/status/', (res) => {
    if (res.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  }).fail((err) => {
    console.error(err);
    $('#api_status').removeClass('available');
  });

  /* task 100 methods */
  // detects click events for amenities checkbox elements.
  const selectedAmenities = {};
  $('.amenities input[type="checkbox"]').on('click', function () {
    if (this.checked) {
      selectedAmenities[$(this).data('id')] = $(this).data('name');
    } else {
      delete selectedAmenities[$(this).data('id')];
    }
    let msj = Object.values(selectedAmenities).join(', ');
    if (msj.length > 28) {
      msj = msj.slice(0, 28) + '...';
    }
    $('.amenities h4').html(msj.length === 0 ? '&nbsp' : msj);
  });

  // detects click events for cities checkbox elements.
  const selectedCities = {};
  $('.filters .locations .popover ul ul input[type="checkbox"]').on('click', function () {
    if (this.checked) {
      selectedCities[$(this).data('id')] = $(this).data('name');
    } else {
      delete selectedCities[$(this).data('id')];
    }
    let msj = Object.values(selectedCities).join(', ');
    if (msj.length > 28) {
      msj = msj.slice(0, 28) + '...';
    }
    $('.locations h4').html(msj.length === 0 ? '&nbsp' : msj);
  });

  // detects click events for states checkbox elements.
  const selectedStates = {};
  $('.filters .locations .popover ul li  input[type="checkbox"]').on('click', function () {
    if (this.checked) {
      selectedStates[$(this).data('id')] = $(this).data('name');
    } else {
      delete selectedStates[$(this).data('id')];
    }
    let msj = Object.values(selectedStates).join(', ');
    if (msj.length > 28) {
      msj = msj.slice(0, 28) + '...';
    }
    $('.locations h4').html(msj.length === 0 ? '&nbsp' : msj);
  });

  /* task 4 */
  fetchPlaces();

  /* task 5 */
  $('button').click(() => {
    fetchPlaces({
      amenities: Object.keys(selectedAmenities),
      cities: Object.keys(selectedCities),
      states: Object.keys(selectedStates)
    });
  });

  /* task 101 */
  $('.reviews span').on('click', function () {
    console.log('si funciono');
  });

  // function for API request (POST)
  function fetchPlaces (data = {}) {
    $.ajax({
      type: 'POST',
      url: 'http://127.0.0.1:5001/api/v1/places_search',
      data: JSON.stringify(data),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json'
    }).then(function (places) {
      const htmlArray = [];
      for (const place of places) {
        htmlArray.push(`
          <article>
  
            <div class="title_box">
              <h2>${place.name}</h2>
              <div class="price_by_night">${place.price_by_night}</div>
            </div>
  
            <div class="information">
              <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
              <div class="number_rooms">${place.number_rooms} Guest${place.number_rooms !== 1 ? 's' : ''}</div>
              <div class="number_bathrooms">${place.number_bathrooms} Guest${place.number_bathrooms !== 1 ? 's' : ''}</div>
            </div>
  
            <div class="user">
            </div>
  
            <div class="description">
              ${place.description}
            </div>
  
            <div class="reviews">
              <h2 data-id=${place.id}><p style="display:inline">Reviews</p>&nbsp<span data-id=${place.id}>show</span></h2>
              <ul></ul>
            </div>

          </article>`);
      }
      $('section.places').html(htmlArray);

      /* task 101 */
      $('span').click(function () {
        // get place id and select elements inside review class
        const placeId = $(this).data('id');
        const $span = $(this);
        const $ul = $span.parent().siblings('ul');

        if ($span.text() === 'show') {
          $span.text('hide');

          // get user's reviews from API
          $.get(`http://127.0.0.1:5001/api/v1/places/${placeId}/reviews`, function (reviews) {
            console.log(reviews);
            const countReviews = reviews.length;
            console.log(countReviews + 'hola');
            $(`.reviews h2[data-id="${placeId}"] p`).html(countReviews + ` Review${countReviews !== 1 ? 's' : ''}`);
            console.log($(`.reviews h2[data-id="${placeId}"]`).text());
            // $('.reviews h2').text(countReviews + 'Review');
            for (const review of reviews) {
            // $('.reviews h2').text(countReviews + `Review <span data-id=${place.id}>hide</span>`);
              const date = new Date(Date.parse(review.updated_at));
              const day = date.getDate();
              const month = date.toLocaleString('en-US', { month: 'long' });
              const year = date.getFullYear();

              // get user's who made the reviews from API
              $.get(`http://127.0.0.1:5001/api/v1/users/${review.user_id}`, function (user) {
                $ul.append(`
                <li>
                <h3>From ${user.first_name} ${user.last_name} the ${day}th ${month} ${year}</h3>
                <p>${review.text}</p>
                </li>`
                );
              }).fail((error) => { console.err(error); });
            }
          }).fail((err) => { console.err(err); });
        } else {
          $span.text('show');
          $(`h2[data-id="${placeId}"] p`).text('Reviews');
          $ul.empty();
        }
      });
    }).catch(function (errr) {
      console.log(errr);
    });
  }
});
