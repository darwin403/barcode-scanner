import { Product } from "../../models";

export default (req, res) => {
  return Product.where({})
    .count()
    .then(function (count) {
      return res.send({ count });
    })
    .catch(function (error) {
      return res.status(500).json({
        statusCode: 500,
        error: "Database Error.",
        message: error.message,
      });
    });
};
