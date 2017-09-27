import styles from './bdb.css';
import React, { Component } from 'react';
import BdbRightNav from './BdbRightNav';
import { Field } from 'redux-form';
import Button from 'app/components/Button';
import { TextInput } from 'app/components/Form';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { Link } from 'react-router';
import { createValidator, required, isEmail } from 'app/utils/validation';
import { reduxForm } from 'redux-form';

type Props = {
  submitFunction: () => void,
  handleSubmit: () => void,
  company: Object,
  companyContact?: Object,
  submitting: boolean,
  autoFocus: any,
  fetching: boolean
};

class CompanyContactEditor extends Component {
  onSubmit = formContent => {
    const { company, companyContact, submitFunction } = this.props;
    submitFunction(
      {
        ...formContent,
        companyId: company.id,
        companyContactId: companyContact && companyContact.id
      },
      true
    );
  };

  props: Props;

  render() {
    const {
      company,
      fetching,
      submitting,
      autoFocus,
      handleSubmit
    } = this.props;

    if (fetching) {
      return <LoadingIndicator />;
    }

    return (
      <div className={styles.root}>
        <h1>Bedriftskontakt</h1>
        <h3>
          <Link to={`/bdb/${company.id}`}>{company.name}</Link> sin
          bedriftskontakt.
        </h3>

        <div className={styles.detail}>
          <div className={styles.leftSection}>
            <form onSubmit={handleSubmit(this.onSubmit)}>
              <Field
                placeholder="Navn"
                autoFocus={autoFocus}
                name="name"
                component={TextInput.Field}
              />

              <Field
                placeholder="Rolle"
                autoFocus={autoFocus}
                name="role"
                component={TextInput.Field}
              />

              <Field
                placeholder={'E-mail'}
                autoFocus={autoFocus}
                name="mail"
                component={TextInput.Field}
              />

              <Field
                placeholder="Telefonnummer"
                autoFocus={autoFocus}
                name="phone"
                component={TextInput.Field}
              />

              <div className={styles.clear} />
              <Button
                className={styles.submit}
                disabled={submitting}
                submit
                style={{ marginBottom: '0!important' }}
              >
                Lagre
              </Button>
            </form>
          </div>

          <BdbRightNav {...this.props} companyId={company.id} />
        </div>
      </div>
    );
  }
}

const validate = createValidator({
  name: [required()],
  mail: [isEmail()]
});

export default reduxForm({
  form: 'companyContactEditor',
  validate,
  enableReinitialize: true
})(CompanyContactEditor);
