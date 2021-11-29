import { Navigate } from 'react-router-dom';

import {isSuperset} from 'utils';
import {useUserContext} from 'context/UserContext';

import Loading from 'pages/Loading';

export default function PrivateRoute(props) {
  const {permissions, children} = props;
  const {token, user, permissions: userPermissions} = useUserContext();

  if ([token, user].some((x) => x === 'loading')) { return <Loading/>; }

  if (!token || !user) {
    return <Navigate replace to="/login"/>;
  }
  
  // Permissions are not matched by the role
  if (permissions && !isSuperset(userPermissions, permissions)) {
    return <Navigate replace to="/404"/>;
  }
  
  return children;
}