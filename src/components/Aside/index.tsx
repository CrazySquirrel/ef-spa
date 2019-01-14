import * as React from 'react';
import * as bem from 'bem-cn';

import Logotype from 'components/Logotype';

import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {StoreTree} from 'store/index';
import {AsideAction, Type} from 'store/reducers/aside';

interface Props {
  aside?: Type;
}

import './index.scss';

const block = bem('aside');

export class Aside extends React.Component<Props, {}> {
  public render() {
    return (
        <aside className={block()}>
            <span className={block('icons')()}>
              <Logotype key='logotype'/>
            </span>
        </aside>
    );
  }
}

export const mapStateToProps = (state: StoreTree) => ({
  aside: state.aside,
});

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  update: (aside: Type) => dispatch(AsideAction.aside(aside)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Aside);
