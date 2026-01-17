import type { ReceiptApiResponse } from "./types";

export function normalizePaymentMethod(apiMethod: string): string {
  const m = apiMethod?.trim().toUpperCase();
  if (m === "CARD") return "Card";
  if (m === "CASH") return "Cash";
  if (m === "TRANSFER") return "Transfer";
  return apiMethod || "Card";
}

const API_BASE = "https://finaunty-python.onrender.com/ocr_render";

function guessMimeType(uri: string) {
  const lower = uri.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
}

function filenameFromUri(uri: string) {
  const last = uri.split("/").pop();
  if (last && last.includes(".")) return last;
  // expo camera/library URIs often have no filename
  const ext = guessMimeType(uri) === "image/png" ? "png" : "jpg";
  return `receipt.${ext}`;
}

/**
 * STUB: replace with your real POST upload (multipart/form-data).
 */
export async function postReceiptImage(
  uri: string,
): Promise<ReceiptApiResponse> {
  const url = `${API_BASE}`;
  const form = new FormData();
  form.append("file", {
    uri,
    name: filenameFromUri(uri),
    type: guessMimeType(uri),
  } as any);

  const res = await fetch(url, {
    method: "POST",
    body: form,
    // fetch will set Content-Type with the correct boundary.
    headers: {
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Receipt parse failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as ReceiptApiResponse;
  return json;
  // const sample: ReceiptApiResponse = {
  //   merchant: "NTUC FAIRPRICE BISHAN A",
  //   payment_method: "CARD",
  //   total: 37.7,
  //   items: [
  //     { item: "A BUTTER UNSALTD227G", price: 4.9, quantity: 2, total: 9.8 },
  //     { item: "CHEF LG ONION YELL", price: 1.4, quantity: 1, total: 1.4 },
  //     { item: "GOURMET B/BACON200G", price: 5.55, quantity: 1, total: 5.55 },
  //     { item: "L SUPER GREENS 125G", price: 3.9, quantity: 2, total: 7.8 },
  //     { item: "PAULS FRESH MILK 1L", price: 3.45, quantity: 2, total: 6.9 },
  //     { item: "PSR FSH EGGS (M) 30S", price: 2.5, quantity: 1, total: 2.5 },
  //   ],
  // };
  //
  // await new Promise((r) => setTimeout(r, 650));
  // return sample;
}
