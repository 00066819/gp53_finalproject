import { Navigate } from 'react-router-dom';

import { useUserContext } from 'context/UserContext';

import Loading from 'pages/Loading';

export default function PublicRoute({children}) {
  const {token, user} = useUserContext();

  if (token) {
    if (!user || user === 'loading') { return <Loading/>; }
    return <Navigate replace to="/dashboard"/>;
  }

  return children;
}
