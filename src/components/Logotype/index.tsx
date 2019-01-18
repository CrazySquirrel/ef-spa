import * as React from 'react';
import * as bem from 'bem-cn';

import Link from 'components/Link';

import {IconChat} from 'components/Icon';

import './index.scss';

const block = bem('logotype');

export default class Logotype extends React.Component<{}, {}> {
  public render() {
    return (
        <Link to='/' replaceClassName={block()}>{IconChat()}</Link>
    );
  }
}
