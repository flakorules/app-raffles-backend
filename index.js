const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { dbConnection } = require("./database/config");
//Crear seranode
const app = express();
dbConnection();
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Raffles app");
});

app.use("/api/users", require("./routes/User.route"));
app.use("/api/raffles", require("./routes/Raffle.route"));
app.use("/api/contact", require("./routes/Contact.route"));
app.use("/api/prizes", require("./routes/Prize.route"));
app.use("/api/raffleLists", require("./routes/RaffleList.route"));
app.use("/api/tickets", require("./routes/Tickets.route"));

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
