import React, { useEffect, useState, useCallback } from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { actions, Measurement, SelectedMetric } from './reducer';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { Client, defaultExchanges, subscriptionExchange, Provider, useSubscription } from 'urql';
import { useDispatch } from 'react-redux';
import _ from 'lodash';

const useStyles = makeStyles({
  card: {
    margin: '10px 10px',
    backgroundColor: 'rgb(226,231,238)',
  },
});

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

type IProps = {
  selectedMetric: SelectedMetric;
};

export default (props: IProps) => {
  return (
    <Provider value={client}>
      <MeasurementCard selectedMetric={props.selectedMetric} />
    </Provider>
  );
};

const MeasurementCard = (props: IProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { selectedMetric } = props;

  const [measurement, setMeasurement] = useState({ value: 0 });

  const [result] = useSubscription({ query });
  const { data, error } = result;

  const debounceAction = useCallback(
    _.debounce((newMeasurement: Measurement) => {
      dispatch(actions.subscribedMeasurementDataReceived({ measurement: newMeasurement, selectedMetric }));
    }, 1100),
    [],
  );

  useEffect(() => {
    if (error) {
      dispatch(actions.measurementsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { newMeasurement } = data;
    if (selectedMetric.value === newMeasurement.metric) {
      setMeasurement(newMeasurement);
      debounceAction(newMeasurement); // wait for 1s before dispatching another action
    }
  }, [dispatch, data, error, selectedMetric, debounceAction]);

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6">{selectedMetric.value}</Typography>
        <Typography variant="h3">{measurement && measurement.value}</Typography>
      </CardContent>
    </Card>
  );
};
