import * as React from 'react';
import * as bem from 'bem-cn';

export default class NoJS extends React.Component {
  public render() {
    const block = bem('no-js');

    return (
        <noscript className={block()}>
          You must enable JavaScript for the full operation of this site.
        </noscript>
    );
  }
}
