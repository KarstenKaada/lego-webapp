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

const EditorFieldComponent = ({
  className,
  name,
  uploadFile,
  ...props
}: Props) => {
  return (
    <div name={name}>
      <Editor
        className={cx(styles.input, className)}
        {...props}
        {...props.input}
        {...props.meta}
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
)(createField(EditorFieldComponent, false));

export default EditorField;
