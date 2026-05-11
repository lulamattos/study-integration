const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Rota que simula a "Integração"
app.get('/integration/products', async (req, res) => {
    try {
        // O Node "bate" na porta do Laravel (Docker)
        // Dica: Se 'localhost' não funcionar dentro do container, tente '127.0.0.1'
        const response = await axios.get('http://localhost/api/products');
        
        const products = response.data;

        // Simulando uma lógica de Middleware (Tratamento de dados)
        const mappedProducts = products.map(p => ({
            id: p.id,
            nome_vtex: p.name.toUpperCase(), // VTEX costuma usar nomes em Caps
            codigo_sku: p.sku,
            preco: `R$ ${p.price}`,
            em_estoque: p.stock > 0
        }));

        res.json({
            source: 'Laravel_ERP',
            count: mappedProducts.length,
            items: mappedProducts
        });

    } catch (error) {
        console.error('Erro na integração:', error.message);
        res.status(500).json({ error: 'Falha ao conectar com o Laravel' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Middleware de Integração rodando em http://localhost:${PORT}`);
});