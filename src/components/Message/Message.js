/**
 * Copyright 2017 dialog LLC <info@dlg.im>
 * @flow
 */

import type {
  Message as MessageType,
  MessageState as MessageStateType,
  PeerInfo,
  Peer
} from '@dlghq/dialog-types';
import type { MessageAttachmentType } from '../MessageAttachment/types';
import classNames from 'classnames';
import React, { PureComponent } from 'react';
import MessageContent from '../MessageContent/MessageContent';
import PeerAvatar from '../PeerAvatar/PeerAvatar';
import MessageState from '../MessageState/MessageState';
import EmojiButton from '../EmojiButton/EmojiButton';
import Hover from '../Hover/Hover';
import CopyOnly from '../CopyOnly/CopyOnly';
import MessageAttachment from '../MessageAttachment/MessageAttachment';
import CheckButton from '../CheckButton/CheckButton';
import styles from './Message.css';

export type Props = {
  message: MessageType,
  short: boolean,
  state: ?MessageStateType,
  sender: ?PeerInfo,
  className?: string,
  forceHover?: boolean,
  selected: ?boolean,
  attachment: ?MessageAttachmentType,
  onSelect?: (message: MessageType) => any,
  onTitleClick?: (message: MessageType) => any,
  onAvatarClick?: (message: MessageType) => any,
  onMentionClick?: (message: MessageType) => any,
  onLightboxOpen?: (message: MessageType) => any,
  onReaction?: (char: string) => any,
  isReactionsEnabled: boolean,
  renderActions?: () => React.Element<any>[],
  goToPeer: (peer: Peer) => any,
  goToMessage: (message: MessageType) => any
};

export type State = {
  hover: boolean
};

class Message extends PureComponent {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      hover: false
    };
  }

  handleTitleClick = () => {
    if (this.props.onTitleClick) {
      this.props.onTitleClick(this.props.message);
    }
  };

  handleAvatarClick = () => {
    if (this.props.onAvatarClick) {
      this.props.onAvatarClick(this.props.message);
    }
  };

  handleMentionClick = () => {
    if (this.props.onMentionClick) {
      this.props.onMentionClick(this.props.message);
    }
  };

  handleLightboxOpen = () => {
    if (this.props.onLightboxOpen) {
      this.props.onLightboxOpen(this.props.message);
    }
  };

  handleHover = (hover: boolean): void => {
    this.setState({ hover });
  };

  handleSelect = (): void => {
    if (this.props.onSelect) {
      this.props.onSelect(this.props.message);
    }
  };

  isHover(): boolean {
    if (this.props.forceHover) {
      return true;
    }

    return this.state.hover;
  }

  getState(): MessageStateType {
    return this.props.state || this.props.message.state;
  }

  getSender(): ?PeerInfo {
    return this.props.sender || this.props.message.sender;
  }

  renderState(): ?React.Element<any> {
    const state = this.getState();
    const { short } = this.props;
    const className = classNames(short ? styles.stateShort : null);

    return (
      <MessageState
        className={className}
        state={state}
        time={this.props.message.date}
      />
    );
  }

  renderAvatar(): ?React.Element<any> {
    const sender = this.getSender();
    if (!sender) {
      return null;
    }

    const onClick = this.props.onAvatarClick ? this.handleAvatarClick : undefined;
    const avatarClassName = classNames({
      [styles.clickable]: this.props.onAvatarClick
    });

    return (
      <div className={styles.avatar}>
        <PeerAvatar peer={sender} size={40} onClick={onClick} className={avatarClassName} />
      </div>
    );
  }

  renderHeader(): ?React.Element<any> {
    const sender = this.getSender();
    if (!sender) {
      return null;
    }

    const onTitleClick = this.props.onTitleClick ? this.handleTitleClick : null;
    const titleClassName = classNames(styles.title, {
      [styles.clickable]: this.props.onTitleClick
    });

    const onMentionClick = this.props.onMentionClick ? this.handleMentionClick : null;
    const mentionClassName = classNames(styles.username, {
      [styles.clickable]: this.props.onMentionClick
    });

    const username = sender.userName ? (
      <span className={mentionClassName} onClick={onMentionClick}>
        {`@${sender.userName}`}
      </span>
      ) : null;

    return (
      <header className={styles.header}>
        <span>
          <span className={titleClassName} onClick={onTitleClick}>{sender.title + ' '}</span>
          {username}
          {this.renderState()}
        </span>
      </header>
    );
  }

  renderShortHeader(): ?React.Element<any> {
    const { message: { date } } = this.props;
    const sender = this.getSender();
    if (!sender) {
      return null;
    }

    const username = sender.userName ? ` @${sender.userName}` : '';

    return (
      <CopyOnly>
        {sender.title + username + ' ' + date}
      </CopyOnly>
    );
  }

  renderActions(): ?React.Element<any> {
    const { selected, renderActions } = this.props;

    if (typeof selected === 'boolean') {
      return (
        <CheckButton
          checked={selected}
          onClick={this.handleSelect}
          className={styles.selector}
          theme="primary"
        />
      );
    } else if (this.isHover() && renderActions) {
      return (
        <div className={styles.actions}>
          {renderActions()}
        </div>
      );
    }

    return null;
  }

  renderReactions(): ?React.Element<any> {
    const { message } = this.props;

    if (!message.reactions || !message.reactions.length || !this.props.isReactionsEnabled) {
      return null;
    }

    const children = message.reactions.map((reaction) => {
      return (
        <EmojiButton
          className={styles.reactionButton}
          char={reaction.reaction}
          onClick={this.props.onReaction}
          active={reaction.isOwnSet}
          key={reaction.reaction}
          count={reaction.uids.length}
        />
      );
    });

    return (
      <div className={styles.reactions}>
        {children}
      </div>
    );
  }

  renderAttachments(): ?React.Element<any> {
    const { attachment } = this.props;

    if (!attachment) {
      return null;
    }

    return (
      <MessageAttachment
        attachment={attachment}
        goToPeer={this.props.goToPeer}
        goToMessage={this.props.goToMessage}
      />
    );
  }

  render(): React.Element<any> {
    const { short, message: { content, rid } } = this.props;
    const hover = this.isHover();
    const state = this.getState();
    const isError = state === 'error';
    const isPending = state === 'pending';
    const isUnread = state !== 'unknown' && state !== 'read';

    const className = classNames(
      styles.container,
      this.props.className,
      hover ? styles.hover : null,
      isError ? styles.error : null,
      isUnread ? styles.unread : null
    );

    return (
      <Hover className={className} onHover={this.handleHover}>
        <CopyOnly block />
        {this.renderActions()}
        <div className={styles.info}>
          {short ? null : this.renderAvatar()}
          {short && hover ? this.renderState() : null}
        </div>
        <div className={styles.body}>
          {short ? this.renderShortHeader() : this.renderHeader()}
          <div className={styles.content}>
            <MessageContent
              content={content}
              rid={rid}
              isPending={isPending}
              onLightboxOpen={this.handleLightboxOpen}
            />
            {this.renderAttachments()}
            {this.renderReactions()}
          </div>
        </div>
      </Hover>
    );
  }
}

export default Message;
