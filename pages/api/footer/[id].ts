import type { NextApiRequest, NextApiResponse } from 'next';
import { Footer, FollowUs, PageLinks, Accordians, OtherText, validateFooter, validateAccordians } from '@/models/footer';
import multer from 'multer';
import { connectDb } from '@/lib/startup/connectDb';
import { authorize } from '@/middleware/authorize';
import { deleteImage, saveImage } from '@/lib/backend.utils';
import { withCors } from '@/middleware/cors';


export const config = {
    api: {
        bodyParser: false,
    },
};

// --- Multer setup ---
const upload = multer({ storage: multer.memoryStorage() });
const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: Function) =>
    new Promise((resolve, reject) => {
        fn(req, res, (result: unknown) => {
            if (result instanceof Error) return reject(result);
            return resolve(result);
        });
    });

// --- API Handler ---
export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectDb();

        // Middleware: JWT Authorization (for POST and PUT)

        if (req.method === 'POST' || req.method == 'PUT') {
            await runMiddleware(req, res, upload.any());
            // await new Promise((resolve, reject) =>
            //     authorize(req, res, (result: unknown) => {
            //         if (result instanceof Error) return reject(result);
            //         return resolve(result);
            //     })
            // );
        }
        if (req.method === 'GET') {
            try {
                const { id } = req.query;
                if (typeof id !== 'string') {
                    return res.status(400).json({status:false, message: 'Invalid ID format' });
                }
                const footer = await Footer.findById(id)
                    .populate('followUs')
                    .populate('pageLinks')
                    .populate('accordians')
                    .populate('otherText');

                if (!footer) return res.status(404).json({status:false, message: 'Footer not found' });
                return res.status(200).json(footer);
            } catch (err: any) {
                return res.status(500).json({ error: err.message });
            }
        }
        if (req.method === 'DELETE') {
            try {
                const { id } = req.query
                if (!id) {
                    return res.status(404).send('Foter Id is required');
                }
                const footer = await Footer.findById(id);
                if (!footer) return res.status(404).send('Footer not found');
                // Delete associated images
                const followUs = await FollowUs.find({ _id: { $in: footer.followUs } });
                for (const item of followUs) {
                    if (item.icon && item.icon.cloudinaryId) {
                        await deleteImage(item.icon.cloudinaryId);
                    }
                }
                const otherText = await OtherText.find({ _id: { $in: footer.otherText } });
                for (const item of otherText) {
                    if (item.icon && item.icon.cloudinaryId) {
                        await deleteImage(item.icon.cloudinaryId);
                    }
                }
                await FollowUs.deleteMany({ _id: { $in: footer.followUs } });
                await PageLinks.deleteMany({ _id: { $in: footer.pageLinks } });
                await Accordians.deleteMany({ _id: { $in: footer.accordians } });
                await OtherText.deleteMany({ _id: { $in: footer.otherText } });
                await footer.deleteOne();
                res.send(footer);
            } catch (err: any) {
                console.error(err);
                res.status(500).send({ error: err.message });
            }
        }

        if (req.method === 'PUT') {
            try {
                const { id } = req.query;
                const footerId = Array.isArray(id) ? id[0] : id;

                // ✅ Validate ID early
                if (!footerId) {
                    return res.status(400).json({status:false, message: 'Footer Id is required' });
                }
                const { error } = validateFooter(req.body);
                if (error) {
                    console.warn('Validation failed:', error.details[0].message);
                    return res.status(400).json({ status: false, message: error.details[0].message });
                }

                let { followUs, otherText, accordians, pageLinks, ...footerData } = req.body;
                const footer = await Footer.findById(footerId).populate('followUs').populate('otherText').populate('accordians').populate('pageLinks');
                if (!footer) return res.status(404).json({ status: false, message: 'Footer not found' });

                const processItems = async (items: any, existingItems: any, model: any, fieldName: any) => {
                    if (items && items.length > 0) {
                        const processedItems = await Promise.all(
                            items.map(async (item: any, index: any) => {
                                const allFieldsUndefined = Object.values(item).every(val => val === undefined || val === 'undefined');
                                if (allFieldsUndefined) return null;

                                if (fieldName) {
                                    const file = (req as any).files.find((f: any) => f.fieldname === `${fieldName}[${index}][icon]`);
                                    if (file) {
                                        const imageData = await saveImage(file);
                                        if (imageData?.error) return null;
                                        item.icon = {
                                            cloudinaryId: imageData.cloudinaryId,
                                            imageUrl: imageData.imageUrl
                                        };
                                    } else if (existingItems[index] && existingItems[index].icon) {
                                        item.icon = existingItems[index].icon;
                                    }
                                }
                                return item;
                            })
                        );
                        const filteredItems = processedItems.filter(Boolean);
                        if (filteredItems.length === 0) return existingItems.map((item: any) => item._id);
                        const docs = await model.insertMany(filteredItems);
                        return docs.map((doc: any) => doc._id);
                    }
                    return existingItems.map((item: any) => item._id);
                };

                const [processedFollowUs, processedOtherText, processedPageLinks] = await Promise.all([
                    processItems(followUs, footer.followUs, FollowUs, 'followUs'),
                    processItems(otherText, footer.otherText, OtherText, 'otherText'),
                    processItems(pageLinks, footer.pageLinks, PageLinks, '')
                ]);

                let processedAccordians: any = [];
                if (accordians && accordians.mainTitle && accordians.items && accordians.items.length > 0) {
                    const { error } = validateAccordians(accordians);
                    if (!error) {
                        const accordianDoc = await Accordians.findOneAndUpdate(
                            { _id: { $in: footer.accordians } },
                            {
                                mainTitle: accordians.mainTitle,
                                items: accordians.items
                            },
                            { new: true, upsert: true, setDefaultsOnInsert: true }
                        );
                        processedAccordians = [accordianDoc._id];
                    } else {
                        processedAccordians = footer.accordians;
                    }
                } else {
                    processedAccordians = footer.accordians;
                }

                const updatedFooter = await Footer.findByIdAndUpdate(
                    footerId,
                    {
                        ...footerData,
                        followUs: processedFollowUs,
                        otherText: processedOtherText,
                        accordians: processedAccordians,
                        pageLinks: processedPageLinks
                    },
                    { new: true, runValidators: true }
                );
                return res.status(200).json({ status: true, message: 'Footer Updated Successfully', updatedFooter });

            } catch (err: any) {

                console.error('Error updating footer:', err);
                return res.status(500).json({ status: false, message: err.errors?.name?.message });
            }
        }
        return res.status(405).json({ error: `Method '${req.method}' not allowed` });
    } catch (error: any) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
})

