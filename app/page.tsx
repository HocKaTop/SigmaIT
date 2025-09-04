import Hero from "@/components/Hero";
import Image from "next/image";
import { SearchBar } from "@/components";
import {CustomFilter} from "@/components";
import { fetchCars } from "@/utils";
import {CarCard} from "@/components";
import { fuels, manufacturers, yearsOfProduction } from "@/constants";
import { useState } from "react";
import { useEffect } from "react";

export default async function Home({ searchParams }: { searchParams: { manufacturer?: string; year?: number; fuel?: string; limit?: number; model?: string } }) {
  const allCars = await fetchCars({
    manufacturer: searchParams.manufacturer || "",
    year: searchParams.year || 2022,
    fuel: searchParams.fuel || "",
    limit: searchParams.limit || 10,
    model: searchParams.model || "",
  });

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1 || !allCars;



  return (
    <main className="overflow-hidden">
      <Hero />
      <div className="mt-12 padding-x padding-y max-width " id="discover">
        <div className="home__text-container">
          <h1 className=" text-4xl font-extrabold">Car Catalogue</h1>
          <p>Explore the cars</p>
        </div>

      <div className="home__filters flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SearchBar />
        <div className="home__filters-container flex gap-4">
          <CustomFilter title="fuel" options={fuels}/>
          <CustomFilter title="year" options={yearsOfProduction}/>  
        </div>
      </div>

      {!isDataEmpty ? (
  <section>
    <div className="home__cars-wrapper">
      {allCars.map((car, index) => (
        <CarCard key={car.model + index} car={car} />
      ))}
    </div>
  </section>
) : (
  <div className="home__error-container">
    <h2 className="text-black text-xl font-bold">Oops, no results</h2>
  </div>
)}

      </div>
    </main>
  )
}