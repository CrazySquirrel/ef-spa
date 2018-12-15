import * as React from 'react';
import * as bem from 'bem-cn';

import {
  MetadataAudio,
  MetadataAuthor,
  MetadataImage,
  MetadataType,
  MetadataVideo,
} from '../../types';

interface Props {
  menu?: string;
  title?: string;
  description?: string;
  keywords?: string;
  h1?: string;
  type?: MetadataType;
  author?: MetadataAuthor;
  images?: MetadataImage[];
  videos?: MetadataVideo[];
  audios?: MetadataAudio[];
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
