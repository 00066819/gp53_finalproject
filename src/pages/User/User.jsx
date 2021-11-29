import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router';

import {useUserContext} from 'context/UserContext';
import {get as getPost, getFavorites} from 'services/post';
import {useFavorites} from 'hooks';

import Banner from 'components/Banner';
import Post from 'components/Post';

export default function User() {
  const navigate = useNavigate();

  const {user} = useUserContext();

  const favorites = useFavorites();
  const [posts, setPosts] = useState(null);

  useEffect(
    _ => {
      if (favorites && favorites !== 'loading' && !posts) {
        setPosts([]);

        favorites.forEach((postID, i) => {
          void !async _ => {
            setPosts((posts) => {
              const newPosts = [...posts];
              newPosts[i] = 'loading';
              return newPosts;
            });
            try {
              const post = await getPost(postID);
              
              // TODO: Check if component still mounted.
              setPosts((posts) => {
                const newPosts = [...posts];
                newPosts[i] = post;
                return newPosts;
              });
            }
            catch (e) {}
          }();
        });
      }
    },
    [favorites, posts]
  );

  return (
    <section className="justify-around items-center min-h-screen bg-gray-300">
      <Banner name={user.username}/>
      <h3 className="text-xl m-8 bold">My Favorites</h3>
      <div className="grid grid-cols-3 gap-4 m-8">
        {
          posts?.map(
            (post) => <Post key={post._id} {...{post}} useLink={true}/>
          )
        }
      </div>
    </section>
  );
}