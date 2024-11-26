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
router.post('/logout', upload.none(), logout);
router.get('/getProfile/:idUser', upload.none(), getUserProfileById)
router.post('/updateProfile/:idUser', upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'avatar', maxCount: 1 }
  ]), updateProfile);
router.get('/getAllUser', upload.none(), getAllUser);
router.get('/findUser', upload.none(), findUser);
router.post('/createFriendRequest', upload.none(), createFriendRequest);
router.post('/acceptFriendRequest', upload.none(), acceptFriendRequest);
router.get('/getFriendList/:userId', upload.none(), getFriendList);
router.post('/declineFriendRequest', upload.none(), declineFriendRequest);
router.get('/getAllFriendRequests/:userId', upload.none(), getAllFriendRequests);
router.get('/findFriend/:userId', upload.none(), findFriend);
router.get('/checkExistFriendRequest/:userId/:friendId', upload.none(), checkExistFriendRequest);

export default router;