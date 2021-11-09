const { Router } = require("express");
const router = Router();

const { sendContactEmail } = require("../controllers/Contact.controller");

router.post("/sendEmail", sendContactEmail);

module.exports = router;
