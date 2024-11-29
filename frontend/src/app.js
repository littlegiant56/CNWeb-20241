import React ,{useEffect} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Login';
import SignUp from './SignUp';
import SetupAccount from './SetupAccount';
import NewFeeds from './Home/NewFeeds';
import PrivateRoute from './PrivateRoute';
import ImageView from "./posts/ImageView";
import DetailPost from "./posts/DetailPost";
import Profile from './profile/Profile';
function App() {
  useEffect(()=>{
    console.log("name App","4353")

  })
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/setup-account" element={<SetupAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route index element={<NewFeeds />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/post/:id" element={<DetailPost />} />
        </Route>
        <Route path="/new-feed" element={<NewFeeds />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
