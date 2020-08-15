import React from 'react';
import { useSelector } from 'react-redux';
import { IState } from '../store';
import MeasurementCard, { SelectedMetric } from '../Features/Measurements/MeasurementCard';
import Grid from '@material-ui/core/Grid';

export default () => {
  const { selectedMetrics } = useSelector((state: IState) => state.metrics);
  return (
    <Grid container spacing={3}>
      {selectedMetrics.map((selectedMetric: SelectedMetric, index: number) => (
          <Grid item xs={3} key={index}><MeasurementCard selectedMetric={selectedMetric}/></Grid>
      ))}
    </Grid>
  );
};
