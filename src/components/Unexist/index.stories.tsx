import * as React from 'react';

import {storiesOf} from '@storybook/react';
import {withKnobs, text} from '@storybook/addon-knobs';

import Unexist from './index';

const stories = storiesOf('Unexist', module);

stories.addDecorator(withKnobs);

stories.add('default', () => (
    <Unexist h1={text('H1', 'H1 test')}/>
));
