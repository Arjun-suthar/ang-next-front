"use client";

import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import { fetchDataFromApi } from "@/utils/api";
import { MyContext } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { togVariants, headVariants, slideInRight } from "@/utils/animation";

export default function DiningTablePage() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [products, setProducts] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [legFinishData, setLegfinishData] = useState([]);
  const [legMaterialData, setLegmaterialData] = useState([]);
  const [topFinishData, setTopfinishData] = useState([]);
  const [topMaterialData, setTopmaterialData] = useState([]);
  const [filters, setFilters] = useState({
    topmaterial: "",
    legmaterial: "",
    topfinish: "",
    legfinish: ""
  });

  const context = useContext(MyContext);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const handleOptionClick = (label, value) => {
    if (value === "all") {
      setFilters({
        topmaterial: "",
        legmaterial: "",
        topfinish: "",
        legfinish: ""
      });
      fetchDataFromApi("/api/products/filter?category=Dining Table").then((res) => {
        setProducts(res.products);
        setOpenDropdown(null);

      })
    } else {
      setFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters, [label]: value };

        // Remove empty values from the filters object
        Object.keys(updatedFilters).forEach((key) => {
          if (updatedFilters[key] === "") {
            delete updatedFilters[key];
          }
        });

        return updatedFilters;
      });

      setOpenDropdown(null); // Close the dropdown
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      // Remove empty values from the filters object
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== "")
      );

      const queryParams = new URLSearchParams(cleanedFilters).toString();
      const res = await fetchDataFromApi(`/api/products/filter?category=Dining Table&${queryParams}`);
      setProducts(res.products);
    };

    fetchProducts();
  }, [filters]);

  useEffect(() => {
    if (context) {
      setCategoryData(context.categoryData || []);
      setLegfinishData(context.legfinishData || []);
      setLegmaterialData(context.legmaterialData || []);
      setTopfinishData(context.topfinishData || []);
      setTopmaterialData(context.topmaterialData || []);
    }
  }, [context]);

  const filterOptions = {
    "Top Material": topMaterialData,
    "Leg Material": legMaterialData,
    "Top Finish": topFinishData,
    "Leg Finish": legFinishData,
    "Category": [
      { _id: "all", name: "Dining Table" }, // Add "All" option
    ],
    "Knocked Down": [
      { _id: "all", name: "All Products" }, // Add "All" option
    ],
  };

  const imageBaseUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/uploads/`;

  const getImageUrl = (image) => (image ? `${imageBaseUrl}${image}` : "/placeholder.jpg");

  return (
    <div className="w-screen pb-10 h-auto font-sans">
      <div className="2xl:container my-5 mx-auto px-4 sm:px-8">
        <div className="flex flex-wrap mt-3">
          <div className="w-full lg:w-6/12 shadow-[100px_0px_50px_15px_white]">
            <div className="hidden md:block h-[85px]"></div>
            <motion.div
              className="flex justify-center font-thin text-3xl sm:text-4xl tracking-wide sm:tracking-[12px]"
              initial="offscreen"
              whileInView="onscreen"
              variants={headVariants}
            >
              Dining Tables
            </motion.div>
            <motion.p
              className="text-center font-thin text-xs sm:text-lg mt-4 mb-4 lg:mb-16 tracking-[1.88px] capitalize leading-[1.7]"
              initial="offscreen"
              whileInView="onscreen"
              variants={togVariants}
            >
              Explore our exquisite collection of dining tables that effortlessly
              combine timeless classic designs with contemporary elements,
              harmoniously merging sophistication and practicality.
            </motion.p>
          </div>
          <motion.div
            className="w-full lg:w-6/12 flex items-center -z-10"
            initial="offscreen"
            whileInView="onscreen"
            variants={slideInRight}
          >
            <Image
              src="/DTDisplay.png"
              alt="Dining Table"
              className="w-full border-ridge"
              width={500}
              height={500}
            />
          </motion.div>
        </div>

        <div className="my-4 px-auto grid grid-cols-3 xl:grid-cols-6 text-center xl:text-start">
          {Object.entries(filterOptions).map(([label, options]) => (
            <div key={label} className="relative flex justify-center">
              <button
                onClick={() => toggleDropdown(label)}
                className="inline-flex justify-between items-center py-2 focus:outline-none text-xs sm:text-base"
              >
                {label} <IoIosArrowDown />
              </button>

              {openDropdown === label && options.length > 0 && (
                <div className="flex flex-col items-center absolute mt-10 w-24 z-10 sm:w-32 bg-white border border-gray-200 rounded-md shadow-lg">
                  {options.map((option) => (
                    <button
                      key={option._id}
                      value={option._id}
                      onClick={() => handleOptionClick(label.toLowerCase().replace(" ", ""), option._id)}
                      className="block sm:px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-center"
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-2">
          {products?.length > 0 ? (
            products?.map((product) => (
              <Link
                key={product._id}
                href={`/diningtable/${product._id}`}
                className="flex flex-col items-center justify-center border p-1 md:p-3 h-36 sm:h-44 md:h-56 lg:h-64 xl:h-72 2xl:h-80 text-center hover:scale-105 transition-transform"
              >
                <div className="flex-grow flex items-center justify-center w-[60%]">
                  <Image
                    src={getImageUrl(product?.images[0]) || "/placeholder.jpg"}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="w-full mx-auto"
                  />
                </div>
                <div className="text-xs sm:text-[17px] sm:tracking-[3px] mt-auto">
                  {product.name}
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center col-span-2 mt-10">No products available.</p>
          )}
        </div>
      </div>
    </div>
  );
}


