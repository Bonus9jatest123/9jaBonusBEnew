import mongoose, { Schema, Document, Model } from 'mongoose';
import Joi from 'joi';

// -------------------- Interfaces --------------------

interface ILogo {
  cloudinaryId: string;
  imageUrl: string;
}

export interface IOffer extends Document {
  cons?: string;
  enabled: boolean;
  infoImage?: ILogo;
  upTo?: string;
  wageringRollover?: string;
  minOdds?: string;
  keyInfo2?: string;
  keyInfo3?: string;
  logo?: ILogo;
  name: string;
  order?: number;
  playLink: string;
  promoInfo: string;
  pros?: string;
  rating?: number;
  review?: string;
  terms?: string;
  minOddsForBonus?: number;
  selections?: Map<string, string>;
}

// -------------------- Schemas --------------------

const logoSchema = new Schema<ILogo>({
  cloudinaryId: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const offerSchema = new Schema<IOffer>({
  cons: { type: String },
  enabled: { type: Boolean, required: true },
  infoImage: logoSchema,
  upTo: { type: String },
  wageringRollover: { type: String },
  minOdds: { type: String },
  keyInfo2: { type: String },
  keyInfo3: { type: String },
  logo: logoSchema,
  name: { type: String, required: true },
  order: { type: Number, min: 1 },
  playLink: { type: String, required: true },
  promoInfo: { type: String, maxlength: 20, required: true },
  pros: { type: String },
  rating: { type: Number, min: 0, max: 5 },
  review: { type: String },
  terms: { type: String },
  minOddsForBonus: { type: Number },
  selections: {
    type: Map,
    of: {
      type: String,
    },
  },
});

// -------------------- Pre-save Hook --------------------

offerSchema.pre('save', async function (next) {
  const doc = this as IOffer;
  if (!doc.order) {
    const count = await mongoose.models.Offer.countDocuments();
    doc.order = count + 1;
  }
  next();
});

// -------------------- Model --------------------

const Offer: Model<IOffer> = mongoose.models.Offer || mongoose.model<IOffer>('Offer', offerSchema);

// -------------------- Joi Validations --------------------

const validateOffer = (req: any) => {
  const schema = Joi.object({
    isEdit: Joi.boolean().optional(),
    name: Joi.string().when('isEdit', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
    enabled: Joi.boolean().when('isEdit', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
    playLink: Joi.string().when('isEdit', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
    promoInfo: Joi.string().max(20).when('isEdit', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
    pros: Joi.string(),
    cons: Joi.string(),
    rating: Joi.number().min(0).max(5),
    review: Joi.string(),
    upTo: Joi.string(),
    wageringRollover: Joi.string(),
    minOdds: Joi.string(),
    keyInfo2: Joi.string(),
    keyInfo3: Joi.string(),
    terms: Joi.string(),
    minOddsForBonus: Joi.number(),
    selections: Joi.string(), // Optional: Use custom Joi.object if needed
  });

  return schema.validate(req);
};

const validateFileInput = (req: any) => {
  const schema = Joi.object({
    logo: Joi.array().items(
      Joi.object({
        fieldname: Joi.string().valid('logo').required(),
        mimetype: Joi.string().valid('image/png', 'image/jpg', 'image/jpeg').required(),
      }).unknown()
    ),
    infoImage: Joi.array().items(
      Joi.object({
        fieldname: Joi.string().valid('infoImage').required(),
        mimetype: Joi.string().valid('image/png', 'image/jpg', 'image/jpeg').required(),
      }).unknown()
    ),
  });

  return schema.validate(req);
};

// -------------------- Export --------------------

export { Offer, validateOffer, validateFileInput };
