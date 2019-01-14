import * as React from 'react';
import * as bem from 'bem-cn';

import './index.scss';

const block = bem('main');

export default class Main extends React.Component {
  public render() {
    return (
        <main className={block()}>
          {this.props.children}
        </main>
    );
  }
}
