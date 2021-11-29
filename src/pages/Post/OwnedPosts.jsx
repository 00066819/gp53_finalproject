import {useEffect, useReducer} from 'react';
import {useLocation, useNavigate} from 'react-router';
import produce from 'immer';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';

import {getOwned} from 'services/post';

import Loading from 'components/Loading';
import Banner from 'components/Banner';
import Post from 'components/Post';
import Pagination from 'components/Pagination';

export default function OwnedPosts() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryStrings = Object.fromEntries(location.search.slice(1).split('&').map((x) => x.split('=')));
  const [postsState, dispatchPostsAction] = useReducer(
    postsReducer,
    {
      load: queryStrings.page && parseInt(queryStrings.page) ? parseInt(queryStrings.page) - 1 : 0
    }
  );

  const updatePost = (id, update) => {
    if (typeof update === 'object') {
      const updateObj = update;
      update = (draft) => merge(draft, updateObj);
    }
    else if (typeof update !== 'function') {
      throw new Error('Expected update function or object');
    }

    return dispatchPostsAction({type: 'update-post', payload: {id, update}});
  };

  useEffect(
    _ => {
      if (postsState && postsState !== 'loading' && 'load' in postsState) {
        dispatchPostsAction({type: 'loading'});

        void !async _ => {
          dispatchPostsAction({type: 'load', payload: await getOwned(postsState.load)});
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
          dispatchPostsAction({type: 'load', payload: await getOwned()});
        }
        catch (e) {
          // handle your error here;
          dispatchPostsAction({type: 'error', payload: e});
        }
      }();
    },
    [postsState]
  );

  if (postsState && postsState !== 'loading' && 'error' in postsState) {
    // Placeholder
    return 'error';
  }

  return (
    <section className="justify-around items-center min-h-screen bg-gray-300">
      <Banner name="My Posts"/>
      {
        postsState && postsState !== 'loading'
        ?
        <Pagination
          data={postsState}
          setPage={(i) => {
            navigate(`/my-posts?page=${i+1}`);
            dispatchPostsAction({type: 'page', payload: {i}});
          }}
          >
          <Posts {...{updatePost}}/>
        </Pagination>
        :
        <Loading/>
      }
    </section>
  );
}

function Posts(props) {
  const {elements: posts, updatePost} = props;

  return (
    <div className="grid grid-cols-3 gap-4 p-8">
      {
        posts?.map(
          (post) => <Post key={post._id} {...{post, updatePost}} useLink={true}/>
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
  else if (type === 'update-post') {
    if ('posts' in state && ['id', 'update'].every((key) => key in payload)) {
      return produce(
        state,
        (draft) => {
          const postI = draft.posts.findIndex((post) => post._id === payload.id);
          if (postI !== -1) {
            draft.posts[postI] = payload.update(draft.posts[postI]);
            console.log(1, postI, cloneDeep(draft.posts));
          }
          else {
            process.env.NODE_ENV === 'development' && console.warn('No post was found to update.');
          }
        }
      );
    }
    else {
      process.env.NODE_ENV === 'development' && console.warn('Error: Your update did not go through.');
    }
    return state;
  }
  else { return state; }
}