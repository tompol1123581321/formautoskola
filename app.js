const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const exphbs = require("express-handlebars");
const nodemailer = require("nodemailer");
const { toNamespacedPath, format } = require("path");
const { getMaxListeners } = require("process");
const { error } = require("console");

const app = express();

//viewengine
app.engine(
  "handlebars",
  exphbs({
    layoutsDir: __dirname + "/views/layouts",
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
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "drake.grady@ethereal.email", // generated ethereal user
      pass: "W5s5KMkMeGjRjgjZCm", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let mailOptions = {
    from: '"Tomas Polivka" <drake.grady@ethereal.email>', // sender address
    to: "sarka, <drake.grady@ethereal.email> ", // list of receivers
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
  form.addEventListener("submit", () => {
    window.open("127.0.0.1:5500/sent.html");
  });
});

app.listen(3000, () => console.log("server started..."));
