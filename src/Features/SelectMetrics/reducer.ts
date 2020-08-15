import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Metrics = {
  metrics: [];
};

export type SelectedMetrics = {
  selectedMetrics: [],
}

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  metrics: [],
  selectedMetrics: [],
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    metricsDataRecevied: (state, action: PayloadAction<Metrics>) => {
      const { metrics } = action.payload;
      state.metrics = metrics;
    },
    metricsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
    metricsSelected: (state, action: PayloadAction<SelectedMetrics>) => {
        const { selectedMetrics } = action.payload;
        const checkNull = selectedMetrics === null ? [] : selectedMetrics
        state.selectedMetrics = checkNull;
      },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
