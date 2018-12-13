import * as Sentry from '@sentry/browser';
import * as React from 'react';

interface Props {
}

interface State {
  error: any;
}

export class Boundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      error: null,
    };
  }

  public componentDidCatch(error: any, errorInfo: any) {
    this.setState({error});

    Sentry.withScope((scope) => {
      Object.keys(errorInfo).forEach((key) => {
        scope.setExtra(key, errorInfo[key]);
      });

      Sentry.captureException(error);
    });
  }

  public render() {
    if (this.state.error) {
      // render fallback UI
      return (
          <a onClick={() => Sentry.showReportDialog()}>Отправить отчет</a>
      );
    } else {
      // when there's not an error, render children untouched
      return this.props.children;
    }
  }
}
