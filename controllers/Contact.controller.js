const { response } = require("express");
const sgMail = require("@sendgrid/mail");

const sendContactEmail = (req, res = response) => {
  try {
    const { name, email, message } = req.body;

    sgMail.setApiKey(process.env.SG_API_KEY);

    const msg = {
      to: "flakorules@gmail.com", // Change to your recipient
      cc: `${email}`,
      from: "flakorules@gmail.com", // Change to your verified sender
      
      subject: "[Raffles-App] Formulario de contacto",
      text: message,
      html: `<strong>Has recibido desde ${name} Responder a ${email}</strong>`,
    };

    sgMail
      .send(msg)
      .then(() => {
        res.status(201).json({
          ok: true,
          msg: "Raffle.controller -> sendContactEmail",
        });
      })
      .catch((error) => {
        console.log("catch 1", error)
        res.status(500).json({
          ok: false,
          msg: "Error: Contact.controller -> sendContactEmail",
          error
        });
      });
  } catch (error) {
    console.log("catch 2", error)
    res.status(500).json({
      ok: false,
      msg: "Error: Contact.controller -> sendContactEmailn",
    });
  }
};

module.exports ={ sendContactEmail }
