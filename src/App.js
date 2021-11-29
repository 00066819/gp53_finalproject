import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login/Login";
import User from "./pages/User/User";
import NotFound from "./pages/NotFound/NotFound";
import Post from "./pages/Post/Post";
import OwnedPosts from "./pages/Post/OwnedPosts";
import CreatePost from "./pages/Post/CreatePost";
import "./index.css";

import Private from "./routes/PrivateRoute";
import Public from "./routes/PublicRoute";

import { HashRouter, Routes, Route, Navigate } from "react-router-dom";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route exact path="/" element={<Public><Navigate to="/login"/></Public>}/>
        <Route exact path="/login" element={<Public><Login/></Public>}/>

        <Route exact path="/dashboard" element={<Private><Dashboard/></Private>}/>
        <Route exact path="/user" element={<Private><User/></Private>}/>
        <Route exact path="/post/:id" element={<Private permissions={permissions.post}><Post/></Private>}/>
        <Route exact path="/my-posts" element={<Private permissions={permissions.myPosts}><OwnedPosts/></Private>}/>
        
        <Route exact path="/create-post" element={<Private permissions={permissions.createPost}><CreatePost/></Private>}/>

        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </HashRouter>
  );
}

const permissions = {
  post: new Set(['post:read']),
  myPosts: new Set(['post:read', 'post:update']),
  createPost: new Set(['post:create']),
  admin: new Set(['admin:read']),
}