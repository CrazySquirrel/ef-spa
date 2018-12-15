import * as React from 'react';

import Unexist from 'components/Unexist';

import {Metadata, MetadataType} from '../types';
import {siastrebov} from '../authors';

export const metadata: Metadata = {
  menu: '404 Page not found',
  title: 'Page not found',
  description: 'Page not found',
  keywords: 'Page not found',
  h1: '404 Page not found',
  author: siastrebov,
  type: MetadataType.NONE,
};

export default class Page extends React.Component {
  public render() {
    return (
        <Unexist {...metadata}/>
    );
  }
}
