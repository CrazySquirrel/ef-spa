import * as Sentry from '@sentry/browser';
import * as React from 'react';

interface Props {
}

interface State {
  error: Error;
}

export default class Boundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      error: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({error});

    Sentry.withScope((scope) => {
      Object.keys(errorInfo).forEach((key) => {
        scope.setExtra(key, (errorInfo as any)[key]);
      });

      Sentry.captureException(error);
    });
  }

  public render() {
    // istanbul ignore next
    if (this.state.error) {
      return (<a onClick={() => Sentry.showReportDialog()}>Отправить отчет</a>);
    } else {
      // when there's not an error, render children untouched
      return this.props.children;
    }
  }
}
