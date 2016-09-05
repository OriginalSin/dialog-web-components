import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Spinner from '../Spinner/Spinner';
import styles from './Button.css';

class Button extends Component {
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    disabled: PropTypes.bool.isRequired,
    wide: PropTypes.bool.isRequired,
    rounded: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    type: PropTypes.oneOf(['submit', 'reset', 'button', 'menu']).isRequired,
    theme: PropTypes.oneOf(['primary', 'link']).isRequired,
    size: PropTypes.oneOf(['small', 'normal', 'large']).isRequired,
    onClick: PropTypes.func
  };

  static defaultProps = {
    type: 'button',
    theme: 'primary',
    size: 'normal',
    wide: false,
    rounded: true,
    loading: false,
    disabled: false
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.children !== this.props.children ||
           nextProps.loading !== this.props.loading ||
           nextProps.disabled !== this.props.disabled ||
           nextProps.type !== this.props.type ||
           nextProps.size !== this.props.size ||
           nextProps.theme !== this.props.theme ||
           nextProps.wide !== this.props.wide ||
           nextProps.rounded !== this.props.rounded ||
           nextProps.className !== this.props.className ||
           nextProps.id !== this.props.id ||
           nextProps.name !== this.props.name;
  }

  renderLoading() {
    if (!this.props.loading) {
      return null;
    }

    return (
      <Spinner type="dotted" className={styles.loading} />
    );
  }

  render() {
    const {
      id, name, type, disabled, theme, size, wide,
      rounded, className, onClick, children
    } = this.props;

    const buttonClassName = classNames(styles.button, styles[theme], styles[size], {
      [styles.wide]: wide,
      [styles.rounded]: rounded
    }, className);

    return (
      <button
        id={id}
        name={name}
        className={buttonClassName}
        type={type}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
        {this.renderLoading()}
      </button>
    );
  }
}

export default Button;
