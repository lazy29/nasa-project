import { model, Schema } from 'mongoose';

export interface IPlanet {
  keplerName: string;
}

const planetsSchema = new Schema<IPlanet>({
  keplerName: {
    type: String,
    required: true,
  },
});

export const Planet = model<IPlanet>('Planet', planetsSchema);
