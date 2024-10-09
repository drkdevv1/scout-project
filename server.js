import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api/search/:query', async (req, res) => {
    const searchQuery = req.params.query;
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            timeout: 20000 // Aumentar el tiempo de espera del navegador
        });

        const allProducts = [];

        // Navega a Plaza Vea
        const plazaVeaPage = await browser.newPage();
        await plazaVeaPage.goto(`https://www.plazavea.com.pe/search/?_query=${searchQuery}`, { waitUntil: 'networkidle2' });
        await plazaVeaPage.waitForSelector('.Showcase', { timeout: 20000 }); // Aumentar a 20 segundos

        // Navega a Wong
        const wongPage = await browser.newPage();
        await wongPage.goto(`https://www.wong.pe/${searchQuery}?_q=${searchQuery}&map=ft`, { waitUntil: 'networkidle2' });
        await wongPage.waitForSelector('.vtex-product-summary-2-x-container', { timeout: 20000 }); // Aumentar a 20 segundos

        // Simula el desplazamiento para cargar más productos en Wong
        await wongPage.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });

        // Extrae los productos de Plaza Vea
        const plazaVeaProducts = await plazaVeaPage.evaluate(() => {
            const productElements = document.querySelectorAll('.Showcase');
            if (productElements.length === 0) throw new Error('No products found on Plaza Vea');

            const productsArray = [];
            productElements.forEach(product => {
                const name = product.querySelector('.Showcase__name')?.textContent.trim() || 'No disponible';
                const seller = product.querySelector('.Showcase__SellerName')?.textContent.trim() || 'No disponible';
                const priceString = product.querySelector('.Showcase__salePrice')?.textContent.trim() || '0';
                const imageUrl = product.querySelector('.Showcase__photo img')?.getAttribute('src') || 'Sin imagen';
                const link = product.querySelector('.Showcase__link')?.href || 'Sin enlace';

                productsArray.push({ name, seller, price: priceString, imageUrl, link });
            });

            return productsArray;
        });

        allProducts.push(...plazaVeaProducts.slice(0, 10));

        // Extrae los productos de Wong
        const wongProducts = await wongPage.evaluate(() => {
            const productElements = document.querySelectorAll('.vtex-product-summary-2-x-container');
            if (productElements.length === 0) throw new Error('No products found on Wong');

            const productsArray = [];
            productElements.forEach(product => {
                const name = product.querySelector('.vtex-product-summary-2-x-productNameContainer')?.textContent.trim() || 'No disponible';
                const priceString = product.querySelector('.vtex-product-price-1-x-currencyContainer.vtex-product-price-1-x-currencyContainer--product-online-price')?.textContent.trim() || 'No disponible';
                const imageUrl = product.querySelector('.vtex-product-summary-2-x-imageNormal.vtex-product-summary-2-x-image')?.getAttribute('src') || 'Sin imagen';
                const link = product.querySelector('a')?.href || 'Sin enlace';

                productsArray.push({ name, seller: "Wong", price: priceString, imageUrl, link });
            });

            return productsArray;
        });

        allProducts.push(...wongProducts.slice(0, 10));

        await browser.close();

        res.json(allProducts);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
