import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from '../state/store';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default useAppSelector;
