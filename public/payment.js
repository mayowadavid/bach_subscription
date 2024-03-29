
/* Handle any errors returns from Checkout  */
var handleResult = function (result) {
  if (result.error) {
    var displayError = document.getElementById('error-message');
    displayError.textContent = result.error.message;
  }
};

// Create a Checkout Session with the selected quantity
var createCheckoutSession = function () {
  var quantity = 1;
  return fetch('/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quantity: quantity,
      locale: i18next.language.toLowerCase().split('-')[0],
    }),
  }).then(function (result) {
    return result.json();
  });
};

/* Get your Stripe publishable key to initialize Stripe.js */
fetch('/config')
  .then(function (result) {
    return result.json();
  })
  .then(function (json) {
    window.config = json;
    var stripe = Stripe(config.publicKey);
    // Setup event handler to create a Checkout Session on submit
    document.querySelector('#payNow').addEventListener('click', function (evt) {
      evt.preventDefault();
      $("#pay_rotate").toggle();
      createCheckoutSession().then(function (data) {
        console.log(data);
        $("#pay_rotate").toggle();
        stripe
          .redirectToCheckout({
            sessionId: data.sessionId,
          })
          .then(handleResult);
      });
    });
  });
