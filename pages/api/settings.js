import { Setting } from "../../models";

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export default (req, res) => {
  const type = req.query.type;
  const setting = req.query.setting;

  // check if bad type
  if (!type) {
    return res.status(400).json({
      statusCode: 400,
      error: "Bad Request.",
      message: "Parameter 'type' cannot be empty.",
    });
  }

  // GET: setting by type
  if (req.method === "GET") {
    return Setting.where({ type })
      .fetch()
      .then((result) => {
        return res.send(result);
      })
      .catch((error) => {
        return res.status(500).json({
          statusCode: 500,
          error: "Database Error.",
          message: error.message,
        });
      });
  }

  // POST: update setting by type
  if (req.method === "POST") {
    // check empty/bad setting input
    if (!setting || !isJson(setting)) {
      return res.status(400).json({
        statusCode: 400,
        error: "Bad Request.",
        message:
          "Parameter 'setting' cannot be empty. Parameter 'setting' must also be a JSON parsable string.",
      });
    }

    // check email setting
    if (type === "email") {
      const { from, subject, html } = JSON.parse(setting);
      if (!from || !subject || !html) {
        return res.status(400).json({
          statusCode: 400,
          error: "Bad Request.",
          message:
            "Email setting cannot have empty fields 'to', 'subject' or 'html'.",
        });
      }
    }

    return Setting.where({ type })
      .save({ setting }, { patch: true })
      .then((result) => {
        return res.send(result);
      })
      .catch((error) => {
        return res.status(500).json({
          statusCode: 500,
          error: "Database Error.",
          message: error.message,
        });
      });
  }
};
