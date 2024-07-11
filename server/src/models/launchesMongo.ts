import { model, Schema } from 'mongoose';

export interface ILaunch {
  flightNumber: number;
  mission: string;
  rocket: string;
  launchDate: Date;
  target?: string;
  customers: string[];
  upcoming: boolean;
  success: boolean;
}

const launchesSchema = new Schema<ILaunch>({
  flightNumber: {
    type: Number,
    required: true,
  },
  launchDate: {
    type: Date,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  rocket: {
    type: String,
    required: true,
  },
  target: {
    type: String,
  },
  customers: [String],
  upcoming: {
    type: Boolean,
    default: true,
    required: true,
  },
  success: {
    type: Boolean,
    default: true,
    required: true,
  },
});

// model<ILaunch>('Launch', launchesSchema) ---> Connects launchesSchema with the "launches" collection

export const Launch = model<ILaunch>('Launch', launchesSchema);
