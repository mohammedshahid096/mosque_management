const express = require("express");
const {
  Authentication,
  Authorization,
  CheckMosqueAccess,
  CheckMosqueAuthorization,
  CheckMosquePermissions,
} = require("../Middlewares/Auth.middleware");
const {
  SUPPER_ADMIN,
  ADMIN,
  SUB_USER,
  READ,
  CREATE,
  DELETE,
  UPDATE,
} = require("../Constants/roles.constants");
const {
  createNewMosqueController,
  getMosquesListController,
  getSingleMosqueDetailController,
  createMosqueEmailValidateController,
  createMosqueSlugValidateController,
  getCommunityMosqueDetailsController,
  updateCommunityMosqueDetailsController,
  updateCommunityMosqueTimingsController,
  getPublicAllMosqueController,
  getPublicSingleMosqueController,
  getMosqueCitiesListController,
  updateCommunityMosqueProfileController,
  uploadCommunityMosqueGalleryController,
  deleteCommunityMosqueGalleryController,
} = require("../Controllers/mosque/mosque.controller");
const ValidateObjectId = require("../Middlewares/validateObjectid.middleware");
const mosqueValidations = require("../validators/mosque.joi");
const {
  mosqueProfile,
  galleryImages,
} = require("../Middlewares/multer.middleware");

const MosqueRoutes = express.Router();

MosqueRoutes.route("/create-new").post(
  mosqueValidations.createNewMosqueValidation,
  createNewMosqueController
);
MosqueRoutes.route("/create-new/email-verify/available").post(
  mosqueValidations.createMosqueEmailValidation,
  createMosqueEmailValidateController
);
MosqueRoutes.route("/create-new/slug-verify/available").post(
  mosqueValidations.createMosqueSlugValidation,
  createMosqueSlugValidateController
);

MosqueRoutes.route("/mosques").get(
  Authentication,
  Authorization(SUPPER_ADMIN),
  getMosquesListController
);
MosqueRoutes.route("/mosques/:slug").get(
  Authentication,
  Authorization(SUPPER_ADMIN),
  // ValidateObjectId("mosqueId"),
  getSingleMosqueDetailController
);

// -----------------------------------------------------------------------------
// __TYPE__ : ROOT => ADMIN,MOSQUE-USERS
// -----------------------------------------------------------------------------
MosqueRoutes.route("/community/mosque-detail")
  .get(
    Authentication,
    Authorization(ADMIN, SUB_USER),
    CheckMosqueAccess,
    CheckMosqueAuthorization(ADMIN, SUB_USER),
    // CheckMosquePermissions(READ),
    getCommunityMosqueDetailsController
  )
  .put(
    Authentication,
    Authorization(ADMIN, SUB_USER),
    CheckMosqueAccess,
    CheckMosqueAuthorization(ADMIN, SUB_USER),
    CheckMosquePermissions(UPDATE),
    mosqueValidations.updateMosqueDetailsValidation,
    updateCommunityMosqueDetailsController
  );

MosqueRoutes.route("/community/mosque-timings").put(
  Authentication,
  Authorization(ADMIN, SUB_USER),
  CheckMosqueAccess,
  CheckMosqueAuthorization(ADMIN, SUB_USER),
  CheckMosquePermissions(UPDATE),
  mosqueValidations.updateMosqueTimingsValidation,
  updateCommunityMosqueTimingsController
);

MosqueRoutes.route("/community/profile").put(
  Authentication,
  Authorization(ADMIN, SUB_USER),
  CheckMosqueAccess,
  CheckMosqueAuthorization(ADMIN, SUB_USER),
  CheckMosquePermissions(UPDATE),
  mosqueProfile,
  updateCommunityMosqueProfileController
);

MosqueRoutes.route("/community/gallery")
  .post(
    Authentication,
    Authorization(ADMIN, SUB_USER),
    CheckMosqueAccess,
    CheckMosqueAuthorization(ADMIN, SUB_USER),
    CheckMosquePermissions(UPDATE),
    galleryImages,
    uploadCommunityMosqueGalleryController
  )
  .put(
    Authentication,
    Authorization(ADMIN, SUB_USER),
    CheckMosqueAccess,
    CheckMosqueAuthorization(ADMIN, SUB_USER),
    CheckMosquePermissions(UPDATE),
    mosqueValidations.deleteGalleryImagesValidation,
    deleteCommunityMosqueGalleryController
  );

//
// -----------------------------------------------------------------------------
// __TYPE__ : PUBLIC ROUTES
// -----------------------------------------------------------------------------
MosqueRoutes.route("/public/all").get(getPublicAllMosqueController);
MosqueRoutes.route("/public/:slug").get(getPublicSingleMosqueController);
MosqueRoutes.route("/public/all/cities").get(getMosqueCitiesListController);
module.exports = MosqueRoutes;
