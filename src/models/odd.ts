import mongoose, { Document, Schema, Model } from 'mongoose';
import Joi from 'joi';

// --- Interfaces ---
interface OneXOdds {
  homeWin?: number;
  draw?: number;
  awayWin?: number;
}

interface BookieOdds {
  oneX?: OneXOdds;
  suspended?: boolean;
}

interface BestCalculatedOdds {
  homeWin: { value: number; bookie: string };
  draw: { value: number; bookie: string };
  awayWin: { value: number; bookie: string };
}

export interface IOdd extends Document {
  eventDateTime: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  suspendAll?: boolean;
  bestCalculatedOdds?: BestCalculatedOdds;
  odds: Map<string, BookieOdds>;
  order?: number;
}

// --- Schema ---
const oddSchema = new Schema<IOdd>({
  eventDateTime: { type: String, required: true },
  league: { type: String, required: true },
  homeTeam: { type: String, required: true },
  awayTeam: { type: String, required: true },
  suspendAll: { type: Boolean },
  bestCalculatedOdds: {
    homeWin: { value: Number, bookie: String },
    draw: { value: Number, bookie: String },
    awayWin: { value: Number, bookie: String },
  },
  odds: {
    type: Map,
    of: new Schema<BookieOdds>({
      oneX: {
        homeWin: Number,
        draw: Number,
        awayWin: Number,
      },
      suspended: Boolean,
    }),
  },
  order: { type: Number, min: 1 },
});

// --- Auto-order pre-save hook ---
oddSchema.pre('save', async function (next) {
  const doc = this as IOdd;
  if (!doc.order) {
    const totalOdds = await mongoose.models.Odd.countDocuments();
    doc.order = totalOdds + 1;
  }
  next();
});

// --- Model ---
const Odd: Model<IOdd> = mongoose.models.Odd || mongoose.model<IOdd>('Odd', oddSchema);

// --- Joi Validation ---
function validateOdd(req: any) {
  const oneXSchema = Joi.object({
    homeWin: Joi.number(),
    draw: Joi.number(),
    awayWin: Joi.number(),
  });

  const bookieOddsSchema = Joi.object({
    oneX: oneXSchema,
    suspended: Joi.boolean(),
  });

  const schema = Joi.object({
    isEdit: Joi.boolean().optional(),
    eventDateTime: Joi.string().when('isEdit', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
    league: Joi.string().when('isEdit', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
    homeTeam: Joi.string().when('isEdit', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
    awayTeam: Joi.string().when('isEdit', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
    suspendAll: Joi.boolean(),
    odds: Joi.object().pattern(Joi.string(), bookieOddsSchema),
  });

  return schema.validate(req);
}

// --- Export ---
export { Odd, validateOdd };
