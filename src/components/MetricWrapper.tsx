import React from 'react';
import { useSelector } from 'react-redux';
import { IState } from '../store';
import MeasurementCard, { SelectedMetric } from '../Features/Measurements/MeasurementCard';

export default () => {
  const { selectedMetrics } = useSelector((state: IState) => state.metrics);
  return (
    <div>
      {selectedMetrics.map((selectedMetric: SelectedMetric, index: number) => (
          <div key={index}><MeasurementCard selectedMetric={selectedMetric}/></div>
      ))}
    </div>
  );
};
