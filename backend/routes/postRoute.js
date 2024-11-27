import express from 'express'
import multer from 'multer'

import {
    createPost,
    getPostByUserId,
    getAllPost,
    getPostByPostId,
    updatePost,
    deletePost,
    sharePost,
    likePost,
    removeLikePost,
    getCommentByPostId,
    getNotificationByUserId,
    getPostByOffset
} from '../controllers/postController.js'

const router = express.Router()
const upload = multer()

router.post('/createPost', upload.fields([{name: 'image'}, {name: 'video'}]), createPost)
router.get('/getAllPost', getAllPost)
router.get('/getPostByUserId/:userId', getPostByUserId)
router.get('/getPostByPostId/:postId', getPostByPostId)
router.post('/updatePost/:userId/:postId', upload.fields([{name: 'image'}, {name: 'video'}]), updatePost)
router.post('/deletePost/:postId', deletePost)
router.post('/sharePost/:postId', sharePost)
router.get('/getCommentByPostId/:postId', getCommentByPostId)
router.post('/likePost/:userId/:postId', likePost)
router.post('/removeLikePost/:userId/:postId', removeLikePost)
router.get('/getNotificationByUserId/:userId', getNotificationByUserId)
router.get("/getPostByOffset", getPostByOffset)

export default router