import express from 'express'
import multer from 'multer';
import { storageGroupPhoto } from '../utils/multer';
import * as groupController from '../controllers/groupController'
import verifyToken from '../middlewares/verifyToken';
const groupRoutes = express.Router()

const uploadPhoto = multer({
  storage: storageGroupPhoto,
  fileFilter(req, file, callback) {
    if (file.mimetype.startsWith("image/")) {
      callback(null, false);
    }

    callback(null, true);
  },
});


groupRoutes.post(
  "/groups/free",
  verifyToken,
  uploadPhoto.single("photo"),
  groupController.createFreeGroup
);

export default groupRoutes