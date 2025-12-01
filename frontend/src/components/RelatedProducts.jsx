// src/components/RelatedProducts.jsx
import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "./ProductItem";
import Title from "../components/Title";

/**
 * Props:
 *  - category: string (optional)
 *  - subCategory: string (optional)
 *  - excludeId: id to exclude from results (optional)
 */
const RelatedProducts = ({ category, subCategory, excludeId }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!products || products.length === 0) {
      setRelated([]);
      return;
    }

    // normalize helper to compare loosely (case + whitespace insensitive)
    const normalize = (s) => (typeof s === "string" ? s.trim().toLowerCase() : "");

    const catNorm = normalize(category);
    const subNorm = normalize(subCategory);

    let results = products.slice(); // shallow copy

    // exclude the current product if provided
    if (excludeId) {
      results = results.filter((p) => p._id !== excludeId);
    }

    // If both category and subCategory are provided, prefer matching both; otherwise match whichever is provided.
    if (catNorm && subNorm) {
      results = results.filter(
        (p) => normalize(p.category) === catNorm && normalize(p.subCategory) === subNorm
      );
    } else if (catNorm) {
      results = results.filter((p) => normalize(p.category) === catNorm);
    } else if (subNorm) {
      results = results.filter((p) => normalize(p.subCategory) === subNorm);
    } else {
      // if no filters provided, show an empty related list or you could choose to show popular / bestsellers
      results = [];
    }

    // limit to 5 items (you can shuffle first if you want random related)
    setRelated(results.slice(0, 5));
  }, [products, category, subCategory, excludeId]);

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={"Related"} text2={"Products"} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-2">
        {related.length > 0 ? (
          related.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No related products found.</p>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
