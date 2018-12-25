import * as React from 'react';

import {storiesOf} from '@storybook/react';

import NoJs from './index';

storiesOf('NoJs', module)
    .add('default', () => (
        <NoJs/>
    ));
