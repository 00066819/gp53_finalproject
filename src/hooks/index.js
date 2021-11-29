import {useEffect, useState} from 'react';

import {getFavorites} from 'services/post';

export function useFavorites() {
  const [favorites, setFavorites] = useState(null);

  useEffect(
    _ => {
      if (favorites) { return; }
      setFavorites('loading');

      // The !_ => {}() pattern lets a function be defined and called at the same time
      // Since the above pattern is an expression and not a statement, according to react/whatever library, and it gets upset at standalone
      // expressions, you need to void the expression which is a statement
      void !async _ => {
        const favorites = (await getFavorites()).favorites;
        // TODO: Check if component still mounted
        setFavorites(favorites);
      }();
    },
    [favorites]
  );

  return favorites;
}
