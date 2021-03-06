/**
 * Copyright 2017 dialog LLC <info@dlg.im>
 * @flow
 */

import type { CallState } from '@dlghq/dialog-types';
import React from 'react';
import { Text } from '@dlghq/react-l10n';
import { formatTime } from '@dlghq/dialog-utils';

export type Props = {
  state: CallState,
  duration: number
};

function CallInfoState(props: Props): React.Element<any> {
  switch (props.state) {
    case 'connecting_to_server':
    case 'connecting_to_peer':
    case 'ringing_outgoing':
    case 'ringing_incoming':
    case 'connecting':
    case 'ended':
      return (
        <Text id={`Call.${props.state}`} />
      );

    case 'in_progress':
      return (
        <span>{formatTime(props.duration)}</span>
      );

    default:
      return (
        <Text id="Call.unknown" />
      );
  }
}

export default CallInfoState;
