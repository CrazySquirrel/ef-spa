import * as React from 'react';
import * as bem from 'bem-cn';

import bind from 'bind-decorator';

// istanbul ignore next
import {RouteAction} from 'store/reducers/router';

import Aside from 'components/Aside';
import Main from 'components/Main';
import NoJS from 'components/NoJS';

import {Publisher, Author} from 'components/Metatags';

import {StoreTree} from '../../store';
import {connect} from 'react-redux';

// istanbul ignore next
import {
  MetadataImage,
  MetadataVideo,
  MetadataAudio,
  MetadataType,
  MetadataAuthor,
} from '../../types';

declare const webmanifest: any;

interface OwnProps {
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

interface StateProps {
  location?: string;
  modified?: string;

  update?: (location: string) => any;
}

interface Props extends OwnProps, StateProps {
}

interface State {
}

import './index.scss';
import {Dispatch} from 'redux';

const block = bem('app');

export class App extends React.Component<Props, State> {
  private ref: HTMLElement;
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
  }

  public componentDidMount() {
    if (this.props.update) {
      this.props.update(location.pathname);
    }

    this.updateMetatags();
  }

  public render() {
    return (
        <section className={block()} {...this.getProps()} ref={this.handleRef}>
          {this.generateMetadata()}
          <Aside/>
          <Main key='main'>
            <NoJS/>
            {this.getContent()}
          </Main>
        </section>
    );
  }

  @bind
  private handleRef(ref: HTMLElement) {
    this.ref = ref;
  }

  private updateMetatags() {
    if (!this.ref) {
      return;
    }

    [
      this.ref.querySelector('.app__metadata title'),
      ...Array.from(this.ref.querySelectorAll('.app__metadata meta')),
    ].forEach((v) => {
      let node;

      if (v.nodeName === 'META' && v.getAttribute('last-modified')) {
        node = document.head.querySelector(`meta[last-modified='${v.getAttribute('last-modified')}']`);
      } else if (v.nodeName === 'META' && v.getAttribute('name') && v.getAttribute('content')) {
        node = document.head.querySelector(`meta[name='${v.getAttribute('name')}'][content='${v.getAttribute('content')}']`);
      } else if (v.nodeName === 'META' && v.getAttribute('property') && v.getAttribute('content')) {
        node = document.head.querySelector(`meta[property='${v.getAttribute('property')}'][content='${v.getAttribute('content')}']`);
      } else {
        node = document.head.querySelector('title');
      }

      if (node) {
        node.parentElement.removeChild(node);
      }

      document.head.appendChild(v);
    });

    const metadataTag = this.ref.querySelector('.app__metadata');

    metadataTag.parentElement.removeChild(metadataTag);
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
    const siteUrl = webmanifest.start_url.replace(/\/$/ig, '');

    return (
        <div className={block('metadata')()}>
          {this.props.title && (
              <title>{this.props.title}</title>
          )}

          {this.props.description && (
              <meta name='description' content={this.props.description}/>
          )}

          {this.props.keywords && (
              <meta name='keywords' content={this.props.keywords}/>
          )}

          {this.props.modified && (
              <meta last-modified={this.props.modified}/>
          )}

          {this.props.title && (
              <meta property='og:title' content={this.props.title}/>
          )}

          {this.props.description && (
              <meta property='og:description' content={this.props.description}/>
          )}

          <meta property='og:type' content='website'/>

          {siteUrl && this.props.location && (
              <meta property='og:url' content={`${siteUrl}${this.props.location}`}/>
          )}

          <meta property='og:locale' content='en_EN'/>

          {webmanifest.short_name && (
              <meta property='og:site_name' content={webmanifest.short_name}/>
          )}

          {this.props.modified && (
              <meta property='og:updated_time' content={this.props.modified}/>
          )}

          {Array.isArray(this.images) && this.images.map((v: MetadataImage) => {
            return (
                <div key={v.src}>
                  {v.src && (<meta property='og:image' content={v.src}/>)}
                  {v.type && (<meta property='og:image:type' content={v.type}/>)}
                  {v.width && (<meta property='og:image:width' content={v.width}/>)}
                  {v.height && (<meta property='og:image:height' content={v.height}/>)}
                  {v.alt && (<meta property='og:image:alt' content={v.alt}/>)}
                </div>
            );
          })}

          {Array.isArray(this.props.videos) && this.props.videos.map((v: MetadataVideo) => {
            return (
                <div key={v.src}>
                  {v.src && (<meta property='og:video' content={v.src}/>)}
                  {v.type && (<meta property='og:video:type' content={v.type}/>)}
                  {v.width && (<meta property='og:video:width' content={v.width}/>)}
                  {v.height && (<meta property='og:video:height' content={v.height}/>)}
                </div>
            );
          })}

          {Array.isArray(this.props.audios) && this.props.audios.map((v: MetadataAudio) => {
            return (
                <div key={v.src}>
                  {v.src && (<meta property='og:audio' content={v.src}/>)}
                  {v.type && (<meta property='og:audio:type' content={v.type}/>)}
                </div>
            );
          })}
        </div>
    );
  }
}

export const mapStateToProps = (state: StoreTree) => ({
  location: state.location,
  modified: state.modified,
});

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  update: (location: string) => dispatch(RouteAction.update(location)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
