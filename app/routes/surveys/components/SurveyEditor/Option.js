// @flow

import React from 'react';
import { RadioButton, TextInput, CheckBox } from 'app/components/Form';
import { Field } from 'redux-form';
import styles from '../surveys.css';
import { QuestionTypes } from '../../utils';

type Props = {
  questionType: string,
  updateOptions: (Object, number) => void,
  option: Object,
  isLast: number,
  index: number
};

function makeOption(optionText: string, option: Object) {
  return {
    ...option,
    optionText
  };
}

const Option = (props: Props) => {
  return props.questionType === QuestionTypes('single') ? (
    <MultipleChoice {...props} />
  ) : (
    <Checkbox {...props} />
  );
};

const MultipleChoice = (props: Props) => {
  return (
    <li>
      <RadioButton value={false} className={styles.option} />
      <Field
        onChange={props.onChange}
        name={`${props.option}.optionText`}
        component={TextInput.Field}
      />
    </li>
  );
};

const Checkbox = (props: Props) => {
  return (
    <li>
      <CheckBox checked={false} className={styles.option} />
      <Field
        onChange={props.onChange}
        name={`${props.option}.optionText`}
        component={TextInput.Field}
      />
    </li>
  );
};

export default Option;
