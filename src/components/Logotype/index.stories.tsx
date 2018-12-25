import * as React from 'react';

import {storiesOf} from '@storybook/react';

import Logotype from './index';

storiesOf('Logotype', module)
    .add('default', () => (
        <Logotype/>
    ));
