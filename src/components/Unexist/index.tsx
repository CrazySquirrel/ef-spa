import * as React from 'react';
import * as bem from 'bem-cn';

import './index.scss';

export interface Props extends React.Props<Unexist> {
  to?: string;
  className?: string;
  replaceClassName?: string;
  title?: string;
}

export default class Unexist extends React.Component<Props, {}> {
  public render() {
    const block = bem('unexist');

    return (
        <section className={block()}>
          {this.props.children}
        </section>
    );
  }
}
