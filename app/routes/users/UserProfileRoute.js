// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import UserProfile from './components/UserProfile';
import {
  fetchUser,
  addPenalty,
  deletePenalty,
  changeGrade,
  updatePhotoConsent
} from 'app/actions/UserActions';
import { fetchAllWithType } from 'app/actions/GroupActions';
import { fetchPrevious, fetchUpcoming } from 'app/actions/EventActions';
import { fetchUserFeed } from 'app/actions/FeedActions';
import { selectUserWithGroups } from 'app/reducers/users';
import {
  selectPreviousEvents,
  selectUpcomingEvents
} from 'app/reducers/events';
import { selectGroupsWithType } from 'app/reducers/groups';
import { selectPenaltyByUserId } from 'app/reducers/penalties';
//import { selectPhotoConsents } from 'app/reducers/photoConsents';
import loadingIndicator from 'app/utils/loadingIndicator';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import prepare from 'app/utils/prepare';
import { LoginPage } from 'app/components/LoginForm';

const loadData = ({ params: { username } }, dispatch) => {
  return dispatch(fetchUser(username)).then(action =>
    Promise.all([
      dispatch(fetchPrevious()),
      dispatch(fetchUpcoming()),
      dispatch(fetchAllWithType('klasse'))
    ])
  );
  // TODO: re-enable when the user feed is fixed:
  // .then(action =>
  //   dispatch(fetchUserFeed(action.payload.result))
  //  );
};

const mapStateToProps = (state, props) => {
  const { params } = props;
  const username =
    params.username === 'me' ? state.auth.username : params.username;

  const user = selectUserWithGroups(state, { username });
  let feed;
  let feedItems;
  const previousEvents = selectPreviousEvents(state);
  const upcomingEvents = selectUpcomingEvents(state);
  let penalties;
  if (user) {
    feed = { type: 'user', activities: [] };
    feedItems = [];
    // TODO: re-enable! see above.
    // feed = selectFeedById(state, { feedId: feedIdByUserId(user.id) });
    // feedItems = selectFeedActivitesByFeedId(state, {
    //   feedId: feedIdByUserId(user.id)
    // });
    penalties = selectPenaltyByUserId(state, { userId: user.id });
    /*
    detailedPhotoConsents = selectPhotoConsents(state);
    console.log('dt' + detailedPhotoConsents);
    undefinedPhotoConsents = [];
    */
  }

  const isMe =
    params.username === 'me' || params.username === state.auth.username;
  const actionGrant = (user && user.actionGrant) || [];
  const showSettings = isMe || actionGrant.includes('edit');
  const canChangeGrade = state.allowed.groups;
  const canDeletePenalties = state.allowed.penalties;
  const groups = selectGroupsWithType(state, { groupType: 'klasse' });

  let detailedPhotoConsents = [
    {
      semester: 'H19',
      domain: 'WEBSITE',
      isConsenting: true,
      createdAt: '3. jan',
      lastUpdated: '18. mars'
    },
    {
      semester: 'H19',
      domain: 'SOCIAL_MEDIA',
      isConsenting: true,
      createdAt: '24. des',
      lastUpdated: '31. des'
    },
    {
      semester: 'V20',
      domain: 'SOCIAL_MEDIA',
      isConsenting: true,
      createdAt: '5 dager siden',
      lastUpdated: '4 dager siden'
    }
  ];
  const undefinedPhotoConsents = [
    { semester: 'V20', domain: 'WEBSITE' },
    { semester: 'H20', domain: 'WEBSITE' },
    { semester: 'H20', domain: 'SOCIAL_MEDIA' }
  ];
  return {
    username,
    auth: state.auth,
    loggedIn: props.loggedIn,
    user,
    previousEvents,
    upcomingEvents,
    feed,
    feedItems,
    showSettings,
    isMe,
    loading: state.events.fetching,
    penalties,
    canDeletePenalties,
    groups,
    canChangeGrade,
    detailedPhotoConsents,
    undefinedPhotoConsents
  };
};

const mapDispatchToProps = {
  fetchUser,
  fetchUpcoming,
  fetchUserFeed,
  addPenalty,
  deletePenalty,
  changeGrade,
  updatePhotoConsent
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare(loadData, ['params.username']),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  loadingIndicator(['user'])
)(UserProfile);
