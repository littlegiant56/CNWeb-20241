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
              message: "Đăng ký thành công"
            })
          })
      })
      .catch((error) => {
        if (error.code == 'auth/email-already-in-use') {
          res.status(200).json({
            status: false,
            message: "Email đã được sử dụng"
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
          message: "Đăng nhập thành công"
        })
      })
      .catch((error) => {
        if (error.code == 'auth/invalid-credential' || error.code == 'auth/missing-email') {
          res.status(200).json({
            status: false,
            userId: null,
            message: "Email hoặc mật khẩu không đúng"
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

  
  // POST /updateProfile/:idUser
export const updateProfile = async (req, res) => {
    const docRef = doc(db, "profiles", req.params.idUser);
    const docSnap = await getDoc(docRef);
    const storage = getStorage();
    const cover_storageRef = ref(storage, `covers/${req.params.idUser}`);
    const avatar_storageRef = ref(storage, `avatars/${req.params.idUser}`);
    const coverImageFile = (req.files['cover']) ? req.files['cover'][0] : null;
    const avatarImageFile = (req.files['avatar']) ? req.files['avatar'][0] : null;
  
    const params = ['firstName', 'lastName', 'DOB', 'address', 'gender', 'school', 'work', 'description'];
    let user = {};
    params.forEach((param) => {
      if (param in req.body) user[param] = req.body[param];
    });
  
    const updateFirestore = function () {
      if (docSnap.exists()) {
        updateDoc(doc(db, "profiles", req.params.idUser), user)
        .then(() => {
          res.status(200).json({
            status: true,
            message: "Cập nhật thành công"
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
            message: "Cập nhật thành công"
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

  
  // POST /changePassword
export const changePassword = async (req, res) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const newPassword = req.body.newPassword;
  
    user.updatePassword(newPassword).then(() => {
      res.status(200).json({
        status: true,
        message: "Thay đổi mật khẩu thành công"
      });
    }).catch((error) => {
      res.status(400).json({
        status: false,
        message: error.message
      });
    });
  }

  
  // POST /deleteAccount
export const deleteAccount = async (req, res) => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    user.delete().then(() => {
      res.status(200).json({
        status: true,
        message: "Xóa tài khoản thành công"
      });
    }).catch((error) => {
      res.status(400).json({
        status: false,
        message: error.message
      });
    });
  }
  