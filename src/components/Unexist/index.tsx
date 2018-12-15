import * as React from 'react';
import * as bem from 'bem-cn';

import {Metadata} from '../../types';

interface Props extends Metadata {
}

import './index.scss';

export default class Unexist extends React.Component<Props, {}> {
  public render() {
    const block = bem('unexist');

    return (
        <section className={block()}>
          <h1 className={block('title')()}>{this.props.h1}</h1>
        </section>
    );
  }
}
