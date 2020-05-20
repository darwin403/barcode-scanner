import sendgrid from "@sendgrid/mail";

const SENDGRID_API_KEY =
  "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";
sendgrid.setApiKey(SENDGRID_API_KEY);

export default (req, res) => {
  const { to, products } = req.query;
  const message = {
    to: "skdcodes@gmail.com",
    from: "noreply@bot.io",
    subject: "Sending with Twilio SendGrid is Fun",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };
  return sendgrid
    .send(message)
    .then((response) => {
      return res.send({ ok: 1 });
    })
    .catch((error) => {
      if (error.response) {
        return res.send(error.response.body);
      }
      return res.send(error.message);
    });
};
