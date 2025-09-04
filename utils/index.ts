import { CarProps } from "@/types";
import { FilterProps } from "@/types";

export const calculateCarRent = (city_mpg: number, year: number) => {
  const basePricePerDay = 50; // Base rental price per day in dollars
  const mileageFactor = 0.1; // Additional rate per mile driven
  const ageFactor = 0.05; // Additional rate per year of vehicle age

  // Calculate additional rate based on mileage and age
  const mileageRate = city_mpg * mileageFactor;
  const ageRate = (new Date().getFullYear() - year) * ageFactor;

  // Calculate total rental rate per day
  const rentalRatePerDay = basePricePerDay + mileageRate + ageRate;

  return rentalRatePerDay.toFixed(0);
};


export async function fetchCars(filters: FilterProps) {
  const { manufacturer, year, model, limit, fuel } = filters;

  const apiKey = '6a57978f04mshb148bc988406979p1f4da7jsn304c99f342e3';
  if (!apiKey) {
    console.error('RAPIDAPI_KEY is not set');
    return [];
  }

  const headers = {
    'X-RapidAPI-Key': '6a57978f04mshb148bc988406979p1f4da7jsn304c99f342e3',
    'X-RapidAPI-Host': 'cars-by-api-ninjas.p.rapidapi.com',
    'Accept': 'application/json',
  } as Record<string, string>;

  const params = new URLSearchParams();
  if (manufacturer) params.set('make', manufacturer);
  if (year) params.set('year', String(year));
  if (model) params.set('model', model);
  if (limit) params.set('limit', String(limit));
  if (fuel) params.set('fuel_type', fuel);

  const url = `https://cars-by-api-ninjas.p.rapidapi.com/v1/cars${params.toString() ? `?${params.toString()}` : ''}`;

  const response = await fetch(url, { headers, method: 'GET' });
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    console.error('Failed to fetch cars', { url, status: response.status, statusText: response.statusText, body: errorText });
    return [];
  }

  const result = await response.json();
  return result;
}

export const updateSearchParams = (type: string, value: string) => {
  
  const searchParams = new URLSearchParams(window.location.search);

  searchParams.set(type, value);

  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;

  return newPathname;
};