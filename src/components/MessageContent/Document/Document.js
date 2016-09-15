import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Icon from '../../Icon';
import styles from './Document.css';

class Document extends Component {
  static propTypes = {
    fileUrl: PropTypes.string,
    fileName: PropTypes.string,
    fileSize: PropTypes.string,
    fileExtension: PropTypes.string,
    isUploading: PropTypes.bool.isRequired
  };

  static defaultProps = {
    isUploading: true
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.fileExtension !== this.props.fileExtension ||
           nextProps.fileName !== this.props.fileName ||
           nextProps.fileSize !== this.props.fileSize ||
           nextProps.fileUrl !== this.props.fileUrl ||
           nextProps.isUploading !== this.props.isUploading;
  }

  getDocumentType() {
    const { fileExtension } = this.props;

    switch (fileExtension) {
      case 'pdf':
      case 'doc':
      case 'docx':
        return 'doc';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return 'picture';
      case 'mov':
      case 'mpeg':
      case 'avi':
        return 'media';
      default:
        return 'unknown';
    }
  }

  renderPreview() {
    const { fileExtension } = this.props;
    const type = this.getDocumentType();
    const className = classNames(styles.preview, styles[type]);

    return (
      <div className={className}>
        {fileExtension}
      </div>
    );
  }

  renderInfo() {
    const { fileName, fileSize } = this.props;

    return (
      <div className={styles.info}>
        <div className={styles.filename}>{fileName}</div>
        <div className={styles.sizeBlock}>
          <Icon glyph="arrow_downward" className={styles.downloadArrow}/>
          <span className={styles.size}>{fileSize}</span>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.root}>
        {this.renderPreview()}
        {this.renderInfo()}
      </div>
    );
  }
}

export default Document;