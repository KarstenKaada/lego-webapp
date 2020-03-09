// @flow

import React, { type Node } from 'react';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import moment from 'moment-timezone';
import styles from './components/surveys.css';
import { type ActionGrant } from 'app/models';
import config from 'app/config';
import cx from 'classnames';
import Icon from 'app/components/Icon';

const questionStrings = {
  single: 'single_choice',
  multiple: 'multiple_choice',
  text: 'text_field'
};

export const QuestionTypes = (choice: string) => {
  return questionStrings[choice] || questionStrings[0];
};

export const PresentableQuestionType = (choice: string) => {
  const questionTypeToString = {
    single_choice: 'Multiple Choice',
    multiple_choice: 'Sjekkboks',
    text_field: 'Fritekst'
  };
  return questionTypeToString[choice] || questionTypeToString[0];
};
export const mappings = (Object.keys(questionStrings).map(key => ({
  value: questionStrings[key],
  label: PresentableQuestionType(questionStrings[key])
})): Array<{ value: string, label: string }>);

export const ListNavigation = ({ title }: { title: Node }) => (
  <NavigationTab title={title} headerClassName={styles.navTab}>
    <NavigationLink to="/surveys">Liste</NavigationLink>
    <NavigationLink to="/surveys/add">Ny undersøkelse</NavigationLink>
    <NavigationLink to="/surveys/templates">Maler</NavigationLink>
  </NavigationTab>
);

export const DetailNavigation = ({
  title,
  surveyId,
  actionGrant
}: {
  title: Node,
  surveyId: number,
  actionGrant?: ActionGrant
}) => (
  <NavigationTab title={title} headerClassName={styles.navTab}>
    <NavigationLink to="/surveys">Liste</NavigationLink>
    <NavigationLink to={`/surveys/${surveyId}`}>Undersøkelsen</NavigationLink>
    <NavigationLink to={`/surveys/${surveyId}/submissions/summary`}>
      Resultater
    </NavigationLink>
  </NavigationTab>
);

export const TokenNavigation = ({
  title,
  surveyId,
  actionGrant = []
}: {
  title: Node,
  surveyId: number,
  actionGrant?: ActionGrant
}) => (
  <NavigationTab title={title} headerClassName={styles.navTab}>
    {actionGrant.includes('EDIT') && (
      <NavigationLink to={`/surveys/${surveyId}/submissions/summary`}>
        Adminversjon
      </NavigationLink>
    )}
  </NavigationTab>
);

export const defaultActiveFrom = (hours: number, minutes: number) =>
  moment()
    .startOf('day')
    .add({ hours, minutes })
    .toISOString();

export const CHART_COLORS = [
  '#c0392b',
  '#2b95d6',
  '#d9822b',
  '#3dcc91',
  '#c73aea',
  '#f4ee42',
  '#98f442',
  '#ff87eb',
  '#000000'
];

export const getCsvUrl = (surveyId: string) =>
  `${config.serverUrl}/surveys/${surveyId}/csv/`;

export const QuestionTypeOption = (
  props: Object,
  iconName: string,
  prefix?: string,
  option?: string,
  value?: string
) => (
  <div
    className={cx(props.className, styles.dropdown)}
    onMouseDown={event => {
      props.onSelect && props.onSelect(props.option, event);
    }}
    onMouseEnter={event => props.onFocus && props.onFocus(props.option, event)}
    onMouseMove={event => {
      if (props.isFocused) return;
      props.onFocus && props.onFocus(props.option, event);
    }}
  >
    <span className={styles.dropdownColor}>
      <Icon name={iconName} style={{ marginRight: '15px' }} prefix={prefix} />
      {props.children}
    </span>
  </div>
);

export const QuestionTypeValue = (
  props: Object,
  iconName: string,
  prefix?: string,
  option?: string,
  value?: string
) => (
  <div
    className={cx('Select-value', styles.dropdown)}
    onMouseDown={event => {
      props.onSelect && props.onSelect(props.option, event);
    }}
    onMouseEnter={event => props.onFocus && props.onFocus(props.option, event)}
    onMouseMove={event => {
      if (props.isFocused) return;
      props.onFocus && props.onFocus(props.option, event);
    }}
  >
    <span className={cx('Select-value-label', styles.dropdownColor)}>
      <Icon name={iconName} style={{ marginRight: '15px' }} prefix={prefix} />
      {props.children}
    </span>
  </div>
);
