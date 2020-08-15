import { createSlice, PayloadAction } from 'redux-starter-kit';


export type ApiErrorAction = {
  error: string;
};

type Measurements = {
    measurements: any[]
}

const initialState = {
  measurements: [] as any[],
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    measurementsDataReceived: (state, action: PayloadAction<Measurements>) => {
      const { measurements } = action.payload;
      state.measurements = measurements;
    },
    measurementsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
