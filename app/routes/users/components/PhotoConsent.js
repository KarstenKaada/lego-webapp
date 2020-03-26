// @flow

import React, { Component } from 'react';
import Select from 'react-select';
import Button from 'app/components/Button';
import Flex from 'app/components/Layout/Flex';
import cx from 'classnames';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import type {
  PhotoConsentModel,
  DetailedPhotoConsentModel,
  NewPhotoConsent,
  PhotoConsentDomain
} from 'app/models';

import styles from './PhotoConsent.css';

type Props = {
  undefinedPhotoConsents: Array<NewPhotoConsent>,
  photoConsents: Array<DetailedPhotoConsentModel>,
  updatePhotoConsent: PhotoConsentModel => Promise<*>
};

type Option = {
  value: string,
  label: string
};

type State = {
  selectedOption: ?Option
};

class PhotoConsent extends Component<Props, State> {
  constructor() {
    super();
    this.state = {
      selectedOption: null
    };
  }

  handleChange = (selectedOption: Option): void => {
    this.setState({ selectedOption });
  };

  render() {
    const {
      undefinedPhotoConsents,
      photoConsents,
      updatePhotoConsent
    } = this.props;
    const { selectedOption } = this.state;

    const getYear = (semesterStr: string): number =>
      parseInt(semesterStr.substr(1, 2));

    const getSemester = (semesterStr: string): string => semesterStr.charAt(0);

    const convertToReadableSemester = (semesterYear: string): string => {
      let result = '';
      if (getSemester(semesterYear) == 'H') {
        result = result + 'høsten ';
      } else {
        result = result + 'våren ';
      }

      result = result + getYear(semesterYear);
      return result;
    };

    const getAllSemesters = (): Array<string> => [
      ...new Set([
        ...undefinedPhotoConsents.map(c => c.semester),
        ...photoConsents.map(c => c.semester)
      ])
    ];

    const getMostRecentSemester = (semesterList: Array<string>): string => {
      let mostRecentSemester = 'H00';
      semesterList.forEach(semester => {
        const y1 = getYear(mostRecentSemester);
        const y2 = getYear(semester);

        if (y2 > y1) {
          mostRecentSemester = semester;
        } else if (y2 === y1) {
          const s2 = getSemester(semester);
          if (s2 == 'V') {
            mostRecentSemester = semester;
          }
        }
      });
      return mostRecentSemester;
    };

    const getInitialOption = (): Option => {
      const allSemesters = getAllSemesters();
      const mostRecentSemester = getMostRecentSemester(allSemesters);
      const initialOption = {
        value: mostRecentSemester,
        label: mostRecentSemester
      };
      this.setState({
        selectedOption: initialOption
      });
      return initialOption;
    };

    const createOptions = (): Array<Option> =>
      getAllSemesters().map(semester => ({
        value: semester,
        label: semester
      }));

    const getSelectedSemester = (): string =>
      (selectedOption && selectedOption.value) || '';

    const getConsent = (
      semester: string,
      domain: PhotoConsentDomain
    ): ?DetailedPhotoConsentModel =>
      photoConsents.find(
        (pc: DetailedPhotoConsentModel): boolean =>
          pc.semester === semester && pc.domain === domain
      );

    const getConsentValue = (
      semester: string,
      domain: PhotoConsentDomain
    ): ?boolean => {
      const consent = getConsent(semester, domain);
      return consent === undefined
        ? undefined
        : consent && consent.isConsenting;
    };

    const getConsentCreationDate = (domain: PhotoConsentDomain): string => {
      const consent = getConsent(getSelectedSemester(), domain);
      return (consent && consent.createdAt &&  consent.createdAt.toString()) || 'aldri';
    };

    const getConsentLastUpdated = (domain: PhotoConsentDomain): string => {
      const consent = getConsent(getSelectedSemester(), domain);
      return (consent && consent.lastUpdated && consent.lastUpdated.toString()) || 'aldri';
    };

    const getButtonClass = (isConsentBtn, domain) => {
      const consenting = getConsentValue(getSelectedSemester(), domain);

      if (domain == 'SOCIAL_MEDIA') {
        if (isConsentBtn) {
          if (consenting === undefined) return styles.consentBtn;

          return cx(styles.consentBtn, consenting ? styles.selectedBtn : '');
        }

        if (consenting === undefined) return styles.notConsentBtn;

        return cx(styles.notConsentBtn, !consenting ? styles.selectedBtn : '');
      }

      if (isConsentBtn) {
        if (consenting === undefined) return styles.consentBtn;

        return cx(styles.consentBtn, consenting ? styles.selectedBtn : '');
      }

      if (consenting === undefined) return styles.notConsentBtn;

      return cx(styles.notConsentBtn, !consenting ? styles.selectedBtn : '');
    };

    return (
      <Flex column={true}>
        <label htmlFor="select-semester">
          <h3>Semester</h3>
        </label>
        <Select
          name="select-semester"
          clearable={false}
          options={createOptions()}
          value={selectedOption || getInitialOption()}
          onChange={this.handleChange}
        />

        <h4 className={styles.categoryTitle}>Sosiale medier</h4>

        <h5>
          Jeg godtar at Abakus kan legge ut bilder av meg på sosiale medier i
          perioden {convertToReadableSemester(getSelectedSemester())}:
        </h5>
        <div className={styles.statusContainer}>
          <div>
            <b>Først gitt: </b>

            <i>{getConsentCreationDate('SOCIAL_MEDIA')}</i>
          </div>
          <div>
            <b>Sist oppdatert: </b>
            <i>{getConsentLastUpdated('SOCIAL_MEDIA')}</i>
          </div>
        </div>
        <div>
          <ConfirmModalWithParent
            title="Trekke bildesamtykke på sosiale medier"
            message={
              'Er du sikker på at du vil trekke bildesamtykket ditt for ' +
              convertToReadableSemester(getSelectedSemester()) +
              ' på sosiale medier? Dette innebærer at noen må manuelt gå gjennom alle bildene fra arrangementene du har deltatt på i perioden ' +
              convertToReadableSemester(getSelectedSemester()) +
              ', og fjerne dem. Dersom du ønsker å fjerne noen spesifike bilder, kan du i stedet sende en epost til pr@abakus.no.'
            }
            onConfirm={() =>
              updatePhotoConsent({
                semester: getSelectedSemester(),
                domain: 'SOCIAL_MEDIA',
                isConsenting: false
              })
            }
          >
            <Button className={getButtonClass(false, 'SOCIAL_MEDIA')}>
              Nei
            </Button>
          </ConfirmModalWithParent>
          <Button
            onClick={() =>
              updatePhotoConsent({
                semester: getSelectedSemester(),
                domain: 'SOCIAL_MEDIA',
                isConsenting: true
              })
            }
            className={getButtonClass(true, 'SOCIAL_MEDIA')}
          >
            Ja
          </Button>
        </div>

        <h4 className={styles.categoryTitle}>Abakus.no</h4>
        <h5>
          Jeg godtar at Abakus kan legge ut bilder av meg på Abakus.no i
          perioden {convertToReadableSemester(getSelectedSemester())}:
        </h5>
        <div className={styles.statusContainer}>
          <div>
            <b>Først gitt: </b>
            {}
            <i>{getConsentCreationDate('WEBSITE')}</i>
          </div>
          <div>
            <b>Sist oppdatert: </b>
            <i>{getConsentLastUpdated('WEBSITE')}</i>
          </div>
        </div>
        <div>
          <ConfirmModalWithParent
            title="Trekke bildesamtykke på Abakus.no"
            message={
              'Er du sikker på at du vil trekke bildesamtykket ditt for ' +
              convertToReadableSemester(getSelectedSemester()) +
              ' på Abakus.no? Dette innebærer at noen må manuelt gå gjennom alle bildene fra arrangementene du har deltatt på i perioden ' +
              convertToReadableSemester(getSelectedSemester()) +
              ', og fjerne dem. Dersom du ønsker å fjerne noen spesifike bilder, kan du i stedet rapportere dem i galleriet, eller sende en epost til pr@abakus.no.'
            }
            onConfirm={() =>
              updatePhotoConsent({
                semester: getSelectedSemester(),
                domain: 'WEBSITE',
                isConsenting: false
              })
            }
          >
            <Button className={getButtonClass(false, 'WEBSITE')}>Nei</Button>
          </ConfirmModalWithParent>
          <Button
            onClick={() =>
              updatePhotoConsent({
                semester: getSelectedSemester(),
                domain: 'WEBSITE',
                isConsenting: true
              })
            }
            className={getButtonClass(true, 'WEBSITE')}
          >
            Ja
          </Button>
        </div>
      </Flex>
    );
  }
}

export default PhotoConsent;
