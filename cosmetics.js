function getPageType() {

    let isProductPage = document.getElementById("add_to_cart-btn");

    return isProductPage

        ? 'Product'

        : 'List';

}

window.onload = (event) => {

  console.debug("Page loaded correctly");

  console.debug("Page type:", getPageType());

};
