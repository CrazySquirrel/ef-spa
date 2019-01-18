declare const target: string;

import * as React from 'react';
import * as bem from 'bem-cn';

import * as cn from 'classnames';

import {prop} from '../../tools';

import {NavLink as RoutLink} from 'react-router-dom';

import {PAGES} from '../../routs';

import './index.scss';

export interface Props extends React.Props<Link> {
  to?: string;
  className?: string;
  replaceClassName?: string;
  title?: string;
}

const block = bem('link');

export default class Link extends React.Component<Props, {}> {
  public render() {
    const locals = {
      className: this.props.replaceClassName || cn(block(), this.props.className),
      title: this.props.title || prop(PAGES[this.props.to], 'metadata.menu'),
    };

    if (this.props.to) {
      if (this.props.to.startsWith('http') || target === 'storybook') {
        return (
            <a
                {...locals}
                target='_blank'
                rel='noreferrer'
                href={this.props.to}
            >
              {this.props.children}
            </a>
        );
      } else {
        return (
            <RoutLink
                {...locals}
                to={this.props.to}
                exact={true}
                activeClassName={this.getActiveClassName()}
            >
              {this.props.children}
            </RoutLink>
        );
      }
    } else {
      return (
          <span {...locals}>
            {this.props.children}
          </span>
      );
    }
  }

  private getActiveClassName() {
    // istanbul ignore next
    return this.props.replaceClassName || block({active: true})();
  }
}
