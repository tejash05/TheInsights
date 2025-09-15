const Shopify = require("shopify-api-node");

function getShopifyClient(shop, accessToken) {
  return new Shopify({
    shopName: shop.replace(".myshopify.com", ""),
    accessToken,
    apiVersion: "2023-10", // stable version
  });
}

module.exports = { getShopifyClient };
