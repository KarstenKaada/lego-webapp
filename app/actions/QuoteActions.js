// @flow

import { push } from 'react-router-redux';
import { startSubmit, stopSubmit } from 'redux-form';
import { quoteSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { Quote } from './ActionTypes';
import { addNotification } from 'app/actions/NotificationActions';
import type { Thunk } from 'app/types';

export function fetchAll({ approved = true }: { approved: boolean }) {
  return callAPI({
    types: Quote.FETCH,
    endpoint: `/quotes/?approved=${String(approved)}`,
    schema: [quoteSchema],
    meta: {
      errorMessage: `Henting av ${approved ? '' : 'un'}godkjente quotes feilet`
    },
    propagateError: true
  });
}

export function fetchAllApproved() {
  return fetchAll({ approved: true });
}

export function fetchAllUnapproved() {
  return fetchAll({ approved: false });
}

export function fetchQuote(quoteId: number) {
  return callAPI({
    types: Quote.FETCH,
    endpoint: `/quotes/${quoteId}/`,
    method: 'get',
    meta: {
      quoteId,
      errorMessage: 'Henting av quote feilet'
    },
    schema: quoteSchema,
    propagateError: true
  });
}

export function fetchRandomQuote() {
  return callAPI({
    types: Quote.FETCH,
    endpoint: '/quotes/random/',
    method: 'get',
    meta: {
      errorMessage: 'Henting av tilfeldig quote feilet'
    },
    schema: quoteSchema
  });
}

export function approve(quoteId: number) {
  return callAPI({
    types: Quote.APPROVE,
    endpoint: `/quotes/${quoteId}/approve/`,
    method: 'put',
    meta: {
      errorMessage: 'Godkjenning av quote feilet',
      quoteId: Number(quoteId)
    }
  });
}

export function unapprove(quoteId: number) {
  return callAPI({
    types: Quote.UNAPPROVE,
    endpoint: `/quotes/${quoteId}/unapprove/`,
    method: 'put',
    meta: {
      errorMessage: 'Underkjenning av quote feilet',
      quoteId: Number(quoteId)
    }
  });
}

export function addQuotes({
  text,
  source
}: {
  text: string,
  source: string
}): Thunk<*> {
  return dispatch => {
    dispatch(startSubmit('addQuote'));

    dispatch(
      callAPI({
        types: Quote.ADD,
        endpoint: '/quotes/',
        method: 'post',
        body: {
          text,
          source
        },
        schema: quoteSchema,
        meta: {
          errorMessage: 'Legg til quote feilet'
        }
      })
    )
      .then(() => {
        dispatch(stopSubmit('addQuote'));
        dispatch(push('/quotes'));
        dispatch(
          addNotification({
            message:
              'Sitat sendt inn. Hvis det blir godkjent vil det dukke opp her!',
            dismissAfter: 10000
          })
        );
      })
      .catch(action => {
        const errors = { ...action.error.response.jsonData };
        dispatch(stopSubmit('addQuote', errors));
      });
  };
}

export function deleteQuote(quoteId: number) {
  return callAPI({
    types: Quote.DELETE,
    endpoint: `/quotes/${quoteId}/`,
    method: 'delete',
    meta: {
      quoteId: Number(quoteId),
      errorMessage: 'Sletting av quote feilet'
    }
  });
}
