import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Login';
import SignUp from './SignUp';
import SetupAccount from './SetupAccount';
import NewFeeds from './Home/NewFeeds';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/setup-account" element={<SetupAccount />} />
        <Route path="/new-feed" element={<NewFeeds />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
