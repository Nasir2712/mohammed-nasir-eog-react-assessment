import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as metricsReducer } from '../Features/SelectMetrics/reducer'

export default {
  weather: weatherReducer,
  metrics: metricsReducer
};
