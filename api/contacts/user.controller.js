const Joi = require("joi");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { promises: fsPromises } = fs;
const path = require("path");
const contactsPath = path.join(__dirname, "../../db/contacts.json");

const contacts = JSON.parse(fs.readFileSync(contactsPath, "utf-8"));

class UserController {
  // get contact list
  listContacts(req, res, next) {
    return res.json(contacts);
  }

  // get user by id
  getById(req, res, next) {
    try {
      return res
        .status(200)
        .json(contacts.find((contact) => contact.id == req.params.id));
    } catch (err) {
      next(err);
    }
  }

  // create new user and add into db
  createUser(req, res, next) {
    const newContact = {
      id: uuidv4(),
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };
    contacts.push(newContact);
    fsPromises
      .writeFile(contactsPath, JSON.stringify(contacts, "", 2))
      .then(() => {
        res.status(201).send(newContact);
      })
      .catch((err) => {
        res.send(err);
      });
  }

  // Validate new user before create
  createValidateUser(req, res, next) {
    const createUserRules = Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const result = createUserRules.validate(req.body);
    if (result.error) {
      return res.status(400).json({ message: "missing required name field" });
    }
    next();
  }

  // validate user before patch
  validateUpdateUser(req, res, next) {
    const updateUserRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    }).min(1);

    const result = updateUserRules.validate(req.body);
    if (result.error) {
      return res.status(400).json({ message: "missing fields" });
    }

    next();
  }

  // Update contact information
  updateContact(req, res, next) {
    try {
      const updateContactIndex = contacts.findIndex(
        (contact) => contact.id == req.params.id
      );
      Object.assign(contacts[updateContactIndex], { ...req.body });
      fs.writeFileSync(contactsPath, JSON.stringify(contacts, "", 2));

      return res.status(200).json(contacts[updateContactIndex]);
    } catch (err) {
      return res.status(400).json({ message: "missing fields" });
    }
  }

  // Delete contact from db
  removeContact(req, res, next) {
    try {
      const deletedContact = contacts.filter(
        (contact) => contact.id != req.params.id
      );
      fs.writeFileSync(contactsPath, JSON.stringify(deletedContact, "", 2));

      return res.status(200).json({ message: "contact deleted" });
    } catch (err) {
      throw err;
    }
  }

  // checking db by user id
  checkContactById(req, res, next) {
    const id = parseInt(req.params.id);
    const userId = contacts.find((user) => user.id === id);
    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }
    next();
  }
}

module.exports = new UserController();
