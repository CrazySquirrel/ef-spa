import * as React from 'react';

import {storiesOf} from '@storybook/react';

import Link from './index';

storiesOf('Link', module)
    .add('current', () => (
        <div className='wrapper'>
            <Link>test link</Link>
        </div>
    ))
    .add('internal', () => (
        <div className='wrapper'>
            <Link to='/'>test link</Link>
        </div>
    ))
    .add('external', () => (
        <div className='wrapper'>
            <Link to='https://ef-spa.crazysquirrel.ru/'>test link</Link>
        </div>
    ));
