import express from 'express';
import multer from 'multer';

import {
  register,
  login,
  updateProfile,
  logout,
  getUserProfileById,
  getAllUser,
  findUser,
  findFriend,
  createFriendRequest
} from '../controllers/userController.js';

const router = express.Router();
const upload = multer();

router.post('/register', upload.none(), register);
router.post('/login', upload.none(), login);
router.post('/logout', upload.none(), logout);
router.get('/getProfile/:idUser', upload.none(), getUserProfileById)
router.post('/updateProfile/:idUser', upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'avatar', maxCount: 1 }
  ]), updateProfile);
router.get('/getAllUser', upload.none(), getAllUser);
router.get('/findUser', upload.none(), findUser);
router.get('/findFriend/:userId', upload.none(), findFriend);
router.post('/createFriendRequest', upload.none(), createFriendRequest);

export default router;