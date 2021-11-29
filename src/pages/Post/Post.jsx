import {Fragment, useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import merge from 'lodash/merge';

import * as PostService from 'services/post';

import Loading from 'pages/Loading';
import Banner from 'components/Banner';
import Post from 'components/Post';

export default function PostPage() {
    const {id} = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const updatePost = (_, update) => {
      if (typeof update === 'object') {
        const updateObj = update;
        update = (draft) => merge(draft, updateObj);
      }
      else if (typeof update !== 'function') {
        throw new Error('Expected update function or object');
      }
      
      return setPost(update);
    };

    useEffect(
      _ => {
        if (!id || post) { return; }

        setPost('loading');

        // The !_ => {}() pattern lets a function be defined and called at the same time
        // Since the above pattern is an expression and not a statement, according to react/whatever library, and it gets upset at standalone
        // expressions, you need to void the expression which is a statement
        void !async _ => {
          try {
            const post = await PostService.get(id);
            // TODO: Check if component still mounted
            setPost(post);
          }
          catch (e) {
            navigate('/404');
          }
        }();
      },
      [navigate, post, id]
    );
    
    if (!post || post === 'loading') {
      return (<Loading/>);
    }

    return (
      <Fragment>
        <Banner/>
        <div className="mt-8">
          <Post {...{post, updatePost}} className="m-auto" style={{maxWidth: '400px'}}/>
        </div>
      </Fragment>
    );
}