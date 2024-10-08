// src/services/ProductService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/search';

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
