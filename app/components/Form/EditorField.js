// @flow
import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import Editor from '@webkom/lego-editor';
import '@webkom/lego-editor/dist/Editor.css';
import '@webkom/lego-editor/dist/components/Toolbar.css';
import '@webkom/lego-editor/dist/components/ImageUpload.css';
import 'react-image-crop/dist/ReactCrop.css';
import { uploadFile } from 'app/actions/FileActions';
import { createField } from './Field';
import styles from './TextInput.css';

type Props = {
  type?: string,
  className?: string,
  input: any,
  meta: any,
  name: string,
  uploadFile: (file: Blob) => Promise<*>
};

const mapDispatchToProps = dispatch => {
  return {
    uploadFile: async file => {
      const response = await dispatch(uploadFile({ file, isPublic: true }));
      return { fileKey: response.meta.fileKey };
    }
  };
};

class NoSSRError {
  error: Error;
  constructor(msg) {
    this.error = new Error(msg);
  }
}

const EditorFieldComponent = ({
  className,
  name,
  uploadFile,
  ...props
}: Props) => {
  if (!__CLIENT__) {
    throw new NoSSRError('Cannot SSR editor');
  }

  return (
    <div name={name}>
      <Editor
        className={cx(styles.input, className)}
        {...props}
        {...props.meta}
        {...props.input}
        imageUpload={uploadFile}
      />
    </div>
  );
};

const EditorField = connect(
  null,
  mapDispatchToProps
)(EditorFieldComponent);

// $FlowFixMe
EditorField.Field = connect(
  null,
  mapDispatchToProps
)(createField(EditorFieldComponent, { noLabel: true }));

export default EditorField;
