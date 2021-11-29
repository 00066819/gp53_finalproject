import {Fragment, cloneElement, useState} from 'react';
import range from 'lodash/range';

import {classes} from 'utils';

export default function Pagination(props) {
  const {data, setPage, children} = props;

  // console.log(data)

  const pagesBarClasses = classes(
    'text-center',
    classes.children('p-1 not-last:border-r-2 w-4'),
  );

  return (
    <Fragment>
      {cloneElement(children, {elements: data.values})}
      {
        data.pages > 1 &&
        <div {...pagesBarClasses}>
          {
            range(
              Math.max(data.page - 4, 0),
              Math.min(Math.max(data.page + 4, 9), data.pages)
            )
            .map(
              (i) => <button key={i} onClick={_ => setPage(i)} disabled={data.page === i} className={data.page === i ? 'bg-secondary' : 'bg-additional'}>{i + 1}</button>
            )
          }
        </div>
      }
    </Fragment>
  );
}