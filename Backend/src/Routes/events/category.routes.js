const express = require("express");
const EventCategoryRoutes = express.Router();
const {
  Authentication,
  Authorization,
  CheckMosqueAccess,
} = require("../../Middlewares/Auth.middleware");
const { ADMIN, SUB_USER } = require("../../Constants/roles.constants");
const categoryValidations = require("../../validators/events/eventCategory.joi");
const {
  createEventCategoryController,
  deleteEventCategoryController,
  getEventCategoryByIdController,
  getAllEventCategoriesController,
  updateEventCategoryController,
  getAllEventsCategoryNamesController,
} = require("../../Controllers/events/eventCategory.controller");

EventCategoryRoutes.route("/create-new-category").post(
  Authentication,
  Authorization(ADMIN),
  CheckMosqueAccess,
  categoryValidations.createEventCategory,
  createEventCategoryController
);

EventCategoryRoutes.route("/categories").get(
  Authentication,
  Authorization(ADMIN),
  CheckMosqueAccess,
  categoryValidations.getAllEventCategories,
  getAllEventCategoriesController
);

EventCategoryRoutes.route("/:categoryId")
  .get(
    Authentication,
    Authorization(ADMIN),
    CheckMosqueAccess,
    getEventCategoryByIdController
  )
  .put(
    Authentication,
    Authorization(ADMIN),
    CheckMosqueAccess,
    updateEventCategoryController
  )
  .delete(
    Authentication,
    Authorization(ADMIN),
    CheckMosqueAccess,
    deleteEventCategoryController
  );

EventCategoryRoutes.route("/categories/all/names").get(
  Authentication,
  Authorization(ADMIN),
  CheckMosqueAccess,
  getAllEventsCategoryNamesController
);

module.exports = EventCategoryRoutes;
