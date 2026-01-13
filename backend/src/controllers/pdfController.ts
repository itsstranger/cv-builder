import { Request, Response } from 'express';
import puppeteer from 'puppeteer';

export const downloadPDF = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const authHeader = req.headers.authorization;
        const token = (authHeader?.split(' ')[1]) || (req.query.token as string);

        if (!token) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        // Default to localhost:9002 if not set
        const FRONTEND_URL = process.env.CORS_ORIGIN || 'http://localhost:9002';
        const targetUrl = `${FRONTEND_URL}/preview/${id}?token=${token}`;

        console.log(`Generating PDF for: ${targetUrl}`);

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Helper to wait for preview container
        await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 30000 });

        // Wait for element to ensure it's loaded
        await page.waitForSelector('#cv-preview-container', { timeout: 5000 }).catch(() => console.log('Selector timeout'));

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
            scale: 1,
            preferCSSPageSize: true
        });

        console.log(`PDF Generated. Size: ${pdfBuffer.length} bytes`);

        await browser.close();

        res.set('Content-Type', 'application/pdf');
        res.set('Content-Disposition', `attachment; filename="cv-${id}.pdf"`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error('PDF Generation Error:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
};
