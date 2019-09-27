$(() => {
  const inputBtn = $('.INPUT#btn-amenity');
  inputBtn.change(function () {
    getValueUsingClass();
  });
});

function getValueUsingClass () {
  const h4Val = $('DIV.amenities H4');

  const cartId = []; const cartName = [];
  $('INPUT#btn-amenity:checked').each(function () {
    cartId.push($(this).attr('data-id'));
    cartName.push($(this).attr('data-name'));
  });
  h4Val.text(cartName.join(', '));
}
