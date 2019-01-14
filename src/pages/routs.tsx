import {default as PageI, metadata as MetadataI} from './index';
import {default as Page404, metadata as Metadata404} from './404';

export default {
  '/': {
    page: PageI,
    metadata: MetadataI,
  },
  '*': {
    page: Page404,
    metadata: Metadata404,
  },
};
