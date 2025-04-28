function getProductBasePrize() {

    let rawPrize = document.getElementsByClassName('product-vip__price-value')[0].innerHTML.trim();

    let prize = Number(rawPrize.split(',')[0].replaceAll('$', '').replaceAll('.',''));

    return prize;

}

function getPageType() {

    let isProductPage = document.getElementById("add_to_cart-btn");

    return isProductPage

        ? 'product'

        : 'list';

}

window.onload = (event) => {

  console.debug("Page loaded correctly");

  let pageType = getPageType();

  console.debug("Page type:", pageType);

  if (pageType === 'product') {

    let basePrize = getProductBasePrize();

    console.debug('Product base prize:', basePrize);
    
  }

};
