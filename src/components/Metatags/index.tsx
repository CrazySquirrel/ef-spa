import * as React from 'react';

declare const webmanifest: any;

export const Author = ({name, url}: { name: string, url: string }) => (
    <span itemScope={true} itemProp='author' itemType='https://schema.org/Person'>
      <meta itemProp='name' content={name}/>
      <link itemProp='url' href={url}/>
    </span>
);

export const Publisher = () => (
    <span itemScope={true} itemProp='publisher' itemType='https://schema.org/Organization'>
          <meta itemProp='name' content={webmanifest.short_name}/>
          <meta itemProp='address' content='111625, Россия, Москва, ул. Святоозерская, 13'/>
          <meta itemProp='telephone' content='+7 (964) 799 - 94 - 81'/>

          <span itemScope={true} itemProp='logo' itemType='https://schema.org/ImageObject'>
            <link itemProp='contentUrl'
                  href='https://dsps.crazysquirrel.ru/favicon/android-chrome-512x512.png'/>
            <link itemProp='url'
                  href='https://dsps.crazysquirrel.ru/favicon/android-chrome-512x512.png'/>
            <meta itemProp='width' content='512'/>
            <meta itemProp='height' content='512'/>
          </span>
    </span>
);
