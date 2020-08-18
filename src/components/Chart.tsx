import React from 'react';
import { Line, LineChart, XAxis, YAxis, Tooltip } from 'recharts';
import { useSelector } from 'react-redux';
import { IState } from '../store';
import { IData } from '../Features/Measurements/reducer';

const yAxisIdGenerator = (name: string) => {
  switch (name) {
    case 'casingPressure':
    case 'tubingPressure':
      return 'pressure';
    case 'injValveOpen':
      return 'valve';
    default:
      return 'temp';
  }
};

const yAxisGenerator = (name: string, index: number) => {
  switch (name) {
    case 'flareTemp':
    case 'waterTemp':
    case 'oilTemp':
      return (
        <YAxis
          dataKey="value"
          yAxisId="temp"
          domain={['auto', 'auto']}
          key={index}
          tickCount={14}
          tick={props => yAxisTickFormatter(props)}
          type="number"
          label={{ value: 'F', angle: -90, position: 'insideTopLeft' }}
        />
      );
    case 'casingPressure':
    case 'tubingPressure':
      return (
        <YAxis
          dataKey="value"
          yAxisId="pressure"
          key={index}
          tickCount={14}
          domain={['auto', 'auto']}
          tick={props => yAxisTickFormatter(props)}
          type="number"
          label={{ value: 'PSI', angle: -90, position: 'insideTopLeft' }}
        />
      );
    case 'injValveOpen':
      return (
        <YAxis
          dataKey="value"
          yAxisId="valve"
          key={index}
          tickCount={14}
          domain={['auto', 'auto']}
          tick={props => yAxisTickFormatter(props)}
          type="number"
          label={{ value: '%', angle: -90, position: 'insideTopLeft' }}
        />
      );
    default:
      return;
  }
};

const yAxisTickFormatter = (props: any) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#666" fontSize="10" fontFamily="sans-serif">
        {payload.value}
      </text>
    </g>
  );
};

const xAxisTickFormatter = (props: any) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#666" fontSize="10" fontFamily="sans-serif">
        {new Date(payload.value).toLocaleTimeString('en-US')}
      </text>
    </g>
  );
};

const Chart = () => {
  const { measurements: data } = useSelector((state: IState) => state.measurements);

  const colorCodes = ['#003f5c', '#444e86', '#58508d', '#bc5090', '#ff6361', '#ffa600'];

  return (
    <LineChart width={1500} height={500} margin={{ top: 30, right: 30, left: 30, bottom: 30 }}>
      <XAxis
        dataKey="at"
        name="Time"
        domain={['auto', 'auto']}
        tick={props => xAxisTickFormatter(props)}
        tickCount={12}
        interval={0}
        type="number"
      />
      {data.map((result: IData, index: number) => yAxisGenerator(result.metric, index))}
      <Tooltip
        labelFormatter={label => {
          const dateTime = new Date(label);
          return dateTime.toUTCString();
        }}
      />
      {data.map((result: IData, index: number) => (
        <Line
          type="monotone"
          name={result.metric}
          data={result.measurements}
          dataKey="value"
          stroke={colorCodes[index]}
          key={index}
          dot={false}
          yAxisId={yAxisIdGenerator(result.metric)}
        />
      ))}
    </LineChart>
  );
};

export default Chart;
