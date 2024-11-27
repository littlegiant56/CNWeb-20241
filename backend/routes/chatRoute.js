import express from 'express';
import multer from 'multer';

import {
    sendMessage,
    getUnreadMessages,
    getConversationMessages,
    getUnreadConversations,
    markConversationAsRead,
    getAllConversationByUserId,
    getMessagesConversationByOffset
} from '../controllers/chatController.js';

const router = express.Router()
const upload = multer()

router.post('/sendMessage', upload.fields([
    { name: 'video' },
    { name: 'image' }
    ]), sendMessage);
router.get('/getAllConversationByUserId/:userId', upload.none(), getAllConversationByUserId);
router.get('/getUnreadMessages/:userId', upload.none(), getUnreadMessages);
router.get('/getConversationMessages/:userId/:friendId', upload.none(), getConversationMessages);
router.get('/getMessagesConversationByOffset/:userId/:friendId', upload.none(), getMessagesConversationByOffset);
router.get('/getUnreadConversations/:userId', upload.none(), getUnreadConversations);
router.post('/markConversationAsRead', upload.none(), markConversationAsRead);
  
export default router;