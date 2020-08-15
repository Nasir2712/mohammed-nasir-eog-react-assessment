import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { Provider, useQuery } from 'urql';
import { useDispatch } from 'react-redux';
import { actions } from './reducer';
import { LinearProgress } from '@material-ui/core';
import { client } from '../Weather/Weather';
import MeasurementValueSubscription from './MeasurementValueSubscription';

const useStyles = makeStyles({
  card: {
    margin: '10px 10px',
    width: '25%'
  },
});

export type SelectedMetric = {
    value: string,
    label: string
}

type IProps = {
    selectedMetric: SelectedMetric
}

const query = `
query($input: [MeasurementQuery]) {
  getMultipleMeasurements(input: $input) {
    metric
    measurements {
      at
      value
      metric
      unit
    }
  }
}
`;

export default (props: IProps) => {
  return (
    <Provider value={client}>
      <MeasurementCard selectedMetric={props.selectedMetric}/>
    </Provider>
  );
};

const MeasurementCard = (props: IProps) => {
  const classes = useStyles();
  const {selectedMetric} = props
  const dispatch = useDispatch();
  const  [measurements, setMeasurements] = useState<any[]>([]);

  const [result] = useQuery({
    query,
    variables: {
      input: [{metricName: selectedMetric.value, after: 1}],
    },
  });
  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.measurementsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMultipleMeasurements } = data;
    setMeasurements(getMultipleMeasurements);
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;
  return (
    <Card className={classes.card}>
      <CardContent>
          <Typography variant="h6">{measurements.length > 0 ? measurements[0].metric : ''}</Typography>
          <MeasurementValueSubscription metricName={selectedMetric.value}/>
      </CardContent>
    </Card>
  );
};
