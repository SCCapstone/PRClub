import { SerializedError } from '@reduxjs/toolkit';

export interface ServiceCallResult {
  success: boolean,
  error?: SerializedError
}
