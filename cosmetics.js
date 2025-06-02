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



const HELPER = {

    BUSINESS: {

        CONSTANTS: {

            CART: 'cart',

            CHECKOUT: 'checkout',

            LIST: 'list',

            PRODUCT: 'product'

        },

        SETTINGS: {

            cartEnabled: false,

            checkoutEnabled: false,

            listEnabled: false,

            productEnabled: true,

            cashDiscount: 0.1,

        },

        cashDiscount: (basePrize) => basePrize - (basePrize * BUSINESS.SETTINGS.cashDiscount),

    },

    HTML: {

        CART: {

        },

        CHECKOUT: {

        },

        LIST: {

        },


        PRODUCT: {

            buildProductPrizeBlock: (basePrize) => {

                let moneyParser = new Intl.NumberFormat('es-AR');

                let noDiscount = moneyParser.format(basePrize);

                let cashDiscount = moneyParser.format(HELPER.BUSINESS.cashDiscount(basePrize));

                let result = [];

                let baseLine = (prize, desc, style="") => `<p class="product-vip__price uk-flex uk-flex-middle text--primary" ${style}><span class="product-vip__price-value">$${prize} ${desc}</span></p>`;

                let styleLine = 'style="background-color:#00A86B; color:white"';

                result.push(baseLine(cashDiscount, "efectivo / transferencia", styleLine));

                result.push(baseLine(noDiscount, "tarjeta - 3 cuotas sin interes"));

                return result;

            },

            replaceProductPricing : (basePrize) => {

                let block = HELPER.HTML.buildProductPrizeBlock(basePrize);

                let startingBlock = u(document.getElementsByClassName('product-vip__price')[0]);

                startingBlock.after(block[2]);

                startingBlock.after(block[1]);

                startingBlock.replace(block[0]);

            },

        }

    }, 

    QUERIES: {

        getProductBasePrize: () => {

            let rawPrize = document.getElementsByClassName('product-vip__price-value')[0].innerHTML.trim();

            let prize = Number(rawPrize.split(',')[0].replaceAll('$', '').replaceAll('.',''));

            return prize;

        },

    },

    ROUTE: {

        getPageType: () => {

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

    },

}


const REPLACEMENTS = {};

REPLACEMENTS[HELPER.BUSINESS.CONSTANTS.CART] = () => {

    if (!HELPER.BUSINESS.SETTINGS.cartEnabled) { 

        console.debug('Cart replacements DISABLED');
        
        return;

    }

}

REPLACEMENTS[HELPER.BUSINESS.CONSTANTS.CHECKOUT] = () => {

    if (!HELPER.BUSINESS.SETTINGS.checkoutEnabled) { 

        console.debug('Checkout replacements DISABLED');
        
        return;

    }

}

REPLACEMENTS[HELPER.BUSINESS.CONSTANTS.LIST] = () => {

    if (!HELPER.BUSINESS.SETTINGS.listEnabled) { 

        console.debug('List replacements DISABLED');
        
        return;

    }

}

REPLACEMENTS[HELPER.BUSINESS.CONSTANTS.PRODUCT] = () => { 

    if (!HELPER.BUSINESS.SETTINGS.productEnabled) { 

        console.debug('Product replacements DISABLED');
        
        return;

    }


}



window.onload = (event) => {

  const enabled = localStorage.getItem("ekeko");

  if (!enabled)  {

    console.debug("Ekeko updates disabled");

    return;

  }

  console.debug("Page loaded correctly");

  let pageType = HELPER.ROUTE.getPageType();

  console.debug("Page type:", pageType);

  if (pageType === 'product') {

    let basePrize = HELPER.QUERIES.getProductBasePrize();

    console.debug('Product base prize:', basePrize);

  }

};
