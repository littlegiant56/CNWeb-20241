import {
    addDoc,
    arrayRemove,
    arrayUnion,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    setDoc,
    startAfter,
    startAt,
    Timestamp,
    updateDoc,
    where
} from "firebase/firestore"
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage"
import Randomstring from "randomstring"
import db from '../firebase.js'

export const createPost = async (req, res) => {
    const body = req.body.body
    const userId = req.body.userId
    const imageFile = req.files["image"] ? req.files["image"] : null
    const videoFile = req.files["video"] ? req.files["video"] : null

    const storage = getStorage();
    let imageStorageURL = []
    let videoStorageURL = ""
    const promises = []
    // Tạo ra mảng promises để lưu trữ các promise của việc upload ảnh và video lên storage
    if (imageFile) {
        for (let i = 0; i < imageFile.length; i++) {
            const imageStorageRef = ref(storage, `/postImage/${userId}/${Randomstring.generate()}+${imageFile[i].originalname}`)
            promises.push(uploadBytes(imageStorageRef, imageFile[i].buffer, {contentType: imageFile[i].mimetype}).then(async (snapshot) => {
                imageStorageURL.push(await getDownloadURL(imageStorageRef))
            }))
        }
    }

    if (videoFile) {
        const videoStorageRef = ref(storage, `/postVideo/${userId}/${Randomstring.generate()}+${videoFile[0].originalname}`)
        promises.push(uploadBytes(videoStorageRef, videoFile[0].buffer, {contentType: videoFile[0].mimetype}).then(async (snapshot) => {
            videoStorageURL = await getDownloadURL(videoStorageRef)
        }))
    }
    // Sau khi tất cả các promise đã được resolve thì thực hiện thêm dữ liệu vào firestore
    Promise.all(promises).then(() => {
        // form-data
        addDoc(collection(db, "posts"), {
            body: body,
            image: imageStorageURL,
            video: videoStorageURL,
            userId: userId,
            likedList: [],
            comments: [],
            isComment: false,
            dateCreated: Timestamp.fromDate(new Date())
        }).then((docRef) => {
            res.status(200).json({
                status: true,
                message: "Tạo bài đăng thành công.",
                post: {
                    body: body,
                    image: imageStorageURL,
                    video: videoStorageURL,
                    userId: userId,
                    likedList: [],
                    comments: [],
                    id: docRef.id,
                    isComment: false,
                    dateCreated: Timestamp.fromDate(new Date())
                }
            })
        }).catch((error) => {
            res.status(400).json({
                status: false,
                message: error.message
            })
        })
    })
}

export const getPostByUserId = async (req, res) => {
    const userId = req.params.userId
    let posts = []

    try {
        const querySnapshot =
            await getDocs(collection(db, "posts"))

        querySnapshot.forEach((doc) => {
            if (doc.data().userId === userId && !doc.data().isComment) {
                posts.push({id: doc.id, data: doc.data()})
            }
        })

        if (posts.length === 0) {
            res.status(402).json({
                message: `No posts by user ${userId} found`,
            })
        } else res.status(200).json({
            message: `Found posts by user ${userId}.`,
            data: posts
        })
    } catch (e) {
        console.log(e.message)
        res.status(400).json({
            message: e.message
        })
    }
}

export const getAllPost = async (req, res) => {
    let posts = []

    try {
        const querySnapshot = await getDocs(collection(db, "posts"))
        querySnapshot.forEach((doc) => {
            if (!doc.data().isComment) posts.push({id: doc.id, data: doc.data()})
        })

        if (querySnapshot.empty) {
            res.status(402).json({
                message: "No post found!"
            })
        } else res.status(200).json({
            message: "Found all posts",
            data: posts
        })
    } catch (e) {
        console.log(e.message)
        res.status(400).json({
            message: e.message
        })
    }
}

export const getPostByPostId = async (req, res) => {
    const postId = req.params.postId

    try {
        getDoc(doc(db, "posts", postId))
            .then((doc) => {
                if (doc.exists()) {
                    res.status(200).json({
                        message: `Found post with id ${postId}`,
                        data: doc.data()
                    })
                } else {
                    res.status(404).json({
                        message: `No post with id ${postId} found`
                    })
                }
            })
            .catch((error) => {
                res.status(400).json({
                    message: error.message
                })
            })
    } catch (e) {
        console.log(e.message)
        res.status(400).json({
            message: e.message
        })
    }
}

export const updatePost = async (req, res) => {
    let body = req.body.body
    const imageFile = req.files["image"] ? req.files["image"] : null
    const videoFile = req.files["video"] ? req.files["video"] : null
    const postId = req.params.postId;
    const userId = req.params.userId;

    if (body === undefined || body === null) {
        body = ""
    }

    console.log(body)
    console.log(imageFile)

    const storage = getStorage();
    let imageStorageURL = []
    let videoStorageURL = ""
    const promises = []

    if (imageFile) {
        for (let i = 0; i < imageFile.length; i++) {
            const imageStorageRef = ref(storage, `/postImage/${userId}/${Randomstring.generate()}+${imageFile[i].originalname}`)
            promises.push(uploadBytes(imageStorageRef, imageFile[i].buffer, {contentType: imageFile[i].mimetype}).then(async (snapshot) => {
                imageStorageURL.push(await getDownloadURL(imageStorageRef))
            }))
        }
    }

    if (videoFile) {
        const videoStorageRef = ref(storage, `/postVideo/${userId}/${Randomstring.generate()}+${videoFile[0].originalname}`)
        promises.push(uploadBytes(videoStorageRef, videoFile[0].buffer, {contentType: videoFile[0].mimetype}).then(async (snapshot) => {
            videoStorageURL = await getDownloadURL(videoStorageRef)
        }))
    }

    // Sau khi tất cả các promise đã được resolve thì thực hiện thêm dữ liệu vào firestore
    Promise.all(promises).then(() => {
        try {
            let docSnap
            const docRef = doc(db, "posts", postId)
            getDoc(docRef).then((doc) => {
                docSnap = doc.data()
            })

            // form-data
            updateDoc(docRef, {
                body: body,
                image: imageStorageURL,
                video: videoStorageURL,
            }).then(() => {
                res.status(200).json({
                    status: true,
                    message: "Cập nhật bài đăng thành công.",
                    post: {
                        body: body,
                        image: imageStorageURL,
                        video: videoStorageURL,
                        likedList: docSnap.likedList,
                        comments: docSnap.comments,
                        id: docRef.id,
                        isComment: false,
                        dateCreated: Timestamp.fromDate(new Date())
                    }
                })
            })
        } catch (e) {
            console.log(e.message)
            res.status(400).json({
                message: "Error update file"
            })
        }
        }).catch((error) => {
            res.status(400).json({
                status: false,
                message: error.message
            })
        })
}

export const deletePost = async (req, res) => {
    const postId = req.params.postId

    try {
        const postRef = doc(db, "posts", postId)

        await deleteDoc(postRef)
        res.status(200).json({
            message: `Post with id ${postId} deleted`
        })
    } catch (e) {
        res.status(400).json({
            message: `Failed to delete post with id ${postId}`
        })
    }
}

export const sharePost = async (req, res) => {
    const sharedPostId = req.params.postId
    const body = req.body.body
    const userId = req.body.userId

    addDoc(collection(db, "posts"), {
        body: body,
        userId: userId,
        sharedPostId: sharedPostId,
        likedList: [],
        comments: [],
        isComment: false,
        dateCreated: Timestamp.fromDate(new Date())
    }).then(async (docRef) => {
        res.status(200).json({
            status: true,
            message: "Chia sẻ bài đăng thành công.",
            post: {
                body: body,
                userId: userId,
                likedList: [],
                comments: [],
                id: docRef.id,
                sharedPostId: sharedPostId,
                isComment: false,
                dateCreated: Timestamp.fromDate(new Date())
            }
        })
    }).catch((error) => {
        res.status(400).json({
            status: false,
            message: error.message
        })
    })
}

export const likePost = async (req) => {
    const userId = req.userId
    const postId = req.postId

    try {
        const postRef = doc(db, "posts", postId)
        getDoc(postRef)
            .then((doc) => {
                if (doc.exists()) {
                    const liked_list = doc.data().likedList
                    if (liked_list.includes(userId)) {
                        return {
                            message: "User already liked this post"
                        }
                    } else {
                        updateDoc(postRef, {
                            likedList: arrayUnion(userId)
                        })

                        return {
                            message: `Post with id ${postId} liked by user ${userId}`
                        }
                    }
                } else {
                    return {
                        message: `No post with id ${postId} found`
                    }
                }
            })
    } catch (e) {
        console.log(e)
    }
}

export const removeLikePost = async (req, res) => {
    const userId = req.params.userId
    const postId = req.params.postId

    const postRef = doc(db, "posts", postId)
    const liked_list = (await getDoc(postRef)).data().likedList

    try {
        if (!liked_list.includes(userId)) {
            res.status(202).json({
                message: "User hasn't liked this post"
            })
        } else {
            await updateDoc(postRef, {
                likedList: arrayRemove(userId)
            })

            res.status(200).json({
                message: `Post with id ${postId} remove liked by user ${userId}`
            })
        }
    } catch (e) {
        res.status(201).json({
            message: `Failed to remove like post`
        })
    }
}

export const createComment = async (req) => {
    const body = req.content
    const postId = req.postId
    const userId = req.userId

    const promises = []

    // Sau khi tất cả các promise đã được resolve thì thực hiện thêm dữ liệu vào firestore
    Promise.all(promises).then(() => {
        // form-data
        addDoc(collection(db, "posts"), {
            body: body,
            postId: postId,
            // image: imageStorageURL,
            // video: videoStorageURL,
            userId: userId,
            likedList: [],
            comments: [],
            isComment: true,
            dateCreated: Timestamp.fromDate(new Date())
        }).then((docRef) => {
            // Add comment id to post's comment list
            const parentPostRef = doc(db, "posts", postId)
            updateDoc(parentPostRef, {
                comments: arrayUnion(docRef.id)
            })
        })
    })
}

export const getCommentByPostId = async (req, res) => {
    const postId = req.params.postId

    try {
        const postRef = doc(db, "posts", postId)
        const docSnap = await getDoc(postRef)

        const commentIds = docSnap.data().comments

        let commentRef
        let commentSnap
        let comments = []
        for (let commentId of commentIds) {
            commentRef = doc(db, "posts", commentId)
            commentSnap = await getDoc(commentRef)

            if (commentSnap.exists()) {
                comments.push(commentSnap.data())
            }
        }

        res.status(200).json({
            message: `Found comments for post ${postId}.`,
            data: comments
        })
    } catch (e) {
        console.log(e.message)
        res.status(400).json({
            message: e.message
        })
    }
}

export const createNotification = async (req) => {
    const notificationRef = doc(db, "notifications", req.postUserId)
    if (req.userId === req.postUserId) return
    const newNotification = {
        sentUsername: req.sentUsername,
        userId: req.userId,
        postUserId: req.postUserId,
        postId: req.postId,
        type: req.type,
        dateCreated: Timestamp.fromDate(new Date())
    }
    getDoc(notificationRef)
        .then((doc) => {
            if (doc.exists()) {
                updateDoc(notificationRef, {
                    data: arrayUnion(newNotification)
                })
            } else {
                setDoc(notificationRef, {
                    data: arrayUnion(newNotification)
                })
            }
        })
}

export const getNotificationByUserId = async (req, res) => {
    const userId = req.params.userId

    const notificationRef = doc(db, "notifications", userId)
    const notifications = (await getDoc(notificationRef)).data()

    res.status(200).json({
        message: `Found notifications for user ${userId}.`,
        data: notifications
    })
}

export const getPostByOffset = async (req, res) => {
    const offset = parseInt(req.query.offset)
    let lastVisibleId = req.query.lastVisibleId
    let docs = []

    // Check invalid offset
    if (offset === 0) {
        res.status(400).json({
            message: "Offset must be greater than 0"
        })
        return
    }

    let q
    const postsRef = collection(db, "posts");
    if (lastVisibleId === "null") {
        // On the first call from client, req.query.lastVisibleId should be undefined.
        // This is default implementation.
        const currentTimestamp = Timestamp.now()

        // Only query posts with isComment = false, order by dateCreated descending, which means
        // querying from latest post(s).
        q = query(postsRef,
            where("isComment", "==", false),
            orderBy("dateCreated", 'desc'),
            startAt(currentTimestamp),
            limit(offset))
    } else {
        // Server expects Client to include lastVisibleId in req.query in order to query posts after lastVisibleId post
        // from previous call.
        let lastVisible
        await getDoc(doc(db, "posts", lastVisibleId)).then((doc) => {
            lastVisible = doc
        })

        q = query(collection(db, "posts"),
            where("isComment", "==", false),
            orderBy("dateCreated", "desc"),
            startAfter(lastVisible),
            limit(offset))
    }

    const documentSnapshots = await getDocs(q);
    documentSnapshots.forEach((doc) => {
        docs.push({id: doc.id, data: doc.data()})
    })

    if (docs.length !== 0) {
        lastVisibleId = docs[docs.length - 1].id
        let hasMore = true
        res.status(200).json({
            posts: docs,
            lastVisibleId: lastVisibleId,
            hasMore: hasMore
        })
    } else {
        // No more posts after lastVisible post
        let hasMore = false
        res.status(200).json({
            posts: docs,
            lastVisibleId: lastVisibleId,
            hasMore: hasMore
        })
    }
}