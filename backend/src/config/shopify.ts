import Shopify from "shopify-api-node";

export const getShopifyClient = (shop: string, accessToken: string) => {
  return new Shopify({
    shopName: shop.replace(".myshopify.com", ""),
    accessToken,
    apiVersion: "2025-01" // use the latest stable
  });
};
