const express = require("express");
const UserController = require("./user.controller");

const userRouter = express.Router();

// get contacts list
userRouter.get("/", UserController.listContacts);

// get contact by id
userRouter.get("/:id", UserController.checkContactById, UserController.getById);

// Create new contact
userRouter.post(
  "/",
  UserController.createValidateUser,
  UserController.createUser
);

//Update contact data
userRouter.patch(
  "/:id",
  UserController.checkContactById,
  UserController.validateUpdateUser,
  UserController.updateContact
);

// Delete contact by ID
userRouter.delete(
  "/:id",
  UserController.checkContactById,
  UserController.removeContact
);

module.exports = userRouter;
