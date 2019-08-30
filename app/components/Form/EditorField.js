// @flow
import React from 'react';
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
  name: string
};

function EditorField({ className, name, ...props }: Props) {
  return (
    <div name={name}>
      <Editor
        className={cx(styles.input, className)}
        {...props}
        {...props.input}
        {...props.meta}
        uploadFile={uploadFile}
      />
    </div>
  );
}

EditorField.Field = createField(EditorField, false);
export default EditorField;
