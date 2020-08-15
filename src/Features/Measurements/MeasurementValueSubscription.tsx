import React, { useEffect, useState } from 'react';
//import { makeStyles } from '@material-ui/core/styles';
import { Provider, Client, defaultExchanges, subscriptionExchange, useSubscription } from 'urql';
import { useDispatch } from 'react-redux';
import { actions } from './reducer';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { Typography } from '@material-ui/core';

export type SelectedMetric = {
  value: string;
  label: string;
};

type IProps = {
  metricName: string;
};

const query = `
subscription MeasurementSub {
    newMeasurement {
    metric
    at
    value
    unit
    }
  }
`;

const subscriptionClient = new SubscriptionClient('wss://react.eogresources.com/graphql', { reconnect: true });
const client = new Client({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription(operation) {
        return subscriptionClient.request(operation);
      },
    }),
  ],
});

export default (props: IProps) => {
  return (
    <Provider value={client}>
      <MeasurementValue metricName={props.metricName} />
    </Provider>
  );
};

const MeasurementValue = (props: IProps) => {
  const dispatch = useDispatch();
  const { metricName } = props;
  const [measurement, setMeasurement] = useState<{ value: string }>({ value: '' });
  const [result] = useSubscription({ query });
  const { data, error } = result;
  useEffect(() => {
    if (error) {
      console.log(error);
      dispatch(actions.measurementsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { newMeasurement } = data;
    if (newMeasurement.metric === metricName) {
      setMeasurement(newMeasurement);
    }
  }, [dispatch, data, error, metricName]);

  return <Typography variant="h3">{measurement && measurement.value}</Typography>;
};
