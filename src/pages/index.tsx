import * as React from 'react';

import App from 'components/App';

import {Metadata, MetadataType} from '../types';
import {siastrebov} from '../authors';

export const metadata: Metadata = {
  menu: 'Main',
  title: 'Even Faster Single Page Application',
  description: 'Even Faster Single Page Application – example web application',
  keywords: 'single page application',
  h1: 'Even Faster Single Page Application',
  author: siastrebov,
  type: MetadataType.ARTICLE,
};

export default class Page extends React.Component {
  public render() {
    return (
        <App {...metadata}/>
    );
  }
}
