const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const exphbs = require("express-handlebars");
const nodemailer = require("nodemailer");
const { toNamespacedPath, format } = require("path");
const { getMaxListeners, send } = require("process");
const { error } = require("console");

const app = express();

//viewengine
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (_req, res) => {
  res.render("main", { layout: "index" });
});

app.post("/send", (req, res) => {
  const output = `
  <p>Dobrý den,</p>
  <H3>Nová rezervace</H3>
  <ul>
  <li>Termín: ${req.body.date}</li>
  <li>Jméno: ${req.body.name1}</li>
  <li>Příjmení: ${req.body.name2}</li>
  <li>Telefoní číslo: ${req.body.phone}</li>
  <li>E-mail: ${req.body.email1}</li>
  </ul>
  <H3>Poznámky:</H3>
   ${req.body.note1}`;
  let transporter = nodemailer.createTransport({
    host: "gmail",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "tom.polivka96@gmail.com", // generated ethereal user
      pass: "Trolol321", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let mailOptions = {
    from: '"Tomas Polivka" <tom.polivka96@gmail.com>', // sender address
    to: "sarka, <hlavasarka@seznam.cz> ", // list of receivers
    subject: "Nová rezervace", // Subject line
    text: "Nová rezervace na řidičský kurz B", // plain text body
    html: output, // html body
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  });
  res.sendFile(path.join(__dirname, "public", "sucess.html"));
});

app.listen(3000, () => console.log("server started..."));
