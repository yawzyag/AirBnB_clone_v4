$(() => {
  const inputBtn = $('INPUT#btn-amenity');
  inputBtn.change(function () {
    getValueUsingClass();
  });

  const url = 'http://localhost:5001/api/v1/status/';
  const circle = $('DIV#api_status');

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
});

function getValueUsingClass () {
  const h4Val = $('DIV.amenities H4');

  const cartId = []; const cartName = [];
  $('INPUT#btn-amenity:checked').each(function () {
    cartId.push($(this).attr('data-id'));
    cartName.push($(this).attr('data-name'));
  });
  if (cartName.length > 0) {
    h4Val.text(cartName.join(', '));
  } else {
    h4Val.html('&nbsp;');
  }
}
