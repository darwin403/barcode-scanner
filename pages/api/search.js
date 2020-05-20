// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { Product } from "../../models";

export default (req, res) => {
  const { barcode } = req.query;

  if (!barcode) {
    return res.status(400).json({
      statusCode: 400,
      error: "Bad Request.",
      message: "Product's id or barcode cannot be empty.",
    });
  }

  return Product.where({ barcode })
    .orderBy("id", "DESC")
    .fetch()
    .then(function (result) {
      return res.send(result);
    })
    .catch(function (error) {
      return res.status(500).json({
        statusCode: 500,
        error: "Database Error.",
        message: error.message,
      });
    });
};
