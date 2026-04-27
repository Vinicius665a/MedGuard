const BASE_URL = "https://api.fda.gov/drug/label.json";

export async function searchDrug(drugName) {
  if (!drugName || drugName.trim() === "") {
    throw new Error("Nome do medicamento é obrigatório.");
  }

  const url = `${BASE_URL}?search=openfda.brand_name:"${encodeURIComponent(drugName)}"&limit=1`;
  const response = await fetch(url);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Erro na API OpenFDA: ${response.status}`);
  }

  const data = await response.json();
  const result = data.results?.[0];

  if (!result) return null;

  return {
    brandName: result.openfda?.brand_name?.[0] ?? drugName,
    genericName: result.openfda?.generic_name?.[0] ?? "Não informado",
    manufacturer: result.openfda?.manufacturer_name?.[0] ?? "Não informado",
    indications: result.indications_and_usage?.[0] ?? "Não disponível",
    warnings: result.warnings?.[0] ?? "Não disponível",
    adverseReactions: result.adverse_reactions?.[0] ?? "Não disponível",
  };
}