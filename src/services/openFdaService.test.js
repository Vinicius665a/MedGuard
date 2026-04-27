import { describe, it, expect, vi, afterEach } from "vitest";
import { searchDrug } from "./openFdaService";

global.fetch = vi.fn();

describe("searchDrug", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("retorna dados do medicamento quando API responde com sucesso", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        results: [
          {
            openfda: {
              brand_name: ["Tylenol"],
              generic_name: ["Acetaminophen"],
              manufacturer_name: ["Johnson & Johnson"],
            },
            indications_and_usage: ["Used for pain relief."],
            warnings: ["Do not exceed recommended dose."],
            adverse_reactions: ["Nausea, rash."],
          },
        ],
      }),
    });

    const result = await searchDrug("Tylenol");
    expect(result).not.toBeNull();
    expect(result.brandName).toBe("Tylenol");
    expect(result.genericName).toBe("Acetaminophen");
  });

  it("retorna null quando API responde 404", async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 404 });
    const result = await searchDrug("MedicamentoInexistente");
    expect(result).toBeNull();
  });

  it("lança erro quando a API falha com status 500", async () => {
    fetch.mockResolvedValueOnce({ ok: false, status: 500 });
    await expect(searchDrug("Tylenol")).rejects.toThrow("Erro na API OpenFDA: 500");
  });

  it("lança erro quando nome do medicamento é vazio", async () => {
    await expect(searchDrug("")).rejects.toThrow("Nome do medicamento é obrigatório.");
    expect(fetch).not.toHaveBeenCalled();
  });
});