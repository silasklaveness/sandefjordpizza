"use client";
import { useEffect, useState } from "react";
import MenyItem from "../meny/MenyItem.js";
import SectionHeaders from "./SectionHeaders.js";
export default function Homemeny() {
  const [bestSellers, setBestSellers] = useState([]);
  useEffect(() => {
    fetch("api/menu-items").then((res) =>
      res.json().then((menuItems) => {
        setBestSellers(menuItems.slice(-3));
      })
    );
  }, []);
  console.log(bestSellers);
  return (
    <section className="">
      <div></div>
      <div className="text-center">
        <SectionHeaders
          subHeader={"Sjekk ut"}
          mainHeader={"Våre beste selgere!"}
        />
      </div>
      <div className="grid grid-cols-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-4">
        {bestSellers?.length > 0 &&
          bestSellers.map((item) => <MenyItem key={item._id} {...item} />)}
      </div>
    </section>
  );
}
