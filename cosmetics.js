/*
* Para carrito *

$(document).ajaxComplete(function(event, xhr, settings) {
  // Code to execute after every AJAX call
  console.log('AJAX call completed', settings.url);
  // Additional actions can be performed here, like updating UI elements, etc.
});

/v4/cart/add
/v4/cart/delete
/v4/cart/qty

*/

function getPageType() {

    let isCheckout = window.location.pathname == '/checkout';

    if (isCheckout) return 'checkout';

    let isProductPage = document.getElementById("add_to_cart-btn");

    let cartIsOpen = document.getElementById("cart-sidenav").checkVisibility();

    return cartIsOpen 
    
        ? 'cart'

        : isProductPage 
        
            ? 'product'

            : 'list';

}

function getProductBasePrize() {

    let rawPrize = document.getElementsByClassName('product-vip__price-value')[0].innerHTML.trim();

    let prize = Number(rawPrize.split(',')[0].replaceAll('$', '').replaceAll('.',''));

    return prize;

}

function buildProductPrizeBlock(basePrize) {

    let moneyParser = new Intl.NumberFormat('es-AR');

    let noDiscount = moneyParser.format(basePrize);

    let cashDiscount = moneyParser.format(basePrize - (basePrize * 0.1));

    let bulkDiscount = moneyParser.format(basePrize - (basePrize * 0.2));

    let result = [];

    let baseLine = (prize, desc, style="") => `<p class="product-vip__price uk-flex uk-flex-middle text--primary" ${style}><span class="product-vip__price-value">$${prize} ${desc}</span></p>`;

    let styleLine = 'style="background-color:#00A86B; color:white"';

    result.push(baseLine(noDiscount, "tarjeta - 3 cuotas sin interes"));

    result.push(baseLine(cashDiscount, "efectivo / transferencia"));

    result.push(baseLine(bulkDiscount, "mayorista", styleLine));

    return result;

}

function replaceProductPricing(basePrize) {

    let block = buildProductPrizeBlock(basePrize);

    let startingBlock = u(document.getElementsByClassName('product-vip__price')[0]);

    startingBlock.after(block[2]);

    startingBlock.after(block[1]);

    startingBlock.replace(block[0]);

}

window.onload = (event) => {

  const enabled = localStorage.getItem("ekeko");

  if (!enabled)  {

    console.debug("Ekeko updates disabled");

    return;

  }

  console.debug("Page loaded correctly");

  let pageType = getPageType();

  console.debug("Page type:", pageType);

  if (pageType === 'product') {

    let basePrize = getProductBasePrize();

    console.debug('Product base prize:', basePrize);

  }

};
