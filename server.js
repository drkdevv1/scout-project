import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Objeto para almacenar la caché de productos
const cache = {};

app.get('/api/search/:query', async (req, res) => {
    const searchQuery = req.params.query.toLowerCase().trim();
    const page = parseInt(req.query.page) || 1; // Parámetro de la página, por defecto la primera
    const limit = parseInt(req.query.limit) || 20; // Límite de productos por página, por defecto 20

    // Verificar si hay resultados en caché
    if (cache[searchQuery]) {
        const allProducts = cache[searchQuery];

        // Calcular el total de páginas
        const totalPages = Math.ceil(allProducts.length / limit);

        // Calcular los productos para la página actual
        const start = (page - 1) * limit;
        const paginatedProducts = allProducts.slice(start, start + limit);

        return res.json({
            products: paginatedProducts,
            currentPage: page,
            totalPages: totalPages
        });
    }

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const allProducts = [];

        // Funciones para navegar y extraer productos
        const fetchWongProducts = async () => {
            const wongPage = await browser.newPage();
            await wongPage.goto(`https://www.wong.pe/${searchQuery}?_q=${searchQuery}&map=ft`, { waitUntil: 'networkidle2' });
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
            await wongPage.waitForSelector('.vtex-product-summary-2-x-container', { timeout: 10000 });


            const wongProducts = await wongPage.evaluate((searchQuery) => {
                const productElements = document.querySelectorAll('.vtex-product-summary-2-x-container');
                const productsArray = [];

                productElements.forEach(product => {
                    const name = product.querySelector('.vtex-product-summary-2-x-productNameContainer')?.textContent.trim() || 'No disponible';
                    const priceString = product.querySelector('.vtex-product-price-1-x-currencyContainer.vtex-product-price-1-x-currencyContainer--product-online-price')?.textContent.trim() || 'No disponible';
                    const imageUrl = product.querySelector('.vtex-product-summary-2-x-imageNormal.vtex-product-summary-2-x-image')?.getAttribute('src') || 'Sin imagen';
                    const link = product.querySelector('a')?.href || 'Sin enlace';

                    if (name.toLowerCase().includes(searchQuery.toLowerCase())&& productsArray.length < 15) {
                        productsArray.push({ name, seller: "Wong", price: priceString, imageUrl, link });
                    }
                });

                return productsArray;
            }, searchQuery);

            await wongPage.close();
            return wongProducts;
        };

        const fetchPlazaVeaProducts = async () => {
            const plazaVeaPage = await browser.newPage();
            await plazaVeaPage.goto(`https://www.plazavea.com.pe/search/?_query=${searchQuery}`, { waitUntil: 'networkidle2' });
            await plazaVeaPage.waitForSelector('.Showcase', { timeout: 10000 });

            const plazaVeaProducts = await plazaVeaPage.evaluate((searchQuery) => {
                const productElements = document.querySelectorAll('.Showcase');
                const productsArray = [];

                productElements.forEach(product => {
                    const name = product.querySelector('.Showcase__name')?.textContent.trim() || 'No disponible';
                    const seller = product.querySelector('.Showcase__SellerName')?.textContent.trim() || 'No disponible';
                    const priceString = product.querySelector('.Showcase__salePrice')?.textContent.trim() || '0';
                    const imageUrl = product.querySelector('.Showcase__photo img')?.getAttribute('src') || 'Sin imagen';
                    const link = product.querySelector('.Showcase__link')?.href || 'Sin enlace';
                    if (name.toLowerCase().includes(searchQuery.toLowerCase())&& productsArray.length < 15) {
                        productsArray.push({ name, seller, price: priceString, imageUrl, link });
                    }
                });

                return productsArray;
            }, searchQuery);

            await plazaVeaPage.close();
            return plazaVeaProducts;
        };

        const fetchTottusProducts = async () => {
            const tottusPage = await browser.newPage();
            await tottusPage.goto(`https://tottus.falabella.com.pe/tottus-pe/search?Ntt=${searchQuery}`, { waitUntil: 'networkidle2' });

            // Simula el desplazamiento para cargar más productos
            await tottusPage.evaluate(async () => {
                await new Promise((resolve) => {
                    let totalHeight = 0;
                    const distance = 100; // Cuánto desplazarse en cada intervalo
                    const timer = setInterval(() => {
                        const scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;

                        // Detenerse cuando se alcance el final de la página
                        if (totalHeight >= scrollHeight) {
                            clearInterval(timer);
                            resolve();
                        }
                    }, 100); // Intervalo de tiempo entre desplazamientos
                });
            });

            // Aumentar el tiempo de espera
            await tottusPage.waitForSelector('.jsx-1068418086', { timeout: 30000 });

            const tottusProducts = await tottusPage.evaluate((searchQuery) => {
                const productElements = document.querySelectorAll('.jsx-1068418086'); // Cambia el selector aquí
                const productsArray = [];

                productElements.forEach(product => {
                    const name = product.querySelector('.pod-subTitle')?.textContent.trim() || 'No disponible';
                    const priceElement = product.querySelector('.prices-0 .copy10') || product.querySelector('.prices-1 .copy10');
                    const priceString = priceElement?.textContent.trim() || '0';
                    const imageUrl = product.querySelector('img')?.getAttribute('src') || 'Sin imagen';
                    const link = product.querySelector('a')?.getAttribute('href') || 'Sin enlace';

                    // Verifica si el nombre incluye el término de búsqueda
                    if (name.toLowerCase().includes(searchQuery.toLowerCase())&& productsArray.length < 15) {
                        productsArray.push({ name, seller: "Tottus", price: priceString, imageUrl, link });
                    }
                });

                return productsArray;
            }, searchQuery);

            await tottusPage.close();
            return tottusProducts;
        };



        // **Recuperar productos y combinarlos**
        const [wongProducts, plazaVeaProducts, tottusProducts] = await Promise.all([
            fetchWongProducts(),
            fetchPlazaVeaProducts(),
            fetchTottusProducts()
        ]);

        allProducts.push(...wongProducts, ...plazaVeaProducts, ...tottusProducts);
        await browser.close();

        // **Almacenar productos en caché**
        cache[searchQuery] = allProducts;

        // **Ordenar productos por precio antes de la paginación**
        allProducts.sort((a, b) => {
            const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g, ""));
            const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g, ""));
            return priceA - priceB;
        });

        // Calcular el total de páginas
        const totalPages = Math.ceil(allProducts.length / limit);

        // Calcular los productos para la página actual
        const start = (page - 1) * limit;
        const paginatedProducts = allProducts.slice(start, start + limit);

        res.json({
            products: paginatedProducts,
            currentPage: page,
            totalPages: totalPages
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
