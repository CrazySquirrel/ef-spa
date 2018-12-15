import * as React from 'react';
import * as bem from 'bem-cn';

import {RouteAction} from 'store/reducers/router';

import Aside from 'components/Aside';
import Main from 'components/Main';
import NoJS from 'components/NoJS';

import {Publisher, Author} from 'components/Metatags';

import {StoreTree} from '../../store';
import {connect} from 'react-redux';

import {
  MetadataImage,
  MetadataVideo,
  MetadataAudio,
  MetadataType,
  MetadataAuthor,
} from '../../types';

declare const webmanifest: any;

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

  location?: string;
  modified?: string;

  update?: (location: string) => any;
}

interface State {
  href: string;
  pathname: string;
}

import './index.scss';

export class App extends React.Component<Props, State> {
  private images: MetadataImage[];

  public constructor(props: Props) {
    super(props);

    const siteUrl = webmanifest.start_url.replace(/\/$/ig, '');

    this.images = props.images || webmanifest.icons.map((v: MetadataImage) => {
      const sizes = v.sizes.split('x');

      return {
        src: siteUrl + v.src,
        type: v.type,
        width: sizes[0],
        height: sizes[1],
        alt: v.alt || props.title,
      };
    });

    this.state = {
      href: '',
      pathname: '',
    };
  }

  public componentDidMount() {
    if (this.props.update) {
      this.props.update(location.pathname);
    }

    this.setState({
      href: location.href,
      pathname: location.pathname,
    });

    [
      document.querySelector('.app__metadata title'),
      ...Array.from(document.querySelectorAll('.app__metadata meta')),
    ].forEach((v) => {
      if (v) {
        let node;

        if (v.nodeName === 'TITLE') {
          node = document.head.querySelector('title');
        } else if (v.nodeName === 'META' && v.getAttribute('last-modified')) {
          node = document.head.querySelector(`meta[last-modified='${v.getAttribute('last-modified')}']`);
        } else if (v.nodeName === 'META' && v.getAttribute('name') && v.getAttribute('content')) {
          node = document.head.querySelector(`meta[name='${v.getAttribute('name')}'][content='${v.getAttribute('content')}']`);
        } else if (v.nodeName === 'META' && v.getAttribute('property') && v.getAttribute('content')) {
          node = document.head.querySelector(`meta[property='${v.getAttribute('property')}'][content='${v.getAttribute('content')}']`);
        }

        if (node) {
          node.parentElement.removeChild(node);
        }

        document.head.appendChild(v);
      }
    });

    const metadataTag = document.querySelector('.app__metadata');

    if (metadataTag) {
      metadataTag.parentElement.removeChild(metadataTag);
    }
  }

  public render() {
    const block = bem('app');

    return (
        <section className={block()} {...this.getProps()}>
          {this.generateMetadata()}
          <Aside/>
          <Main key='main'>
            <NoJS/>
            {this.getContent()}
          </Main>
        </section>
    );
  }

  private getProps() {
    if (this.props.type === MetadataType.ARTICLE) {
      return {
        itemScope: true,
        itemType: 'https://schema.org/Article',
      };
    }

    return {};
  }

  private getContent() {
    const block = bem('app');

    if (this.props.type === MetadataType.ARTICLE) {
      const siteUrl = webmanifest.start_url.replace(/\/$/ig, '');

      return (
          <>
            <h1 itemProp='name headline about'>{this.props.h1}</h1>

            <div itemProp='articleBody' className={block('content')()}>
              {this.props.children}
            </div>

            <meta itemProp='datePublished' content={this.props.modified}/>
            <meta itemProp='dateModified' content={this.props.modified}/>
            <meta itemProp='keywords' content={this.props.keywords}/>
            <meta itemProp='description' content={this.props.description}/>
            <meta itemProp='isFamilyFriendly' content='True'/>
            <meta itemProp='inLanguage' content='ru_RU'/>
            <meta itemProp='mainEntityOfPage' content={`${siteUrl}${this.props.location}`}/>

            <Author name='Сергей Ястребов' url='https://plus.google.com/u/0/102372703586362573921'/>
            <Publisher/>

            {this.images && this.images.map((v: MetadataImage) => {
              return (
                  <span
                      key={v.src}
                      itemScope={true}
                      itemProp='image'
                      itemType='https://schema.org/ImageObject'
                  >
                    <link itemProp='contentUrl' href={v.src}/>
                    <link itemProp='url' href={v.src}/>
                    <meta itemProp='width' content={v.width}/>
                    <meta itemProp='height' content={v.height}/>
                  </span>
              );
            })}
          </>
      );
    }

    return (
        <>
          <h1>{this.props.h1}</h1>
          {this.props.children}
        </>
    );
  }

  private generateMetadata() {
    const block = bem('app');

    const siteUrl = webmanifest.start_url.replace(/\/$/ig, '');

    return (
        <div className={block('metadata')()}>
          <title>{this.props.title}</title>

          <meta name='description' content={this.props.description}/>
          <meta name='keywords' content={this.props.keywords}/>

          <meta last-modified={this.props.modified}/>

          <meta property='og:title' content={this.props.title}/>
          <meta property='og:description' content={this.props.description}/>

          <meta property='og:type' content='website'/>
          <meta property='og:url' content={`${siteUrl}${this.props.location}`}/>
          <meta property='og:locale' content='ru_RU'/>

          <meta property='og:site_name' content={webmanifest.short_name}/>
          <meta property='og:updated_time' content={this.props.modified}/>

          {this.images && this.images.map((v: MetadataImage) => {
            return (
                <div key={v.src}>
                  <meta property='og:image' content={v.src}/>
                  <meta property='og:image:type' content={v.type}/>
                  <meta property='og:image:width' content={v.width}/>
                  <meta property='og:image:height' content={v.height}/>
                  <meta property='og:image:alt' content={v.alt}/>
                </div>
            );
          })}

          {this.props.videos && this.props.videos.map((v: MetadataVideo) => {
            return (
                <div key={v.src}>
                  <meta property='og:video' content={v.src}/>
                  <meta property='og:video:type' content={v.type}/>
                  <meta property='og:video:width' content={v.width}/>
                  <meta property='og:video:height' content={v.height}/>
                </div>
            );
          })}

          {this.props.audios && this.props.audios.map((v: MetadataAudio) => {
            return (
                <div key={v.src}>
                  <meta property='og:audio' content={v.src}/>
                  <meta property='og:audio:type' content={v.type}/>
                </div>
            );
          })}
        </div>
    );
  }
}

export default connect(
    (state: StoreTree) => ({
      location: state.location,
      modified: state.modified,
    }),
    (dispatch) => ({
      update: (location: string) => dispatch(RouteAction.update(location)),
    }),
)(App);
