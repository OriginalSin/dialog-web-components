/**
 * Copyright 2017 dialog LLC <info@dlg.im>
 * @flow
 */

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Icon from '../Icon/Icon';
import styles from './CheckButton.css';

export type Props = {
  className?: string,
  checked: boolean,
  theme: 'primary' | 'success' | 'danger' | 'info' | 'warning',
  size: number,
  onClick?: () => any
};

class CheckButton extends PureComponent {
  props: Props;

  static defaultProps = {
    size: 26,
    theme: 'primary'
  };

  handleClick = () => {
    if (this.props.onClick) {
      this.props.onClick(!this.props.checked);
    }
  };

  render() {
    const { checked, theme, size } = this.props;
    const className = classNames(styles.container, styles[theme], {
      [styles.checked]: checked
    }, this.props.className);

    const padding = 4;
    const tickSize = this.props.size - (padding * 2);
    const style = {
      width: size,
      height: size,
      padding
    };

    return (
      <div className={className} onClick={this.handleClick} style={style}>
        {checked ? (
          <Icon
            className={styles.icon}
            glyph="done"
            size={tickSize}
          />
        ) : null}
      </div>
    );
  }

}

export default CheckButton;
