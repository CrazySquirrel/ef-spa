import {configure, addDecorator} from '@storybook/react';
import {withOptions} from '@storybook/addon-options';

const WebManifest = require('../public/favicon/site.webmanifest.json');

// set global params
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

// set dynamic stories import
const req = require.context('../src/components', true, /.stories.tsx$/);

configure(() => req.keys().forEach(req), module);

// import global components and stories files
require('../src/scss/inline.scss');
require('../src/scss/index.scss');

require('./stories.scss');
