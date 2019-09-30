/* eslint-env jquery */
$(() => {
  const inputBtn = $('INPUT#btn-amenity');
  const circle = $('DIV#api_status');
  const places = $('DIV SECTION.places');
  const url = 'http://localhost:5001/api/v1/status/';
  const placesSearch = 'http://localhost:5001/api/v1/places_search';

  const data = { states: [], cities: [], amenities: [] };

  inputBtn.change(function () {
    getValueUsingClass();
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

  $.post({
    url: placesSearch,
    data: JSON.stringify(data),
    contentType: 'application/json',
    dataType: 'json',
    success: function (data) {
      const names = [];
      data.forEach(place => {
        names.push(place.name.toLowerCase());
      });
      names.sort();
      console.log(names);
      const op = data.sort(
        (a, b) =>
          names.indexOf(a.name.toLowerCase()) -
            names.indexOf(b.name.toLowerCase()) || b.score - a.score
      );

      op.forEach(place => {
        places.append(
          $('<article></article>').html(`

        <!-- **********************
        BEGIN 1 PLACE
        ********************** -->

             <div class="title">
               <h2>${place.name}</h2>

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
               <p>${place.description}</p>
             </div>
           <!-- End 1 PLACE Article -->
 
        `)
        );
      });
    }
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
