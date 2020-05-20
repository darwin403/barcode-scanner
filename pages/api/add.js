// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { Product } from "../../models";

export default (req, res) => {
  const { name, description, barcode, cost, retail } = req.query;

  if (!name || !description || !barcode || !cost || !retail) {
    return res.status(400).json({
      statusCode: 400,
      error: "Bad Request.",
      message:
        "Product's name, description, barcode, cost or retail cannot be empty.",
    });
  }

  return new Product({ name, description, barcode, cost, retail })
    .save()
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
