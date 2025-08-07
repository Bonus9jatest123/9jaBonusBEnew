// ✅ Joi messages and labels correctly handled for all nested objects
import mongoose, { Schema, Document, Types, Model } from 'mongoose';
import Joi from 'joi';

// --- Interfaces ---
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

// --- Schemas ---
const logoSchema = new Schema<ILogo>({
  cloudinaryId: { type: String, required: true },
  imageUrl: { type: String , required: true  },
});

const followUsSchema = new Schema<IFollowUs>({
  link: { type: String , required: true },
  icon: logoSchema,
});

const pageLinksSchema = new Schema<IPageLinks>({
  name: { type: String ,required: true },
  link: { type: String , required: true },
});

const accordionItemSchema = new Schema<IAccordionItem>({
  title: { type: String ,required: true  },
  text: { type: String ,required: true},
});

const accordiansSchema = new Schema<IAccordians>({
  mainTitle: { type: String ,  required: true },
  items: [accordionItemSchema],
});

const otherTextSchema = new Schema<IOtherText>({
  title: { type: String , required: true },
  icon: logoSchema,
  text: { type: String ,required: true },
});

const footerSchema = new Schema<IFooter>({
  status: { type: String, required: true, enum: ['active', 'inactive'] },
  name: { type: String, required: true },
  followUs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FollowUs' }],
  pageLinks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PageLinks' }],
  accordians: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Accordians' }],
  otherText: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OtherText' }],
});

// --- Models ---
const FollowUs: Model<IFollowUs> = mongoose.models.FollowUs || mongoose.model('FollowUs', followUsSchema);
const PageLinks: Model<IPageLinks> = mongoose.models.PageLinks || mongoose.model('PageLinks', pageLinksSchema);
const Accordians: Model<IAccordians> = mongoose.models.Accordians || mongoose.model('Accordians', accordiansSchema);
const OtherText: Model<IOtherText> = mongoose.models.OtherText || mongoose.model('OtherText', otherTextSchema);
const Footer: Model<IFooter> = mongoose.models.Footer || mongoose.model('Footer', footerSchema);

// --- Joi Validation ---
const validateFollowUs = (req: any) => {
  const schema = Joi.object({
    link: Joi.string().uri().required().label('Link'),
    icon: Joi.array().items(
      Joi.object({
        fieldname: Joi.string().valid('logo').required().label('Fieldname'),
        mimetype: Joi.string().valid('image/png', 'image/jpg', 'image/jpeg').required().label('Mimetype')
      }).unknown()
    ).label('Icon')
  }).messages({
    'any.required': '{#label} of followus is required',
    'string.uri': '{#label} of followus must be a valid URL',
    'any.only': '{#label} of followus must be one of the allowed types'
  });
  return schema.validate(req);
};

const validatePageLinks = (req: any) => {
  const schema = Joi.object({
    name: Joi.string().required().label('Name'),
    link: Joi.string().uri().required().label('Link')
  }).messages({
    'any.required': '{#label} of pagelinks is required',
    'string.uri': '{#label} of pagelink must be a valid URL'
  });
  return schema.validate(req);
};

const validateAccordians = (req: any) => {
  const schema = Joi.object({
    mainTitle: Joi.string().required().label('Main Title'),
    items: Joi.array().items(
      Joi.object({
        title: Joi.string().required().label('Accordion Title'),
        text: Joi.string().required().label('Accordion Text')
      })
    ).required().label('Accordion Items')
  }).messages({
    'any.required': '{#label} of accordian is required',
    'string.empty': '{#label} of accordian cannot be empty'
  });
  return schema.validate(req);
};

const validateOtherText = (req: any) => {
  const schema = Joi.object({
    title: Joi.string().required().label('Title'),
    icon: Joi.array().items(
      Joi.object({
        fieldname: Joi.string().valid('logo').required().label('Fieldname'),
        mimetype: Joi.string().valid('image/png', 'image/jpg', 'image/jpeg').required().label('Mimetype')
      }).unknown()
    ).label('Icon'),
    text: Joi.string().required().label('Text')
  }).messages({
    'any.required': '{#label} of othertext is required',
    'any.only': '{#label} of othertext must be one of the allowed types'
  });
  return schema.validate(req);
};

const validateStatusUpdate = (req: any) => {
  const schema = Joi.object({
    status: Joi.string().valid('active', 'inactive').required().label('Status')
  }).messages({
    'any.required': '{#label} is required',
    'any.only': '{#label} must be either "active" or "inactive"'
  });
  return schema.validate(req);
};

const validateFooter = (req: any) => {
  const schema = Joi.object({
    status: Joi.string().valid('active', 'inactive').required().label('Status'),
    name: Joi.string().required().label('Name'),
    followUs: Joi.array().label('Follow Us'),
    pageLinks: Joi.array().label('Page Links'),
    accordians: Joi.object({
      mainTitle: Joi.string().required().label('Main Title'),
      items: Joi.array().items(
        Joi.object({
          title: Joi.string().required().label('Accordion Title'),
          text: Joi.string().required().label('Accordion Text')
        })
      ).required().label('Accordion Items')
    }).label('Accordians'),
    otherText: Joi.array().label('Other Text')
  }).messages({
    'any.required': '{#label} of accordian is required',
    'string.empty': '{#label} of accordian cannot be empty'
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
  validateStatusUpdate
};
