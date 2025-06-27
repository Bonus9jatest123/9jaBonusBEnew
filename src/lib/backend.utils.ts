import Joi, { ValidationResult } from 'joi';
import { cloudinary } from '@/lib/startup/cloudinary';
import type { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

interface BookieOdds {
  oneX?: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
  suspended?: boolean;
}

interface OddsObject {
  [bookie: string]: BookieOdds;
}

interface BestOddsResult {
  homeWin: { value: number; bookie: string };
  draw: { value: number; bookie: string };
  awayWin: { value: number; bookie: string };
}

interface ErrorResult {
  error: string;
}
interface UploadedFile {
  buffer: Buffer;
  mimetype: string;
}

interface SaveImageResult {
  cloudinaryId?: string;
  imageUrl?: string;
  error?: boolean;
}

/**
 * Validate sorting order input
 */
function validateOrder(req: unknown): ValidationResult {
  const schema = Joi.object({
    id: Joi.string().required(),
    order: Joi.number().min(1).required(),
  });

  return schema.validate(req);
}

/**
 * Validate pagination input
 */
function validatePagination(req: unknown): ValidationResult {
  const schema = Joi.object({
    pageNumber: Joi.number().min(1).required(),
    pageSize: Joi.number().min(1).required(),
    disabled: Joi.boolean(),
  });

  return schema.validate(req);
}

/**
 * Determine best odds from bookie odds object
 */
function findBestOdds(odds: OddsObject): BestOddsResult | ErrorResult {
  const bestOdds: BestOddsResult = {
    homeWin: { value: 0, bookie: '' },
    draw: { value: 0, bookie: '' },
    awayWin: { value: 0, bookie: '' },
  };

  for (const bookie in odds) {
    if (!Object.prototype.hasOwnProperty.call(odds, bookie)) continue;

    const bookieData = odds[bookie];
 
    if (!bookieData?.oneX) return { error: 'oneX not provided' };

    if (!bookieData.suspended) {
      const { oneX } = bookieData;

      if (oneX.homeWin > bestOdds.homeWin.value) {
        bestOdds.homeWin = { value: oneX.homeWin, bookie };
      }
      if (oneX.draw > bestOdds.draw.value) {
        bestOdds.draw = { value: oneX.draw, bookie };
      }
      if (oneX.awayWin > bestOdds.awayWin.value) {
        bestOdds.awayWin = { value: oneX.awayWin, bookie };
      }
    }
  }

  return bestOdds;
}

// Define a type for the expected `file` object
// console.log('Cloudinary ENV:', {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

  async function saveImage(
  file: UploadedFile,
  cloudinaryId: string | null = null,
  isLogo: boolean = false
): Promise<SaveImageResult> {
  try {
    const encodedImage = file.buffer.toString('base64');
    const dataURI = `data:${file.mimetype};base64,${encodedImage}`;

    const transformation = isLogo
      ? [
          {
            width: 300,
            crop: 'scale',
          },
        ]
      : [];

    const uploadOptions: Record<string, any> = {
      ...(cloudinaryId && { public_id: cloudinaryId, overwrite: true }),
      transformation,
    };

    const result: UploadApiResponse = await cloudinary.uploader.upload(dataURI, uploadOptions);

    return {
      cloudinaryId: result.public_id,
      imageUrl: result.secure_url,
    };
  } catch (error) {
    console.error('Error processing image and offer:', error);
    return { error: true };
  }
}

async function deleteImage(cloudinaryId:any) {
  try {
    const result = await cloudinary.uploader.destroy(cloudinaryId);
    if (result.result === 'ok') {
      return true;
    } else {
      throw new Error(result);
    }
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
}


export {
  validateOrder,
  validatePagination,
  findBestOdds,
  saveImage,
  deleteImage,
};
