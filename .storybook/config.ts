import {configure, addDecorator} from '@storybook/react';
import {withOptions} from '@storybook/addon-options';

const WebManifest = require('../public/favicon/site.webmanifest.json');

addDecorator(withOptions({
    name: WebManifest.short_name,
    url: WebManifest.start_url,
    goFullScreen: false,
    showStoriesPanel: true,
    showAddonPanel: true,
    showSearchBox: false,
    addonPanelInRight: true,
    sortStoriesByKind: false,
    hierarchySeparator: null,
    hierarchyRootSeparator: null,
    sidebarAnimations: true,
    selectedAddonPanel: undefined,
    enableShortcuts: false,
}));

const req = require.context('../src/components', true, /.stories.tsx$/);

configure(() => req.keys().forEach(req), module);

require('../src/scss/inline.scss');
require('../src/scss/index.scss');

require('./stories.scss');
