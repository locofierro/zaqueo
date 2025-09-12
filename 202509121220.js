/**
 * HELPER FUNCTIONS
 * 
 */

function getPageType() {

    let isCheckout = window.location.pathname == '/checkout';

    if (isCheckout) return pageTypes.CHECKOUT;

    let isMainPage = window.location.pathname == '/';

    if (isMainPage) return pageTypes.MAIN;

    let isProductPage = document.getElementById("add_to_cart-btn");

    let cartIsOpen = document.getElementById("cart-sidenav").checkVisibility();

    return cartIsOpen 
    
        ? pageTypes.CART

        : isProductPage 
        
            ? pageTypes.PRODUCT_DETAIL

            : pageTypes.PRODUCT_LIST;

}

function convertPrizeToNumber (rawPrizes) {

    let prizes = rawPrizes.split(' ');

    let rawPrize = prizes.length == 2 ? prizes[1] : prizes[0];

    let prize = Number(rawPrize.split(',')[0].replaceAll('$', '').replaceAll('.',''));

    return prize;

}

function getSingleProductBasePrize(pageType, method='getElementsByClassName') {

    let rawBlock = document[method](selectors[pageType].prize);

    if (!rawBlock[0]) return null;

    let rawPrizes = rawBlock[0].innerHTML.trim();

    return convertPrizeToNumber(rawPrizes)

}




/**
 * CART PAGE
 * 
 */

function buildCartPrizeBlock(basePrize) {

    let moneyParser = new Intl.NumberFormat('es-AR');

    let bulkDiscount = moneyParser.format(basePrize - (basePrize * 0.2));

    let result = [];

    let baseLine = (prize, desc, style="") => `<li class="checkout__detail-list-item checkout__detail-list-item--resume"><p class="checkout__detail-resume-price checkout__detail-resume-price--bigger" ${style}>${prize} ${desc}</p></li>`;

    let styleLine = 'style="background-color:#00A86B; color:white; padding:4px; text-align: center!important"';

    let noDiscountFraction = moneyParser.format(Math.round(basePrize/6));

    result.push(baseLine("TARJETA - 6 cuotas sin interes de $",  noDiscountFraction));

    result.push(baseLine('$'+bulkDiscount, "EFECTIVO / TRANSFERENCIA", styleLine));

    result.push(`<div class="${selectors[pageTypes.CART].processed}"></>`);

    return result;

}

function replaceCartPricing() {

    let basePrize = getSingleProductBasePrize(pageTypes.CART, 'querySelectorAll');

    if (basePrize === null) {

        console.debug('CART', 'base prize not found');

        return;

    }

    let alreadyProcessed = document.getElementsByClassName(selectors[pageTypes.CART].processed);

    if (alreadyProcessed[0]) {

        console.debug('CART', 'already processed');

        return;

    };

    let block = buildCartPrizeBlock(basePrize);

    let startingBlock = $(document.querySelectorAll(selectors[pageTypes.CART].html)[3]);

    startingBlock.after(block[2]);

    startingBlock.after(block[1]);

    startingBlock.after(block[0]);

}




/**
 * CHECKOUT PAGE
 * 
 */

function buildCheckoutPrizeBlock(basePrize) {

    let moneyParser = new Intl.NumberFormat('es-AR');

    let bulkDiscount = moneyParser.format(basePrize - (basePrize * 0.2));

    let result = [];

    let baseLine = (prize, desc, style="") => `<li class="checkout__detail-list-item checkout__detail-list-item--resume"><p class="checkout__detail-resume-price checkout__detail-resume-price--bigger" ${style}>${prize} ${desc}</p></li>`;

    let styleLine = 'style="background-color:#00A86B; color:white; padding:4px; text-align: center!important"';

    let noDiscountFraction = moneyParser.format(Math.round(basePrize/6));

    result.push(baseLine("TARJETA - 6 cuotas sin interes de $",  noDiscountFraction));

    result.push(baseLine('$'+bulkDiscount, "EFECTIVO / TRANSFERENCIA", styleLine));

    return result;

}

function replaceCheckoutPricing() {

    let basePrize = getSingleProductBasePrize(pageTypes.CHECKOUT);

    if (basePrize === null) {

        console.debug('CKECKOUT', 'base prize not found');

        return;

    }

    let block = buildCheckoutPrizeBlock(basePrize);

    let startingBlock = $(document.querySelectorAll(selectors[pageTypes.CHECKOUT].html)[1]);

    startingBlock.after(block[1]);

    startingBlock.after(block[0]);

}



/**
 * MAIN PAGE
 * 
 */

function getMainBasePrize() {

    let rawBlocks = document.getElementsByClassName(selectors[pageTypes.MAIN].prize);

    if (!rawBlocks[0]) return [];

    let result = [];

    for (let block of rawBlocks) {

        let rawPrizes = block.innerHTML.trim();

        result.push(convertPrizeToNumber(rawPrizes))

    }

    return result;

}

function buildMainPrizeBlock(basePrize) {

    let moneyParser = new Intl.NumberFormat('es-AR');

    let bulkDiscount = moneyParser.format(basePrize - (basePrize * 0.2));

    let result = [];

    let baseLine = (prize, desc, style="") => `<li class="checkout__detail-list-item checkout__detail-list-item--resume"><p class="checkout__detail-resume-price checkout__detail-resume-price--bigger" ${style}>${prize} ${desc}</p></li>`;

    let styleLine = 'style="background-color:#00A86B; color:white; padding:4px; text-align: center!important"';

    let noDiscountFraction = moneyParser.format(Math.round(basePrize/6));

    result.push(baseLine("TARJETA - 6 cuotas sin interes de $",  noDiscountFraction));

    result.push(baseLine('$'+bulkDiscount, "EFECTIVO / TRANSFERENCIA", styleLine));

    return result;

}

function replaceMainPricing() {

    let basePrize = getMainBasePrize();

    if (basePrize.length === 0) {

        console.debug('MAIN', 'base prize not found');

        return;

    }

    let i = 0;

    for (const prize of basePrize) {

        let block = buildMainPrizeBlock(prize);

        let startingBlock = $(document.querySelectorAll(selectors[pageTypes.MAIN].html)[i]);

        startingBlock.after(block[1]);

        startingBlock.after(block[0]);

        i++;

    }

}




/**
 * PRODUCT DETAIL PAGE
 * 
 */

function buildProductDetailPrizeBlock(basePrize) {

    let moneyParser = new Intl.NumberFormat('es-AR');

    let bulkDiscount = moneyParser.format(basePrize - (basePrize * 0.2));

    let result = [];

    let baseLine = (prize, desc, style="") => `<p class="uk-flex uk-flex-middle text--primary" ${style}><span class="product-vip__price-value">${prize} ${desc}</span></p>`;

    let styleLine = (extra) => `style="font-weight: bold; font-size: 1.6rem; margin-bottom: 8px; ${extra}"`;

    let discountLine = 'background-color:#00A86B; color:white;';

    let noDiscountFraction = moneyParser.format(Math.round(basePrize/6));

    result.push(baseLine("TARJETA - 6 cuotas sin interes de $",  noDiscountFraction, styleLine()));

    result.push(baseLine('$'+bulkDiscount, "EFECTIVO / TRANSFERENCIA", styleLine(discountLine)));

    return result;

}

function replaceProductDetailPricing() {

    let basePrize = getSingleProductBasePrize(pageTypes.PRODUCT_DETAIL);

    if (basePrize === null) {

        console.debug('PRODUCT_DETAIL', 'base prize not found');

        return;

    }

    let block = buildProductDetailPrizeBlock(basePrize);

    let startingBlock = $(document.getElementsByClassName(selectors[pageTypes.PRODUCT_DETAIL].html)[0]).parent();

    startingBlock.after(block[1]);

    startingBlock.after(block[0]);

}




/**
 * PRODUCT LIST PAGE
 * 
 */

function getMultipleProductsBasePrize() {

    let rawBlocks = document.getElementsByClassName(selectors[pageTypes.PRODUCT_LIST].prize);

    if (!rawBlocks[0]) return [];

    let result = [];

    for (let block of rawBlocks) {

        let rawPrizes = block.innerHTML.trim();

        result.push(convertPrizeToNumber(rawPrizes))

    }

    return result;

}

function buildProductListPrizeBlock(basePrize) {

    let moneyParser = new Intl.NumberFormat('es-AR');

    let bulkDiscount = moneyParser.format(basePrize - (basePrize * 0.2));

    let result = [];

    let baseLine = (prize, desc, style="") => `<li class="checkout__detail-list-item checkout__detail-list-item--resume"><p class="checkout__detail-resume-price checkout__detail-resume-price--bigger" ${style}>${prize} ${desc}</p></li>`;

    let styleLine = 'style="background-color:#00A86B; color:white; padding:4px; text-align: center!important"';

    let noDiscountFraction = moneyParser.format(Math.round(basePrize/6));

    result.push(baseLine("TARJETA - 6 cuotas sin interes de $",  noDiscountFraction));

    result.push(baseLine('$'+bulkDiscount, "EFECTIVO / TRANSFERENCIA", styleLine));

    result.push(`<div class="${selectors[pageTypes.PRODUCT_LIST].processed}"></>`);

    return result;

}

function replaceProductListPricing() {

    let basePrize = getMultipleProductsBasePrize();

    if (basePrize.length === 0) {

        console.debug('PRODUCT_LIST', 'base prize not found');

        return;

    }

    let alreadyProcessed = document.getElementsByClassName(selectors[pageTypes.PRODUCT_LIST].processedContainer);

    let i = -1;

    for (const prize of basePrize) {

        i++;

        let containerBlock = $(alreadyProcessed[i]);

        let isProcessed = containerBlock.has('div.ekeko-item-updated').length;

        if (isProcessed) {

            console.debug('PRODUCT_LIST', `already processed entry ${i}`);

            continue;

        } 

        let block = buildProductListPrizeBlock(prize);

        let startingBlock = $(document.querySelectorAll(selectors[pageTypes.PRODUCT_LIST].html)[i]);

        startingBlock.after(block[2]);

        startingBlock.after(block[1]);

        startingBlock.after(block[0]);

    }

}




/**
 * CODE MAPPINGS
 * 
 */

const pageTypes = {

    CART: 'cart',
    
    CHECKOUT: 'checkout',

    MAIN: 'main',

    PRODUCT_DETAIL: 'product',

    PRODUCT_LIST: 'list',

};

const selectors = {};

selectors[pageTypes.CART] = { 
    
    html: 'ul.cart-sidenav__content > li.cart-sidenav__item--detail', 
    
    prize: '.cart-sidenav__detail-price:last-child',

    processed: 'ekeko-cart-updated',

}

selectors[pageTypes.CHECKOUT] = { html: 'ul.checkout__detail-list > li.checkout__detail-list-item--resume', prize: 'checkout__detail-resume-price--bigger' }

selectors[pageTypes.MAIN] = { html: '.block-products-feed__product-price', prize: 'block-products-feed__product-price' }

selectors[pageTypes.PRODUCT_DETAIL] = { html: 'product-vip__price-value', prize: 'product-vip__price-value' }

selectors[pageTypes.PRODUCT_LIST] = { 
    
    html: '.products-feed__product-price', 
    
    prize: 'products-feed__product-price',

    processed: 'ekeko-item-updated',

    processedContainer: 'products-feed__product-wrapper',

}


const mappings = {};

mappings[pageTypes.CART] = () => replaceCartPricing();

mappings[pageTypes.CHECKOUT] = () => replaceCheckoutPricing();

mappings[pageTypes.MAIN] = () => replaceMainPricing();

mappings[pageTypes.PRODUCT_DETAIL] = () => replaceProductDetailPricing();

mappings[pageTypes.PRODUCT_LIST] = () => replaceProductListPricing();




/**
 * MAIN
 * 
 */

window.onload = (event) => {

    let pageType = getPageType();

    console.debug('PAGE DETECTED', pageType);

    mappings[pageType]();

    mappings[pageTypes.CART]();

    /**
     * AJAX HOOK
     * 
     */

    $(document).ajaxComplete(function(event, xhr, settings) {
  
        console.debug('AJAX call completed', settings.url);

        if (['/v4/cart/add', '/v4/cart/delete', '/v4/cart/qty'].includes(settings.url)) {

            mappings[pageTypes.CART]();

        }

        if (settings.url.includes('/v4/cart?_=')) {

            mappings[pageTypes.CART]();

        }

        if (settings.url.includes('/v4/product?filter')) {

            mappings[pageTypes.PRODUCT_LIST]();

        }

        if (settings.url.includes('/v4/product/category?filter')) {

            mappings[pageTypes.PRODUCT_LIST]();

        }

    
    });

};
