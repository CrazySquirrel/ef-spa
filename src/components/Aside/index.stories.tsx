import * as React from 'react';

import {storiesOf} from '@storybook/react';

import {Aside} from './index';

storiesOf('Aside', module)
    .add('default', () => (
        <Aside/>
    ));
