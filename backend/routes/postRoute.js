import express from 'express'
import multer from 'multer'

import {
    createPost,
    getAllPost,
    deletePost,
    likePost
} from '../controllers/postController.js'

const router = express.Router()
const upload = multer()

router.post('/createPost', upload.fields([{name: 'image'}, {name: 'video'}]), createPost)
router.get('/getAllPost', getAllPost)
router.post('/deletePost/:postId', deletePost)
router.post('/likePost/:userId/:postId', likePost)

export default router