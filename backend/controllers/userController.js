import Fuse from 'fuse.js';
import Profile from '../models/profileModel.js';
import db from '../firebase.js';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  setDoc,
  Timestamp
} from 'firebase/firestore';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut  
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { sendNotificationEmail } from "./sendEmail.js"

// POST /register
export const register = async (req, res, next) => {
  const auth = getAuth();
  const email = req.body.email;
  const password = req.body.password;
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      setDoc(doc(db, "profiles", userCredential.user.uid), {})
        .then(() => {
          sendNotificationEmail(email)
          res.status(200).json({
            status: true,
            user: userCredential.user,
            message: "Registration successful"
          })
        })
    })
    .catch((error) => {
      if (error.code == 'auth/email-already-in-use') {
        res.status(200).json({
          status: false,
          message: "Email already in use"
        })
      }
      else {
        res.status(400).json({
          status: false,
          message: error.message
        })
      }
    });
}

// POST /login
export const login = async (req, res, next) => {
  const auth = getAuth();
  const email = req.body.email;
  const password = req.body.password;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      res.status(200).json({
        status: true,
        user: userCredential.user,
        message: "Login successful"
      })
    })
    .catch((error) => {
      if (error.code == 'auth/invalid-credential' || error.code == 'auth/missing-email') {
        res.status(200).json({
          status: false,
          userId: null,
          message: "Incorrect email or password"
        })
      }
      else {
        res.status(400).json({
          status: false,
          userId: null,
          message: error.message
        })
      }
    });
}

// POST /logout
export const logout = async (req, res) => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      res.status(200).json({
        status: true,
        message: "Logout successful"
      })
    })
    .catch((error) => {
      res.status(200).json({
        status: false,
        message: error.message
      })
    });
}

export const getUserProfileById = async (req, res) => {
  const docRef = doc(db, "profiles", req.params.idUser);
  const docSnap = await getDoc(docRef);
  if(docSnap.exists()){
    res.status(200).json({
      status: true,
      user: docSnap.data()
    })
  } else {
    res.status(400).json({
      status: false,
    })
  }
}

// POST /updateProfile/:idUser
export const updateProfile = async (req, res) => {
  const docRef = doc(db, "profiles", req.params.idUser);
  const docSnap = await getDoc(docRef);
  const storage = getStorage();
  const cover_storageRef = ref(storage, `covers/${req.params.idUser}`);
  const avatar_storageRef = ref(storage, `avatars/${req.params.idUser}`);
  const coverImageFile = (req.files['cover']) ? req.files['cover'][0] : null;
  const avatarImageFile = (req.files['avatar']) ? req.files['avatar'][0] : null;
  // Tạo đối tượng chứa dữ liệu để truyền đi
  const params = ['firstName', 'lastName', 'DOB', 'address', 'gender', 'school', 'work', 'description'];
  let user = {};
  params.forEach((param) => {
    if (param in req.body) user[param] = req.body[param];
  });
  // Hàm cập nhật firestore database
  const updateFirestore = function () {
    if (docSnap.exists()) {
      updateDoc(doc(db, "profiles", req.params.idUser), user)
      .then(() => {
        res.status(200).json({
          status: true,
          message: "Update successful"
        })
      })
      .catch((error) => {
        res.status(400).json({
          status: false,
          message: error.message
        })
      });
    } 
    else {
      setDoc(doc(db, "profiles", req.params.idUser), user)
      .then(() => {
        res.status(200).json({
          status: true,
          message: "Update successful"
        })
      })
      .catch((error) => {
        res.status(400).json({
          status: false,
          message: error.message
        })
      })
    }
  }
  // Nếu có avatar / cover được tải lên
  let avatarCheck = (avatarImageFile) ? true : false, coverCheck = (coverImageFile) ? true : false;
  Promise.all([
    (coverCheck) ? uploadBytes(cover_storageRef, coverImageFile.buffer, {
      contentType: coverImageFile.mimetype
    }) : null, 
    (avatarCheck) ? uploadBytes(avatar_storageRef, avatarImageFile.buffer, {
      contentType: avatarImageFile.mimetype
    }) : null
  ])
    .then(async (snapshot) => {
      if (avatarCheck) user.avatar = await getDownloadURL(avatar_storageRef);
      if (coverCheck) user.cover = await getDownloadURL(cover_storageRef);
      if (avatarCheck || coverCheck) updateFirestore();
    })
    .catch((error) => {
      res.status(400).json({
        status: false,
        message: error.message
      })
    });
    if (!avatarCheck && !coverCheck) updateFirestore();
}

export const getAllUser = async (req, res) => {
  const querySnapshot = await getDocs(collection(db, "profiles"));
  let users = [];
  querySnapshot.forEach((doc) => {
    users.push({id: doc.id, ...doc.data()});
  });
  res.status(200).json({
    users: users
  });
}

// GET /findUser?name=...
export const findUser = async (req, res) => {
  // tạo dữ liệu cho việc tìm kiếm
  let profiles = [];
  const options = {
    keys: ['firstName', 'lastName'],
    threshold: 0.5
  };
  // lấy dữ liệu từ database
  const querySnapshot = await getDocs(collection(db, "profiles"));
  querySnapshot.forEach((doc) => {
    profiles.push(new Profile(doc));
  });
  const fuse = new Fuse(profiles, options);
  let result = fuse.search(req.query.name);
  result = result.map((obj) => obj.item);

  res.status(200).json({
    users: result
  });
}

// GET /findFriend/:userId?name=...
export const findFriend = async (req, res) => {
  // lấy friendList
  const userProfileDoc = await getDoc(doc(db, "profiles", req.params.userId));
  const friendList = userProfileDoc.data().friendList;
  if (friendList) {
    // tạo dữ liệu cho việc tìm kiếm
    let profiles = [];
    const options = {
      keys: ['firstName', 'lastName'],
      threshold: 0.5
    };
    // Lấy profile của các id trong friendList
    const promises = friendList.map(async (id) => {
      const profileDoc = await getDoc(doc(db, "profiles", id));
      return profileDoc.data();
    });
    profiles = await Promise.all(promises);
    const fuse = new Fuse(profiles, options);
    let result = fuse.search(req.query.name);
    result = result.map((obj) => obj.item);
  
    res.status(200).json({
      users: result
    });
  }
  else {
    res.status(200).json({
      users: []
    })
  }
  
}

// POST /createFriendRequest
export const createFriendRequest = async (req, res) => {
  const friendRequest = {
    sentUserId: req.body.userId,
    receivedUserId: req.body.friendId,
  };
  let id = friendRequest.sentUserId + "-" + friendRequest.receivedUserId;
  setDoc(doc(db, "friendRequests", id), friendRequest)
    .then(() => {
      res.status(200).json({
        status: true,
        message: 'Gửi lời mời kết bạn thành công'
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: false,
        message: error.message
      });
    })
}

// GET /checkExistFriendRequest
export const checkExistFriendRequest = async (req, res) => {
  const friendRequest = {
    sentUserId: req.params.userId,
    receivedUserId: req.params.friendId,
  };
  let id = friendRequest.sentUserId + "-" + friendRequest.receivedUserId;
  const friendRequestDoc = await getDoc(doc(db, "friendRequests", id));
  if (friendRequestDoc.exists()) {
    res.status(200).json({
      status: true
    })  
  }
  else {
    res.status(200).json({
      status: false
    })
  }
}

// POST /acceptFriendRequest
export const acceptFriendRequest = async (req, res) => {
  try {
    // cập nhật userId vào bạn bè của friendId
    const friendDocument = doc(db, "profiles", req.body.friendId);
    const friend = await getDoc(friendDocument);
    if (friend.data().friendList) {
      let tmp = friend.data().friendList;
      tmp.push(req.body.userId);
      await updateDoc(friendDocument, { friendList: tmp });
    }
    else {
      let tmp = [req.body.userId];
      await updateDoc(friendDocument, { friendList: tmp });
    }
    // cập nhật friendId vào bạn bè của userId
    const userDocument = doc(db, "profiles", req.body.userId);
    const user = await getDoc(userDocument);
    if (user.data().friendList) {
      let tmp = user.data().friendList;
      tmp.push(req.body.friendId);
      await updateDoc(userDocument, { friendList: tmp });
    }
    else {
      let tmp = [req.body.friendId];
      await updateDoc(userDocument, { friendList: tmp });
    }
    // cập nhật trạng thái của lời mời kết bạn thành đã chấp nhận
    let id = req.body.userId + "-" + req.body.friendId;
    await deleteDoc(doc(db, "friendRequests", id));
    // 
    res.status(200).json({
      status: true,
      message: 'Chấp nhận lời mời kết bạn thành công'
    });
  }
  catch (error) {
    res.status(400).json({
      status: false,
      message: error.message
    });
  }
}

// POST /declineFriendRequest
export const declineFriendRequest = async (req, res) => {
  const id = req.body.userId + "-" + req.body.friendId;
  deleteDoc(doc(db, "friendRequests", id))
    .then(() => res.status(200).json({
      status: true,
    }))
    .catch(error => res.status(400).json({
      status: false,
      message: error.message
    }))
}

// GET /getAllFriendRequests/:userId
export const getAllFriendRequests = async (req, res) => {
  const q = query(collection(db, "friendRequests"), where("receivedUserId", "==", req.params.userId));
  let id = [];
  const data = await getDocs(q);
  data.forEach((friendRequest) => {
    id.push(friendRequest.data().sentUserId);
  });
  res.status(200).json({
    id
  });
}

// GET /getFriendList/:userId
export const getFriendList = async (req, res) => {
  try {
    const userDocument = doc(db, "profiles", req.params.userId);
    const user = await getDoc(userDocument);
    var profileList = [];
    if (user.data().friendList) {
      let friendList = user.data().friendList;
      let friendPromises = friendList.map((friendId) => {
        return getDoc(doc(db, "profiles", friendId));
      });
      let friendSnapshots = await Promise.all(friendPromises);
      friendSnapshots.forEach((snap) => {
        let friendProfile = new Profile(snap);
        profileList.push(friendProfile);
      });
      res.status(200).json({
        status: true,
        users: profileList
      });
    }
    else {
      res.status(200).json({
        status: true,
        //message: 'CSDL chưa có friendList',
        users: []
      });
    }
  }
  catch (error) {
    res.status(400).json({
      status: false,
      message: error.message
    });
  }
}