// src/pages/Collection.jsx
import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [categories, setCategories] = useState([]); // e.g. ['Men','Women']
  const [subCategories, setSubCategories] = useState([]); // e.g. ['TopWear']
  const [sortMode, setSortMode] = useState("relevant"); // relevant | low-to-high | high-to-low

  // helper: normalize strings for loose matching (lowercase + remove spaces)
  const normalize = (s) =>
    typeof s === "string" ? s.toLowerCase().replace(/\s+/g, "") : String(s);

  // toggle category checkbox
  const toggleCategory = (value) => {
    setCategories((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  // toggle sub-category checkbox
  const toggleSubCategory = (value) => {
    setSubCategories((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  // Initialize filterProducts when products first arrive
  useEffect(() => {
    setFilterProducts(products ?? []);
  }, [products]);

  // Recompute filtered + sorted products when dependencies change
  useEffect(() => {
    if (!products || products.length === 0) {
      setFilterProducts([]);
      return;
    }

    let result = [...products];

    // --- SEARCH FILTER ---
    if (showSearch && search && String(search).trim().length > 0) {
      const q = normalize(search);
      result = result.filter((p) => {
        // collect candidate text fields to search within
        const candidates = [
          p.name,
          p.title,
          p.description,
          p.category,
          p.gender,
          p.type,
          p.subCategory,
          p.subcategory,
          p.typeName,
        ];

        // also include array fields like tags
        if (Array.isArray(p.tags)) candidates.push(...p.tags);
        if (Array.isArray(p.attributes)) candidates.push(...p.attributes.map(String));

        // normalize and check
        const normalizedValues = candidates.filter(Boolean).map((v) => normalize(v));
        // match if any candidate contains the query as substring
        return normalizedValues.some((val) => val.includes(q));
      });
    }

    // --- CATEGORY FILTER ---
    if (categories.length > 0) {
      const normalizedSelected = categories.map(normalize);
      result = result.filter((p) => {
        const candidate = p.category ?? p.gender ?? p.cat ?? p.categoryName;
        if (!candidate) return false;
        return normalizedSelected.includes(normalize(candidate));
      });
    }

    // --- SUBCATEGORY FILTER (robust) ---
    if (subCategories.length > 0) {
      const normalizedSelected = subCategories.map(normalize);

      result = result.filter((p) => {
        const candidates = [
          p.type,
          p.subCategory,
          p.subcategory,
          p.typeName,
          p.tag,
          p.tags, // maybe array
          p.attributes, // maybe object
        ];

        const values = candidates.flatMap((c) => {
          if (c == null) return [];
          if (Array.isArray(c)) return c.map(String);
          if (typeof c === "string" || typeof c === "number") return [String(c)];
          if (typeof c === "object") return Object.values(c).map(String);
          return [];
        });

        const normalizedValues = values.map(normalize);
        return normalizedSelected.some((sel) => normalizedValues.includes(sel));
      });
    }

    // --- SORTING ---
    if (sortMode === "low-to-high") {
      result.sort((a, b) => Number(a.price ?? 0) - Number(b.price ?? 0));
    } else if (sortMode === "high-to-low") {
      result.sort((a, b) => Number(b.price ?? 0) - Number(a.price ?? 0));
    } // else 'relevant' => keep original order

    setFilterProducts(result);
  }, [products, categories, subCategories, sortMode, showSearch, search]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 pt-10 border-t px-4">
      {/* LEFT: Filters */}
      <aside className="min-w-[15rem]">
        <p
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
          onClick={() => setShowFilter((s) => !s)}
        >
          Filters
          <img
            className={`h-4 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt="toggle"
          />
        </p>

        {/* Categories */}
        <div className={`border border-gray-300 pl-5 py-4 mt-6 ${showFilter ? "" : "hidden"}`}>
          <p className="mb-3 text-sm font-medium">Categories</p>

          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {["Men", "Women", "Kids"].map((c) => (
              <label key={c} className="flex items-center gap-2">
                <input
                  className="w-3 h-3"
                  type="checkbox"
                  value={c}
                  onChange={() => toggleCategory(c)}
                  checked={categories.includes(c)}
                />
                <span>{c}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Subcategories */}
        <div className={`border border-gray-300 pl-5 py-4 my-5 ${showFilter ? "" : "hidden"}`}>
          <p className="mb-3 text-sm font-medium">Type</p>

          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {["TopWear", "BottomWear", "WinterWear"].map((s) => (
              <label key={s} className="flex items-center gap-2">
                <input
                  className="w-3 h-3"
                  type="checkbox"
                  value={s}
                  onChange={() => toggleSubCategory(s)}
                  checked={subCategories.includes(s)}
                />
                <span>{s}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* RIGHT: Product grid */}
      <main className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4 items-center">
          <Title text1={"All"} text2={"Collections"} />

          <select
            className="border border-gray-300 text-sm px-2"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value)}
          >
            <option value="relevant">Sort by relevant</option>
            <option value="low-to-high">Sort by low to high</option>
            <option value="high-to-low">Sort by high to low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filterProducts && filterProducts.length > 0 ? (
            filterProducts.map((item) => (
              <ProductItem
                key={item._id ?? item.id ?? item.name}
                id={item._id ?? item.id}
                image={item.image}
                name={item.name}
                price={item.price}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No products found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Collection;
