import * as React from 'react';
import * as bem from 'bem-cn';

import './index.scss';

export default class Main extends React.Component {
  public render() {
    const block = bem('main');

    return (
        <main className={block()}>
          {this.props.children}
        </main>
    );
  }
}
