/* eslint-env jquery */
$(() => {
  const inputBtn = $('INPUT#btn-amenity');
  const circle = $('DIV#api_status');
  const places = $('DIV SECTION.places');
  const url = 'http://localhost:5001/api/v1/status/';
  const placesSearch = 'http://localhost:5001/api/v1/places_search';
  const myPlaceSearch = { states: [], cities: [], amenities: [] };
  const button = $('SECTION #button');
  const inputBtnState = $('INPUT#btn-state');
  const inputBtnCity = $('INPUT#btn-city');

  inputBtn.change(function () {
    getValueUsingClass();
  });

  inputBtnState.change(function () {
    getStateCityUsingClass();
  });

  inputBtnCity.change(function () {
    getStateCityUsingClass();
  });

  $.get({
    url,
    success: (result, statusText, xhr) => {
      if (xhr.status === 200) {
        circle.css('background', '#ff545f');
        circle.addClass('available');
      } else {
        circle.removeClass('available');
        circle.css('backgroundColor', '#cccccc');
      }
    }
  });

  function resolveAfter2Seconds (data) {
    return new Promise(resolve => {
      $.post({
        url: placesSearch,
        data: JSON.stringify(data),
        contentType: 'application/json',
        dataType: 'json',
        success: function (data) {
          resolve(data);
        }
      });
    });
  }

  asyncCall(myPlaceSearch);
  async function asyncCall (myPlaceSearch) {
    var result = await resolveAfter2Seconds(myPlaceSearch);

    const data = result;
    const names = [];
    data.forEach(place => {
      names.push(place.name.toLowerCase());
    });
    names.sort();
    const op = data.sort(
      (a, b) =>
        names.indexOf(a.name.toLowerCase()) -
          names.indexOf(b.name.toLowerCase()) || b.score - a.score
    );
    places.empty();
    op.forEach(place => {
      places.append(
        $('<article></article>').html(`
  
      <!-- **********************
      BEGIN 1 PLACE
      ********************** -->
  
           <div class="title">
             <h2>${place.name.normalize()}</h2>
  
             <div class="price_by_night">
               ${place.price_by_night}
             </div>
           </div>
           <div class="information">
             <div class="max_guest">
               <i class="fa fa-users fa-3x" aria-hidden="true"></i>
  
               <br />
  
               ${place.max_guest} Guests
             </div>
             <div class="number_rooms">
               <i class="fa fa-bed fa-3x" aria-hidden="true"></i>
  
               <br />
  
               ${place.number_rooms} Bedrooms
             </div>
             <div class="number_bathrooms">
               <i class="fa fa-bath fa-3x" aria-hidden="true"></i>
  
               <br />
  
               ${place.number_bathrooms} Bathroom
             </div>
           </div>
  
           <!-- **********************
    USER
    **********************  -->
           <div class="description">
             <p>${place.description.normalize()}</p>
           </div>
           <div class="reviews">
                  <h2>Reviews <span id="span-id" class="first" data-id="${place.id}">Show</span></h2>
                  <div id="rev" class="active" data-id="${place.id}">
                  ${place.id}
                  </div>
            </div>
         <!-- End 1 PLACE Article -->
      `)
      );
    });
    // expected output: 'resolved'
  }
  $(document.body).on('click', '.reviews', function (e) {
    $(this).find('#span-id').text($(this).find('#span-id').text() === 'Show' ? 'Hide' : 'Show');
    $(this).find('#rev').toggleClass('active');
    const review = $(this).find('#rev');
    review.empty();
    if ($(this).find('#span-id').text() === 'Hide') {
      const placeId = review.attr('data-id');
      const url = `http://localhost:5001/api/v1/places/${placeId}/reviews`;
      $.ajax({
        url: url,
        success: result => {
          if (result.length === 0) {
            review.html('<h4>No Reviews Found!</h4>');
          } else {
            result.forEach(res => {
              const url1 = `http://localhost:5001/api/v1/users/${res.user_id}`;
              $.ajax({
                url: url1,
                success: data => {
                  const fecha = new Date(data.updated_at);
                  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                  review.append(`
                  <ul>
                  <li>
                      <h3>From ${data.first_name} ${data.last_name} the ${fecha.getDay()}th ${months[fecha.getMonth()]} ${fecha.getFullYear()}</h3>
                      <p>
                        ${res.text}
                      </p>
                    </li>
                  </ul>
                `);
                }
              });
            });
          }
        }
      });
    }
  });

  button.on('click', () => {
    const data = {};
    data.amenities = getValueUsingClass();
    data.states = getStateUsingClass();
    data.cities = getCityUsingClass();
    asyncCall(data);
  });
});

function getValueUsingClass () {
  const h4Val = $('DIV.amenities H4');
  const cartId = [];
  const cartName = [];

  $('INPUT#btn-amenity:checked').each(function () {
    cartId.push($(this).attr('data-id'));
    cartName.push($(this).attr('data-name'));
  });
  if (cartName.length > 0) {
    h4Val.text(cartName.join(', '));
  } else {
    h4Val.html('&nbsp;');
  }
  return cartId;
}

function getStateCityUsingClass () {
  const h4Val = $('DIV.locations H4');
  const cartId = [];
  const cartName = [];

  $('INPUT#btn-state:checked').each(function () {
    cartId.push($(this).attr('data-id'));
    cartName.push($(this).attr('data-name'));
  });
  $('INPUT#btn-city:checked').each(function () {
    cartId.push($(this).attr('data-id'));
    cartName.push($(this).attr('data-name'));
  });
  if (cartName.length > 0) {
    h4Val.empty();
    h4Val.append(cartName.join(', '));
  } else {
    h4Val.html('&nbsp;');
  }
}

function getStateUsingClass () {
  const cartId = [];

  $('INPUT#btn-state:checked').each(function () {
    cartId.push($(this).attr('data-id'));
  });
  return cartId;
}

function getCityUsingClass () {
  const cartId = [];

  $('INPUT#btn-city:checked').each(function () {
    cartId.push($(this).attr('data-id'));
  });
  return cartId;
}
