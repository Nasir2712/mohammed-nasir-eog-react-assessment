import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import { IState } from '../../store';
import { client } from '../Weather/Weather';
import Select from 'react-select';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    margin: '10px'
  },
  grow: {
    flexGrow: 1,
  },
  selectWidth: {
      width: '50%'
  }
});

const query = `
query {
  getMetrics
}
`;

export default () => {
  return (
    <Provider value={client}>
      <SelectMetrics />
    </Provider>
  );
};

const SelectMetrics = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { metrics } = useSelector((state: IState) => state.metrics);

  const [result] = useQuery({
    query,
  });
  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.metricsApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMetrics } = data;
    dispatch(actions.metricsDataRecevied({ metrics: getMetrics }));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  return (
    <div className={classes.root}>
      <div className={classes.grow}></div>
      <Select
        isMulti
        name="metrics"
        options={metrics.map((metric: string) => {
          return {
            value: metric,
            label: metric,
          };
        })}
        className={classes.selectWidth}
        classNamePrefix="select"
      />
    </div>
  );
};
