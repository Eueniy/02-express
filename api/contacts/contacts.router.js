const express = require("express");
const ContactsController = require("./contacts.controller");

const contactsRouter = express.Router();

// get contacts list
contactsRouter.get("/", ContactsController.listContacts);

// get contact by id
contactsRouter.get(
  "/:id",
  ContactsController.checkContactById,
  ContactsController.getById
);

// Create new contact
contactsRouter.post(
  "/",
  ContactsController.createValidateContact,
  ContactsController.createNewContact
);

//Update contact data
contactsRouter.patch(
  "/:id",
  ContactsController.checkContactById,
  ContactsController.validateUpdateContact,
  ContactsController.updateContact
);

// Delete contact by ID
contactsRouter.delete(
  "/:id",
  ContactsController.checkContactById,
  ContactsController.removeContact
);

module.exports = contactsRouter;
