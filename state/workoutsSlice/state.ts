import { ServiceCallResult } from '../../models/state/ServiceCallResult';

interface WorkoutsInitialState {
  callingService: boolean;
  upsertWorkoutResult: ServiceCallResult | null;
  removeWorkoutResult: ServiceCallResult | null;
}

// global state for workouts accessible by all components
export const initialState: WorkoutsInitialState = {
  callingService: false,
  upsertWorkoutResult: null,
  removeWorkoutResult: null,
};
