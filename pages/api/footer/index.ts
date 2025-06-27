import type { NextApiRequest, NextApiResponse } from 'next';
import { Footer, FollowUs, PageLinks, Accordians, OtherText, validateFooter, validateAccordians } from '@/models/footer';

import multer from 'multer';

import { connectDb } from '@/lib/startup/connectDb';
import { authorize } from '@/middleware/authorize';
import { saveImage } from '@/lib/backend.utils';
import { withCors } from '@/middleware/cors';

// Disable Next.js default body parser (for multer)
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
        if (['POST', 'PUT', 'DELETE'].includes(req.method || '')) {
            const authResult = await new Promise((resolve, reject) =>
                authorize(req, res, (result: unknown) => {
                    if (result instanceof Error) return reject(result);
                    return resolve(result);
                })
            );
        }

        // // Multer: Only for POST
        // if (req.method === 'POST') {
           
        // }

        // --- Route Logic ---
        if (req.method === 'GET') {
            const footers = await Footer.find({}, 'name status');
            return res.status(200).json(footers);
        }

        if (req.method === 'POST') {
             await runMiddleware(req, res, upload.any());
            const { error } = validateFooter(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });
            
            let { followUs, pageLinks, accordians, otherText, ...footerData } = req.body;
            const processItems = async (items: any, model: any, fieldName: any) => {
                if (items && items.length > 0) {
                    const processedItems = await Promise.all(
                        items.map(async (item: any, index: any) => {
                            if (fieldName) {
                                const file = (req as any).files.find((f: any) => f.fieldname === `${fieldName}[${index}][icon]`);
                                if (file) {
                                    const imageData = await saveImage(file);
                                    if (imageData?.error) throw new Error(`Error processing icon`);
                                    item.icon = {
                                        cloudinaryId: imageData.cloudinaryId,
                                        imageUrl: imageData.imageUrl
                                    };
                                }
                            }
                            return item;
                        })
                    );
                    const docs = await model.insertMany(processedItems);
                    return docs.map((doc: any) => doc._id);
                }
                return [];
            };
            // Process followUs, pageLinks, and otherText
            const [processedFollowUs, processedPageLinks, processedOtherText] = await Promise.all([
                processItems(followUs, FollowUs, 'followUs'),
                processItems(pageLinks, PageLinks, ''),
                processItems(otherText, OtherText, 'otherText')
            ]);
            // Process accordians
            let processedAccordians: any[] = [];
            if (accordians && accordians.mainTitle && accordians.items && accordians.items.length > 0) {
                const { error } = validateAccordians(accordians);
                if (error) throw new Error(`Validation error: ${error.details[0].message}`);
                const accordianDoc = new Accordians({
                    mainTitle: accordians.mainTitle,
                    items: accordians.items
                });
                await accordianDoc.save();
                processedAccordians = [accordianDoc._id];
            }

            const footer = new Footer({
                ...footerData,
                followUs: processedFollowUs,
                pageLinks: processedPageLinks,
                accordians: processedAccordians,
                otherText: processedOtherText
            });
            await footer.save();
            // const files = (req as any).files as Express.Multer.File[];
            // if (files && files.length > 0) {
            //     const uploadedUrls = await Promise.all(files.map((file) => saveImage(file)));
            //     // attach image URLs to footer data as needed
            // }

            // TODO: Save footer
            return res.status(201).json(footer);
        }

        return res.status(405).json({ error: `Method '${req.method}' not allowed` });
    } catch (error: any) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
})

