declare const target: string;

import * as React from 'react';
import * as bem from 'bem-cn';

const block = bem('no-js');

export default class NoJS extends React.Component {
    public render() {
        if (target === 'storybook') {
            return (
                <div className={block()}>
                    You must enable JavaScript for the full operation of this site.
                </div>
            );
        }

        return (
            <noscript className={block()}>
                You must enable JavaScript for the full operation of this site.
            </noscript>
        );
    }
}
