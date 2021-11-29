import {Fragment, useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import transform from 'lodash/transform';
import get from 'lodash/fp/get';

import {isSuperset, getFrom, classes} from 'utils';
import {useFavorites} from 'hooks';
import {useUserContext} from 'context/UserContext';
// import {update, toggleActive, like, favorite} from 'services/post';
import {update, toggleActive, favorite, like} from 'services/post';

export default function Post(props) {
  const {
    post,
    updatePost,
    useLink = false,
    className,
    style,
  } = props;

  const {user, permissions} = useUserContext();
  const favorites = useFavorites();

  const [editing, setEditing] = useState(false);

  // Don't even know how favorite is implemented yet
  const [favorited, setFavorited] = useState(null);

  useEffect(
    _ => {
      if (!favorites || favorites === 'loading') { return; }

      setFavorited(favorites.includes(post._id));
    },
    [favorites]
  )

  const [favoriteHover, setFavoriteHover] = useState(false);
  const [favoriteJustToggled, setFavoriteJustToggled] = useState(false);

  const [liked, setLiked] = useState(null);

  useEffect(
    _ => {
      if (!post || post === 'loading') { return; }

      setLiked(Boolean(post.likes.find((u) => u.username === user.username)));
    },
    [post]
  );

  const [likeHover, setLikeHover] = useState(false);
  const [likeJustToggled, setLikeJustToggled] = useState(false);

  // Temporary while PATCH requests (AKA, /post/toggle/:id) throw a CORS error
  const [active, setActive] = useState(post.active);
  useEffect(
    _ => { setActive(post.active); },
    [post.active]
  );

  const [visibilityHover, setVisibilityHover] = useState(false);
  const [visibilityJustToggled, setVisibilityJustToggled] = useState(false);

  // --

  const As = useLink ? Link : 'div';

  const containerClasses = classes('transition duration-200 relative border-4 border-additional rounded rounded-xl bg-white h-96 hover:shadow-2xl');

  const actionsClasses = classes(
    'flex-row absolute m-2 leading-none bottom-0',

    // buttons
    classes.children('transition duration-200 bg-gray-300 text-black not-last:mr-1 rounded p-1 hover:bg-yellow-500 active:bg-secondary-light'),
  );

  const view = <Fragment>
    <As {...useLink && {to: `/post/${post._id}`}} className="flex flex-col">
      <h3 className="text-xl font-extrabold text-center text-gray-800">{post.title}</h3>
      <img src={post.image} alt={`Post ${post._id}`} className="my-2 m-auto object-contain" style={{maxHeight: '200px'}}/>
      <p className="text-center">{post.description}</p>
    </As>
    <div {...classes(actionsClasses.className, 'left-0')}>
      <button
        className="material-icons"
        {...setMouseEffects(
          async _ => {
            try {
              await like(post._id);
              setLiked((x) => !x);
            }
            catch (error) {
              console.dir(error);
            }
          },
          setLikeHover,
          setLikeJustToggled
        )}
        >
        {liked ^ (likeHover && !likeJustToggled) ? 'favorite' : 'favorite_outline'}
      </button>
      <button
        className="material-icons"
        {...setMouseEffects(
          async _ => {
            try {
              await favorite(post._id);
              setFavorited((x) => !x);
            }
            catch (error) {
              console.dir(error);
            }
          },
          setFavoriteHover,
          setFavoriteJustToggled
        )}
        >
        {favorited ^ (favoriteHover && !favoriteJustToggled) ? 'star' : 'star_outline'}
      </button>
    </div>
    {
      updatePost && isSuperset(permissions, editPostPermissions) &&
      <div {...classes(actionsClasses.className, 'right-0')}>
        <button className="material-icons" onClick={_ => setEditing(true)}>
          edit
        </button>
        <button
          className="material-icons"
          {...setMouseEffects(
            async _ => {
              try {
                await toggleActive(post._id);
                setActive((x) => !x);
              }
              catch (error) {
                console.dir(error);
              }
            },
            setVisibilityHover,
            setVisibilityJustToggled
          )}
          >
          {active ^ (visibilityHover && !visibilityJustToggled) ? 'visibility' : 'visibility_off'}
        </button>
      </div>
    }
  </Fragment>;
  
  const submitEdit = async (event) => {
    event.preventDefault();

    const fieldKeys = ['title', 'description', 'image'];
    const getFields = (obj) => fieldKeys.map(getFrom(obj));
    const newFields = getFields(event.target).map(get('value'));

    const areChanges = !isEqual(
      newFields,
      getFields(post)
    );

    if (areChanges) {
      try {
        await update(post._id, ...newFields);
        updatePost(post._id, transform(fieldKeys, (obj, key, i) => obj[key] = newFields[i], {}));
        setEditing(false);
      }
      catch (e) {
        console.error(e);
      }
    }
  };

  const inputClasses = classes('bg-gray-200 rounded not-last:mb-2 p-1');

  const editingForm = <form onSubmit={submitEdit} className="flex flex-col">
    <input name="title" placeholder="Title" defaultValue={post.title} type="text" {...inputClasses}/>
    <input name="image" placeholder="Image URL" defaultValue={post.image} type="text" {...inputClasses}/>
    <textarea name="description" placeholder="Description" defaultValue={post.description} rows={4} {...inputClasses}/>
    <div {...classes(actionsClasses.className, 'right-0')}>
      <button className="material-icons" onClick={_ => setEditing(false)}>
        cancel
      </button>
      <button className="material-icons" type="submit">
        check
      </button>
    </div>
  </form>;

  return (<div {...classes(className, containerClasses.className)} {...{style}}>{editing ? editingForm : view}</div>);
}

const setMouseEffects = (toggleValue, setHover, setJustToggled) => ({
  onClick() {
    toggleValue();
    setJustToggled(true);
  },
  onMouseEnter() { setHover(true); },
  onMouseLeave() {
    setHover(false);
    setJustToggled(false);
  },
})

const editPostPermissions = new Set(['post:update']);