const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export interface CalcRequest {
  operation: string;
  a: number;
  b: number;
}

export interface CalcResponse {
  result: number;
  error?: string;
}

export const calculate = async (data: CalcRequest): Promise<CalcResponse> => {
  const res = await fetch(`${API_URL}/api/v1/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};