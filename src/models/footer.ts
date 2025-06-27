import mongoose, { Schema, Document, Types, Model } from 'mongoose';
import Joi from 'joi';

// Interfaces
interface ILogo {
  cloudinaryId: string;
  imageUrl: string;
}

interface IFollowUs extends Document {
  link: string;
  icon: ILogo;
}

interface IPageLinks extends Document {
  name: string;
  link: string;
}

interface IAccordionItem {
  title: string;
  text: string;
}

interface IAccordians extends Document {
  mainTitle: string;
  items: IAccordionItem[];
}

interface IOtherText extends Document {
  title: string;
  icon: ILogo;
  text: string;
}

interface IFooter extends Document {
  status: 'active' | 'inactive';
  name: string;
  followUs: Types.ObjectId[];
  pageLinks: Types.ObjectId[];
  accordians: Types.ObjectId[];
  otherText: Types.ObjectId[];
}

// Schemas
const logoSchema = new Schema<ILogo>({
  cloudinaryId: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const followUsSchema = new Schema<IFollowUs>({
  link: { type: String, required: true },
  icon: logoSchema,
});

const pageLinksSchema = new Schema<IPageLinks>({
  name: { type: String, required: true },
  link: { type: String, required: true },
});

const accordionItemSchema = new Schema<IAccordionItem>({
  title: { type: String, required: true },
  text: { type: String, required: true },
});

const accordiansSchema = new Schema<IAccordians>({
  mainTitle: { type: String, required: true },
  items: [accordionItemSchema],
});

const otherTextSchema = new Schema<IOtherText>({
  title: { type: String, required: true },
  icon: logoSchema,
  text: { type: String, required: true },
});

const footerSchema = new Schema<IFooter>({
  status: { type: String, required: true, enum: ['active', 'inactive'] },
  name: { type: String, required: true },
  followUs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FollowUs' }],
  pageLinks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PageLinks' }],
  accordians: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Accordians' }],
  otherText: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OtherText' }],
});

// Models
const FollowUs: Model<IFollowUs> = mongoose.models.FollowUs || mongoose.model('FollowUs', followUsSchema);
const PageLinks: Model<IPageLinks> = mongoose.models.PageLinks || mongoose.model('PageLinks', pageLinksSchema);
const Accordians: Model<IAccordians> = mongoose.models.Accordians || mongoose.model('Accordians', accordiansSchema);
const OtherText: Model<IOtherText> = mongoose.models.OtherText || mongoose.model('OtherText', otherTextSchema);
const Footer: Model<IFooter> = mongoose.models.Footer || mongoose.model('Footer', footerSchema);

// Joi Validation Schemas
const validateFollowUs = (req: any) => {
  const schema = Joi.object({
    link: Joi.string().uri().required(),
    icon: Joi.array().items(
      Joi.object({
        fieldname: Joi.string().valid('logo').required(),
        mimetype: Joi.string().valid('image/png', 'image/jpg', 'image/jpeg').required(),
      }).unknown()
    ),
  });
  return schema.validate(req);
};

const validatePageLinks = (req: any) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    link: Joi.string().uri().required(),
  });
  return schema.validate(req);
};

const validateAccordians = (req: any) => {
  const schema = Joi.object({
    mainTitle: Joi.string().required(),
    items: Joi.array().items(
      Joi.object({
        title: Joi.string().required(),
        text: Joi.string().required(),
      })
    ).required(),
  });
  return schema.validate(req);
};

const validateOtherText = (req: any) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    icon: Joi.array().items(
      Joi.object({
        fieldname: Joi.string().valid('logo').required(),
        mimetype: Joi.string().valid('image/png', 'image/jpg', 'image/jpeg').required(),
      }).unknown()
    ),
    text: Joi.string().required(),
  });
  return schema.validate(req);
};

const validateStatusUpdate = (req: any) => {
  const schema = Joi.object({
    status: Joi.string().valid('active', 'inactive').required(),
  });
  return schema.validate(req);
};

const validateFooter = (req: any) => {
  const schema = Joi.object({
    status: Joi.string().valid('active', 'inactive').required(),
    name: Joi.string().required(),
    followUs: Joi.array(),
    pageLinks: Joi.array(),
    accordians: Joi.object({
      mainTitle: Joi.string().required(),
      items: Joi.array().items(
        Joi.object({
          title: Joi.string().required(),
          text: Joi.string().required(),
        })
      ).required(),
    }),
    otherText: Joi.array(),
  });
  return schema.validate(req);
};

export {
  Footer,
  FollowUs,
  PageLinks,
  Accordians,
  OtherText,
  validateFollowUs,
  validatePageLinks,
  validateAccordians,
  validateOtherText,
  validateFooter,
  validateStatusUpdate,
};
