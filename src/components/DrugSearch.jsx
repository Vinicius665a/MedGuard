import { useState } from "react";
import { searchDrug } from "../services/openFdaService";

export default function DrugSearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const drug = await searchDrug(query);
      if (!drug) {
        setError("Medicamento não encontrado.");
      } else {
        setResult(drug);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>🔍 Consulta de Medicamentos</h2>
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Digite o nome do medicamento (ex: Tylenol)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={{ flex: 1, padding: "8px" }}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "16px", borderRadius: "8px" }}>
          <h3>{result.brandName}</h3>
          <p><strong>Nome Genérico:</strong> {result.genericName}</p>
          <p><strong>Fabricante:</strong> {result.manufacturer}</p>
          <details>
            <summary><strong>Indicações de Uso</strong></summary>
            <p>{result.indications}</p>
          </details>
          <details>
            <summary><strong>⚠️ Avisos</strong></summary>
            <p>{result.warnings}</p>
          </details>
          <details>
            <summary><strong>Reações Adversas</strong></summary>
            <p>{result.adverseReactions}</p>
          </details>
        </div>
      )}
    </div>
  );
}