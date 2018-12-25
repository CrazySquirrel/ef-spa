import * as React from 'react';

import {storiesOf} from '@storybook/react';
import {withReadme} from 'storybook-readme';

import {IconChat} from './index';

const README = require('./README.md');

import './index.stories.scss';

storiesOf('Icon', module)
    .addDecorator(withReadme(README))
    .add('Chat', () => (
        <div className='wrapper'>
            {IconChat()}
        </div>
    ));
