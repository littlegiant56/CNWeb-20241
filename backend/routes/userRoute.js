import express from 'express';
import multer from 'multer';

import {
  register,
  login,
  logout,
  updateProfile,
  findUser,
  createFriendRequest,
  getUserProfileById,
  acceptFriendRequest,
  getFriendList,
  getAllUser,
  declineFriendRequest,
  getAllFriendRequests,
  findFriend,
  checkExistFriendRequest
} from '../controllers/userController.js';

const router = express.Router();
const upload = multer();

router.post('/register', upload.none(), register);
router.post('/login', upload.none(), login);
router.post('/updateProfile/:idUser', upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'avatar', maxCount: 1 }
  ]), updateProfile);
  router.post('/changePassword', upload.none(), changePassword);
  router.post('/deleteAccount', upload.none(), deleteAccount);
  