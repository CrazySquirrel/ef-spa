import * as React from 'react';
import * as bem from 'bem-cn';

export const IconChatSVG = require('components/Icon/svg/icon-chat.svg').default;

interface Icon {
  viewBox: string;
  id: string;
}

interface IconProps {
  fill?: string;
  ref?: (node: SVGElement) => void;
}

export function Icon(icon: Icon, props: IconProps = {}) {
  const locals = {
    fill: props.fill,
  };

  const id = icon && icon.id && icon.id.replace('-usage', '') || '';

  const block = bem('icon');

  return (
      <svg className={block()} viewBox={icon && icon.viewBox || ''} ref={props.ref}>
        <use xlinkHref={`#${id}`} {...locals}/>
      </svg>
  );
}

export function IconChat(props?: IconProps) {
  return Icon(IconChatSVG, props);
}
