const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const contactsRouter = require("./contacts/contacts.router");

const PORT = 5000;

module.exports = class ContactsServer {
  constructor() {
    this.server = null;
  }

  start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(morgan("combined"));
    this.server.use(cors({ origin: "http://localhost:5000" }));
  }

  initRoutes() {
    this.server.use("/api/contacts", contactsRouter);
  }

  startListening() {
    this.server.listen(PORT, () => {
      console.log("Server started listening on port", PORT);
    });
  }
};
