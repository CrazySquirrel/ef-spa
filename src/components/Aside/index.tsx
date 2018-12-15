import * as React from 'react';
import * as bem from 'bem-cn';

import Logotype from 'components/Logotype';

import {connect} from 'react-redux';
import {StoreTree} from 'store/index';
import {AsideAction, Type} from 'store/reducers/aside';

interface Props {
  aside?: Type;
}

import './index.scss';

export class Aside extends React.Component<Props, {}> {
  public render() {
    const block = bem('aside');

    return (
        <aside className={block()}>
            <span className={block('icons')()}>
              <Logotype key='logotype'/>
            </span>
        </aside>
    );
  }
}

export default connect(
    (state: StoreTree) => ({
      aside: state.aside,
    }),
    (dispatch) => ({
      update: (aside: Type) => dispatch(AsideAction.aside(aside)),
    }),
)(Aside);
