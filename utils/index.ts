import { CarProps, FilterProps } from "@/types";

export const calculateCarRent = (city_mpg: number, year: number) => {
  const basePricePerDay = 50;
  const mileageFactor = 0.1;
  const ageFactor = 0.05;

  const mileageRate = city_mpg * mileageFactor;
  const ageRate = (new Date().getFullYear() - year) * ageFactor;

  const rentalRatePerDay = basePricePerDay + mileageRate + ageRate;
  return rentalRatePerDay.toFixed(0);
};

// 🔑 Получение JWT
let cachedJwt: string | null = null;
let jwtExpiry = 0;

// 🔑 Получение JWT
async function getJwtToken() {
  const res = await fetch("https://carapi.app/api/auth/login", {
    method: "POST",
    headers: {
      Accept: "text/plain",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_token: "652802f1-5c7d-40ab-b0a2-73727cac81a3",
      api_secret: "2a25d83a44cf0ca11e86db243d0fb3ee",
    }),
  });

  if (!res.ok) throw new Error("JWT auth failed: " + (await res.text()));
  return res.text();
}

export async function fetchCars(filters: {
  manufacturer?: string;
  year?: number;
  fuel?: string;
  limit?: number;
  model?: string;
}) {
  const { manufacturer, year, fuel, limit, model } = filters;

  // 🔄 Проверяем, не истёк ли токен
  if (!cachedJwt || Date.now() > jwtExpiry) {
    const jwt = await getJwtToken();
    cachedJwt = jwt;

    // Вытаскиваем exp из JWT
    const payload = JSON.parse(Buffer.from(jwt.split(".")[1], "base64").toString());
    jwtExpiry = payload.exp * 1000 - 60 * 1000; // обновляем заранее за 1 мин
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${cachedJwt}`,
  };

  const searchParams = new URLSearchParams();

  if (year) searchParams.append("year", year.toString());
  if (manufacturer) searchParams.append("make", manufacturer);
  if (model) searchParams.append("model", model);
  if (limit) searchParams.append("page[size]", limit.toString());
  // fuel фильтруем вручную потом, API напрямую не принимает

  const url = `https://carapi.app/api/trims/v2?${searchParams.toString()}`;

  console.log("Fetching CarAPI URL:", url);

  const response = await fetch(url, { headers });

  if (!response.ok) {
    console.error("CarAPI fetch failed:", response.status, response.statusText);
    return [];
  }

  const data = await response.json();

  return data?.data || [];
}

export const updateSearchParams = (type: string, value: string) => {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set(type, value);
  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;
  return newPathname;
};
