import { useEffect, useState } from 'react';
import axios from 'axios';

// Interface ajustada para o que o seu banco realmente tem
interface Produto {
  id: number;
  nome_vtex: string;
  codigo_sku: string;
  preco: number | string;
  em_estoque: number;
}

function App() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3001/integration/products')
      .then(response => {
        // Como o Laravel envia { items: [] }, acessamos a chave .items
        const dados = response.data.items || [];
        setProdutos(dados);
        setCarregando(false);
      })
      .catch(err => {
        console.error("Erro ao buscar dados:", err);
        setCarregando(false);
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>📦 Meus Produtos (ERP)</h1>

      {carregando && <p>Carregando dados do servidor...</p>}

      {!carregando && produtos.length === 0 && (
        <p>Conectado, mas nenhum produto encontrado no banco.</p>
      )}

      <div style={{ display: 'grid', gap: '15px' }}>
        {produtos.map((item) => (
          <div 
            key={item.id || item.codigo_sku} 
            style={{ 
              border: '1px solid #ddd', 
              padding: '15px', 
              borderRadius: '8px',
              backgroundColor: '#f9f9f9' 
            }}
          >
            <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>{item.nome_vtex}</h2>
            <p><strong>SKU:</strong> {item.codigo_sku}</p>
            <p><strong>Preço:</strong> R$ {item.preco}</p>
            <p><strong>Estoque:</strong> {item.em_estoque} unidades</p>
          </div>
        ))}
      </div>

      {/* Debug: Caso nada apareça acima, isso aqui vai mostrar o JSON bruto */}
      <hr style={{ marginTop: '40px' }} />
      <details>
        <summary>Ver dados brutos (Debug)</summary>
        <pre>{JSON.stringify(produtos, null, 2)}</pre>
      </details>
    </div>
  );
}

export default App;