// @flow

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import LoadingIndicator from 'app/components/LoadingIndicator';
import GroupMembersList from './GroupMembersList';
import AddGroupMember from './AddGroupMember';
import prepare from 'app/utils/prepare';
import styles from './GroupMembers.css';
import {
  fetchMemberships,
  fetchMembershipsPagination,
  addMember,
  removeMember
} from 'app/actions/GroupActions';
import { selectMembershipsForGroup } from 'app/reducers/memberships';
import type { AddMemberArgs } from 'app/actions/GroupActions';
import { get } from 'lodash';

type Props = {
  group: Object,
  hasMore: boolean,
  fetch: ({ groupId: string, next: true }) => Promise<*>,
  fetching: boolean,
  groupsById: { [string]: { name: string } },
  memberships: Array<Object>,
  showDescendants: boolean,
  addMember: AddMemberArgs => Promise<*>,
  removeMember: Object => Promise<*>
};

export const GroupMembers = ({
  addMember,
  removeMember,
  group,
  memberships,
  hasMore,
  fetching,
  showDescendants,
  groupsById,
  fetch
}: Props) => (
  <div className={styles.groupMembers}>
    {showDescendants || <AddGroupMember addMember={addMember} group={group} />}
    <LoadingIndicator loading={!memberships}>
      <h3 className={styles.subTitle}>Brukere</h3>
      <GroupMembersList
        group={group}
        hasMore={hasMore}
        groupsById={groupsById}
        fetch={fetch}
        fetching={fetching}
        showDescendants={showDescendants}
        removeMember={removeMember}
        memberships={memberships}
      />
    </LoadingIndicator>
  </div>
);

function loadData({ params, location }, dispatch) {
  const showDescendants = location.search.includes('descendants=true');
  return dispatch(fetchMemberships(params.groupId, showDescendants));
}

function mapStateToProps(state, props) {
  const showDescendants = location.search.includes('descendants=true');
  const memberships = selectMembershipsForGroup(state, {
    groupId: props.params.groupId,
    descendants: showDescendants
  });

  const groupId = props.group && props.group.id;

  return {
    memberships,
    groupsById: state.groups.byId,
    fetching: state.memberships.fetching,
    showDescendants,
    hasMore: get(state, ['memberships', 'pagination', groupId, 'hasMore'])
  };
}

const mapDispatchToProps = {
  addMember,
  removeMember,
  fetch: fetchMembershipsPagination
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  prepare(loadData, ['params.groupId', 'location'])
)(GroupMembers);
