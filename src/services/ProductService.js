// src/services/ProductService.js
import axios from 'axios';

const API_URL = 'https://web-production-a1a1.up.railway.app/api/search';

export const ProductService = {
    async searchProducts(product) {
        try {
            const response = await axios.get(`${API_URL}/${product}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },
};
