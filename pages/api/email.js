import sendgrid from "@sendgrid/mail";

import { Setting } from "../../models";
import template from "lodash.template";

const SENDGRID_API_KEY =
  "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";

sendgrid.setApiKey(SENDGRID_API_KEY);

export default (req, res) => {
  if (req.method === "POST") {
    const { from, products } = req.query;

    if (!from || !products) {
      return res.status(400).json({
        statusCode: 400,
        error: "Bad Request.",
        message: "Parameter 'from','products' cannot be empty.",
      });
    }

    return Setting.where({ type: "email" })
      .fetch()
      .then((result) => {
        const setting = result.toJSON()["setting"];
        const { to, subject, html } = JSON.parse(setting);
        const compiledHTML = template(html)({ products: JSON.parse(products) });
        const message = { to, from, subject, html: compiledHTML };

        return sendgrid
          .send(message)
          .then((response) => {
            return res.send({ ok: 1 });
          })
          .catch(function (error) {
            return res.status(500).json({
              statusCode: 500,
              error: "Database Error.",
              message: error.message,
            });
          });
      })
      .catch(function (error) {
        return res.status(500).json({
          statusCode: 500,
          error: "Database Error.",
          message: error.message,
        });
      });
  }
};
