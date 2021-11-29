import {Fragment} from 'react';
import {Link, useNavigate} from 'react-router-dom';

import {isSuperset} from 'utils';
import {useUserContext} from 'context/UserContext';

export default function Banner(props) {
  const {name} = props;

  const navigate = useNavigate();
  const {logout, permissions} = useUserContext();

  const logoutHandler = () => {
    logout();
    navigate("/login");
  }

  return (
    <header className="sticky">
      {
        name && 
        <div className="bg-yellow-500 p-4">
          <h1 className="text-2xl font-extrabold text-gray-900 ml-4">{name}</h1>
        </div>
      }
      <div className="relative h-full flex justify-center items-center bg-yellow-600 shadow">
        {/*When you're working with buttons that redirect you, it's better to use <Link/> instead of a button and navigate.*/}
        <Link to="/dashboard" className="bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-bold py-2 px-4">Home</Link>
        <Link to="/user" className="bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-bold py-2 px-4">My Account</Link>
        {
          isSuperset(permissions, new Set(['post:update'])) &&
          <Fragment>
            <Link to="/my-posts" className="bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-bold py-2 px-4">My Posts</Link>
            <Link to="/create-post" className="bg-yellow-600 hover:bg-yellow-700 text-gray-900 font-bold py-2 px-4">Create Post</Link>
          </Fragment>
        }
        <button onClick={logoutHandler} className="absolute right-2 text-right"><span className="material-icons">logout</span></button>
      </div>
    </header>
  );
}