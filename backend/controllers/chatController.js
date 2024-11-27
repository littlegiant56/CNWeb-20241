import Randomstring from "randomstring";
import {
    collection,
    addDoc,
    Timestamp,
    query,
    where,
    or,
    getDocs,
    getDoc,
    updateDoc,
    doc,
    setDoc,
    orderBy,
    startAt,
    limit,
    startAfter,
    getCountFromServer
  } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import db from '../firebase.js';
import Message from '../models/messageModel.js'

// POST /sendMessage
export const sendMessage = async (req, res) => {
    const body = req.body.body;
    const sentUserId = req.body.sentUserId;
    const recievedUserId = req.body.recievedUserId;
    const imageFile = req.files["image"] ? req.files["image"] : null;
    const videoFile = req.files["video"] ? req.files["video"] : null;
  
    const storage = getStorage();
    let imageStorageURL = [];
    let videoStorageURL = [];
    const promises = [];
    // Tạo ra mảng promises để lưu trữ các promise của việc upload ảnh và video lên storage
    if (imageFile) {
      for (let i = 0; i < imageFile.length; i++) {
          const imageStorageRef = ref(storage, `/messageImages/${sentUserId}/${Randomstring.generate()}+${imageFile[i].originalname}`);
          promises.push(uploadBytes(imageStorageRef, imageFile[i].buffer, {contentType: imageFile[i].mimetype}).then(async (snapshot) => {
              imageStorageURL.push(await getDownloadURL(imageStorageRef))
          }));
      }
    }
  
    if (videoFile) {
      for (let i = 0; i < videoFile.length; i++) {
        const videoStorageRef = ref(storage, `/messageVideos/${sentUserId}/${Randomstring.generate()}+${videoFile[i].originalname}`);
        promises.push(uploadBytes(videoStorageRef, videoFile[i].buffer, {contentType: videoFile[i].mimetype}).then(async (snapshot) => {
            videoStorageURL.push(await getDownloadURL(videoStorageRef));
        }));
      }
    }
  
    // Sau khi tất cả các promise đã được resolve thì thực hiện thêm dữ liệu vào firestore
    Promise.all(promises).then(() => {
      // form-data
      addDoc(collection(db, "messages"), {
        body: body,
        image: imageStorageURL,
        video: videoStorageURL,
        sentUserId: sentUserId,
        recievedUserId: recievedUserId,
        read: false,
        createdAt: Timestamp.fromDate(new Date())
      })
        .then(() => {
          res.status(200).json({
              status: true,
              message: "Gửi tin nhắn thành công.",
              msg: {
                body: body,
                image: imageStorageURL,
                video: videoStorageURL,
                sentUserId: sentUserId,
                recievedUserId: recievedUserId,
                read: false,
                createdAt: Timestamp.fromDate(new Date())
              }
          })
      })
        .catch((error) => {
          res.status(400).json({
              status: false,
              message: error.message
          })
      })
    })
}

// GET /getUnreadMessages/:userId
export const getUnreadMessages = async (req, res) => {
  const messagesCollection = collection(db, "messages");
  const q = query(messagesCollection, 
    where('recievedUserId', '==', req.params.userId),
    where('read', '==', false)
  );
  var messagesList = [];
  getDocs(q)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let message = new Message(doc);
        messagesList.push(message);
      });
      res.status(200).json({
        status: true,
        messages: messagesList
      })
    })
    .catch((error) => {
      res.status(400).json({
        status: false,
        message: error.message
      });
    });
}

// Save message
export const saveMessage = async (message) => {
  let id1, id2;
  if (message.sentUserId < message.receivedUserId) {
    id1 = message.sentUserId;
    id2 = message.receivedUserId;
  }
  else {
    id2 = message.sentUserId;
    id1 = message.receivedUserId;
  }
  let id = id1 + '-' + id2;
  const conservationDoc = doc(db, "conversations", id);
  const data = await getDoc(conservationDoc);
  const newMessage = {
    sentUsername: message.sentUsername,
    sentUserId: message.sentUserId,
    receivedUserId: message.receivedUserId,
    content: message.content,
    createdAt: Timestamp.fromDate(new Date()),
    isRead: false
  };
  if (data.exists()) {
    const messageCollection = collection(data.ref, "messages");
    await updateDoc(conservationDoc, {
      lastMessage: newMessage,
    })
    await addDoc(messageCollection, newMessage); 
  }
  else {
    await setDoc(doc(db, "conversations", id), {
      id1,
      id2,
      lastMessage: newMessage
    });
    const messageCollection = collection(doc(db, "conversations", id), "messages");
    await addDoc(messageCollection, newMessage); 
  }
}

// GET /getConversationMessages/:userId/:friendId
export const getConversationMessages = async (req, res) => {
  let id = (req.params.userId < req.params.friendId) ? 
    (req.params.userId + '-' + req.params.friendId) :
    (req.params.friendId + '-' + req.params.userId);
  let data = await getDocs(collection(doc(db, "conversations", id), "messages"));
  let messages = [];
  data.forEach(message => messages.push(message.data()));
  messages.sort((a, b) => a.createdAt - b.createdAt);
  res.status(200).json({
    messages
  });
}

// GET /getMessagesConversationByOffset/:userId/:friendId?start=...&offset=...
export const getMessagesConversationByOffset = async (req, res) => {
  let id = (req.params.userId < req.params.friendId) ? 
    (req.params.userId + '-' + req.params.friendId) :
    (req.params.friendId + '-' + req.params.userId);
  let { start, offset } = req.query;
  start = parseInt(start); offset = parseInt(offset);
  const messageCollection = collection(doc(db, "conversations", id), "messages");
  let q;
  if (start > 0) {
    q = query(messageCollection, orderBy('createdAt', 'desc'), limit(start));
    const startDoc = await getDocs(q);
    const lastDoc = startDoc.docs[startDoc.docs.length - 1];
    // console.log(lastDoc.data());
    q = query(messageCollection, orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(offset));
  }
  else {
    q = query(messageCollection, orderBy('createdAt', 'desc'), limit(offset));
  }
  const data = await getDocs(q);
  let messages = [];
  data.forEach(message => messages.push(message.data()));
  const getCount = await getCountFromServer(messageCollection);
  const count = getCount.data().count;
  const hasMore = ((start + offset) < count);
  res.status(200).json({
    messages,
    hasMore
  });
}

// GET /getAllConversationByUserId/:userId
export const getAllConversationByUserId = async (req, res) => {
  const q = query(collection(db, "conversations"),
    or(
      where('id1', '==', req.params.userId),
      where('id2', '==', req.params.userId)
    ),
    orderBy('lastMessage.createdAt', 'desc')
  );
  const data = await getDocs(q);
  let conversations = [];
  data.forEach(conversation => conversations.push(conversation.data()));
  res.status(200).json({
    conversations
  });
}

// GET /getUnreadConversations/:userId
export const getUnreadConversations = async (req, res) => {
  let userId = req.params.userId;
  const q = query(collection(db, "conversations"),
    or(
      where('id1', '==', userId),
      where('id2', '==', userId)
    )
  );
  const data = await getDocs(q);
  let id = [];
  await Promise.all(
    data.docs.map(async (conversation) => {
      const messagesCollection = collection(conversation.ref, "messages");
      const q = query(messagesCollection,
        where("receivedUserId", "==", userId),
        where("isRead", "==", false)
      )
      const messages = await getDocs(q);
      if (!messages.empty) {
        id.push(conversation.id);
      }
    })
  );
  res.status(200).json({
    id
  });
}

// POST /markConversationAsRead
export const markConversationAsRead = async (req, res) => {
  let id = (req.body.userId < req.body.friendId) ? 
    (req.body.userId + '-' + req.body.friendId) :
    (req.body.friendId + '-' + req.body.userId);
  const messagesCollection = collection(doc(db, "conversations", id), "messages");
  const q = query(messagesCollection, 
    where("receivedUserId", "==", req.body.userId),
    where("isRead", "==", false),
    orderBy("createdAt", "asc")
  )
  let data = await getDocs(q);
  if (!data.empty) {
    const lastMessage = data.docs[data.docs.length - 1].data();
    await updateDoc(doc(db, "conversations", id), {
      lastMessage: {
        ...lastMessage,
        isRead: true
      }
    });
    await Promise.all(
      data.docs.map(async (message) => {
        await updateDoc(message.ref, {
          isRead: true
        })
      })
    );
    res.status(200).json({
      status: true,
      message: "Cập nhật thành công"
    });
  }
  else {
    res.status(200).json({
      status: true,
      message: "Không cập nhật gì"
    });
  }
}