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
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const allProducts = [];

        // Navega a Plaza Vea
        const plazaVeaPage = await browser.newPage();
        await plazaVeaPage.goto(`https://www.plazavea.com.pe/search/?_query=${searchQuery}`, { waitUntil: 'networkidle2' });
        await plazaVeaPage.waitForSelector('.Showcase', { timeout: 10000 });

        // Navega a Wong
        const wongPage = await browser.newPage();
        await wongPage.goto(`https://www.wong.pe/${searchQuery}?_q=${searchQuery}&map=ft`, { waitUntil: 'networkidle2' });
        await wongPage.waitForSelector('.vtex-product-summary-2-x-container', { timeout: 10000 });

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
            const productsArray = [];

            productElements.forEach(product => {
                const name = product.querySelector('.Showcase__name')?.textContent.trim() || 'No disponible';
                const seller = product.querySelector('.Showcase__SellerName')?.textContent.trim() || 'No disponible';
                const priceString = product.querySelector('.Showcase__salePrice')?.textContent.trim() || '0'; // Extraer el precio como texto
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
            const productsArray = [];

            productElements.forEach(product => {
                const name = product.querySelector('.vtex-product-summary-2-x-productNameContainer')?.textContent.trim() || 'No disponible';

                // Extraer el precio completo desde el contenedor de precio
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
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
