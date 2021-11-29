import {useEffect, useReducer} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {getAll} from 'services/post';

import Loading from 'pages/Loading';
import Banner from 'components/Banner';
import Pagination from 'components/Pagination';
import Post from 'components/Post';

export default function Home(props) {
  const location = useLocation();
  const navigate = useNavigate();

  const queryStrings = Object.fromEntries(location.search.slice(1).split('&').map((x) => x.split('=')));

  const [postsState, dispatchPostsAction] = useReducer(
    postsReducer,
    {
      load: queryStrings.page && parseInt(queryStrings.page) ? parseInt(queryStrings.page) - 1 : 0
    }
  );

  useEffect(
    _ => {
      if (postsState && postsState !== 'loading' && 'load' in postsState) {
        dispatchPostsAction({type: 'loading'});

        void !async _ => {
          dispatchPostsAction({type: 'load', payload: await getAll(postsState.load)});
        }();

        return;
      }

      if (postsState) { return; }

      dispatchPostsAction({type: 'loading'});
      
      // The !_ => {}() pattern lets a function be defined and called at the same time
      // Since the above pattern is an expression and not a statement, according to react/whatever library, and it gets upset at standalone
      // expressions, you need to void the expression which is a statement
      void !async _ => {
        try {
          dispatchPostsAction({type: 'load', payload: await getAll()});
        }
        catch (e) {
          // handle your error here;
          dispatchPostsAction({type: 'error', payload: e});
        }
      }();
    },
    [postsState]
  );

  if (!postsState || postsState === 'loading') {
    return (<Loading/>);
  }

  return (
    <section className="justify-around items-center min-h-screen bg-gray-300">
      <Banner/>
      <Pagination
        data={postsState}
        setPage={(i) => {
          navigate(`/dashboard?page=${i+1}`);
          dispatchPostsAction({type: 'page', payload: {i}});
        }}
        >
        <Posts/>
      </Pagination>
    </section>
  );
}

function Posts(props) {
  const {elements: posts} = props;

  return (
    <div className="grid grid-cols-3 gap-4 p-8">
      {
        posts?.map(
          (post) => <Post key={post._id} {...{post}} useLink={true}/>
        )
      }
    </div>
  );
}

function postsReducer(state, action) {
  const {type, payload} = action;

  if (type === 'load') {
    const {data: values, limit, page, pages} = payload;
    return {values, limit, page, pages};
  }
  else if (type === 'loading') {
    return 'loading';
  }
  else if (type === 'error') {
    return {error: payload};
  }
  else if (type === 'page') {
    return {load: payload.i};
  }
  else { return state; }
}