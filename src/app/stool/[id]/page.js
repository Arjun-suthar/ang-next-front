"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { fetchDataFromApi } from "@/utils/api";

export default function StoolDetails({ params }) {
  const { id } = params; // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [edges, setEdges] = useState([]);
  const [tops, setTops] = useState([]);
  const [finishes, setFinishes] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (id) {
      // Fetch product details
      fetchDataFromApi(`/api/products/${id}`).then((res) => {
        setProduct(res);
        setSelectedImage(res?.images?.[0]);
      });

      fetchDataFromApi(`/api/productedge/productedges?productId=${id}`).then(
        (res) => {
          setEdges(res?.edge?.edges);
        }
      );

      // Fetch product tops
      fetchDataFromApi(`/api/producttop/producttops?productId=${id}`).then(
        (res) => {
          setTops(res?.top?.tops);
        }
      );

      // Fetch product finishes
      fetchDataFromApi(
        `/api/productfinish/productfinishes?productId=${id}`
      ).then((res) => {
        setFinishes(res?.finish?.finishes);
      });
    }
  }, [id]);

  if (!product) {
    return <p>Loading...</p>;
  }

  const nextSlide = () => {
    if (currentSlide < product.images.length - 3) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const imageBaseUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/uploads/`;

  const getImageUrl = (image) =>
    image ? `${imageBaseUrl}${image}` : "/placeholder.jpg";

  return (
    <div className="2xl:container mx-auto">
      <div className="relative">
        {/* Background Image */}
        <div className="hidden lg:block absolute top-4 right-0 w-5/12">
          <Image
            src={getImageUrl(selectedImage) || "/stbg.png"}
            alt="Background"
            width={430}
            height={326}
            className="max-w-none w-[95%] h-[650px] opacity-50 z-0"
          />
        </div>

        <div className="flex flex-wrap">
          {/* Main Content */}
          <div className="w-full lg:w-7/12 mr-4 ml-4">
            {/* Big Image */}
            <div className="flex justify-center items-center mt-12 h-[200px] sm:h-[300px] md:h-[400px]">
              <Image
                src={getImageUrl(selectedImage) || "/sbm.png"}
                alt="Stool"
                width={530}
                height={326}
                className="mx-auto object-contain max-h-full"
              />
            </div>

            {/* Small Images */}
            <div className="relative flex justify-center items-center mt-8 sm:mt-14 z-10 h-36">
              {/* Previous Button */}
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={`absolute left-2 sm:left-10 lg:left-16 z-10 bg-white p-1 rounded-full shadow-md ${
                  currentSlide === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Slider Images */}
              <div
                className="flex gap-6 justify-center overflow-hidden mx-8 h-full"
                ref={sliderRef}
              >
                {product.images
                  .slice(currentSlide, currentSlide + 3)
                  .map((image, index) => (
                    <Image
                      key={index}
                      src={getImageUrl(image) || "/placeholder.jpg"}
                      alt={`Product Image ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-1/4 md:w-auto cursor-pointer object-contain"
                      onClick={() => setSelectedImage(image)}
                    />
                  ))}
              </div>

              {/* Next Button */}
              <button
                onClick={nextSlide}
                disabled={currentSlide >= product.images.length - 3}
                className={`absolute right-2 sm:right-10 lg:right-16 z-10 bg-white p-1 rounded-full shadow-md ${
                  currentSlide >= product.images.length - 3
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex w-full md:ml-8 md:mt-9 flex-col items-center md:items-start">
            {/* Product Name */}
            <div className="w-full md:w-auto text-center md:text-left mt-6 mb-2 text-sm md:text-xl font-sans font-medium tracking-wide md:tracking-[12px]">
              {product.name}
            </div>

            {/* Product Details */}
            <div className="w-full md:w-auto text-center md:text-left mt-1 mb-6 text-xs sm:text-[14px] tracking-widest capitalize">
              <ul className="ml-4">
                <li className="md:list-disc md:marker:text-[9px]">
                  <span className="font-medium text-sm md:text-[16px]">
                    Material
                  </span>
                  : {product.topmaterial?.name} / {product.legmaterial?.name} .{" "}
                  <span className="font-medium text-sm md:text-[16px] ml-4">
                    Finish
                  </span>
                  : {product.topfinish?.name}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col gap-6 md:gap-10 lg:gap-16 bg-white px-2 pt-6 sm:pt-10 lg:pt-20 border-t border-gray-400">
        <div className="flex flex-wrap justify-around items-center">
          {tops?.map((top, index) => (
            <div key={index} className="flex flex-col items-center"
              onClick={() => setSelectedImage(top?.images?.[0])}>
              <Image
                src={getImageUrl(top?.images?.[0]) || "/placeholder.jpg"}
                alt={top?.name?.name || "Top Name"}
                width={100}
                height={50}
                className="w-[50px] h-[25px] md:w-[100px] md:h-[50px]"
              />
              <p className="pt-1 text-[10px] md:text-sm xl:text-base">{top?.name?.name}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-around items-center">
          {edges?.map((edge, index) => (
            <div key={index} className="flex flex-col items-center"
              onClick={() => setSelectedImage(edge?.images?.[0])}>
              <Image
                src={getImageUrl(edge?.images?.[0]) || "/placeholder.jpg"}
                alt={edge?.name?.name || "Edge Name"}
                width={100}
                height={18}
                className="w-[70px] h-[10px] md:w-[100px] md:h-[18px]"
              />
              <p className="pt-1 text-[10px] md:text-sm xl:text-base">{edge?.name?.name}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-around items-center mb-8">
          {finishes?.map((finish, index) => (
            <div key={index} className="flex flex-col items-center"
              onClick={() => setSelectedImage(finish?.images?.[0])}>
              <Image
                src={getImageUrl(finish?.images?.[0]) || "/placeholder.jpg"}
                alt={finish?.name?.name || "Finish Name"}
                width={100}
                height={80}
                className="w-[50px] h-[40px] md:w-[100px] md:h-[80px]"
              />
              <p className="pt-1 text-[10px] md:text-sm xl:text-base">{finish?.name?.name}</p>
            </div>
          ))}
        </div>
      </div> */}

      {(tops?.length > 0 || edges?.length > 0 || finishes?.length > 0) && (
        <div className="flex flex-col gap-6 md:gap-10 lg:gap-16 bg-white px-2 pt-6 sm:pt-10 lg:pt-20 border-t border-gray-400">
          {/* Tops */}
          {tops?.length > 0 && (
            <div className="flex flex-wrap justify-around items-center">
              {tops.map((top, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center"
                  onClick={() => setSelectedImage(top?.images?.[0])}
                >
                  <Image
                    src={getImageUrl(top?.images?.[0]) || "/placeholder.jpg"}
                    alt={top?.name?.name || "Top Name"}
                    width={100}
                    height={50}
                    className="w-[50px] h-[25px] md:w-[100px] md:h-[50px]"
                  />
                  <p className="pt-1 text-[10px] md:text-sm xl:text-base">
                    {top?.name?.name}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Edges */}
          {edges?.length > 0 && (
            <div className="flex flex-wrap justify-around items-center">
              {edges.map((edge, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center"
                  onClick={() => setSelectedImage(edge?.images?.[0])}
                >
                  <Image
                    src={getImageUrl(edge?.images?.[0]) || "/placeholder.jpg"}
                    alt={edge?.name?.name || "Edge Name"}
                    width={100}
                    height={18}
                    className="w-[70px] h-[10px] md:w-[100px] md:h-[18px]"
                  />
                  <p className="pt-1 text-[10px] md:text-sm xl:text-base">
                    {edge?.name?.name}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Finishes */}
          {finishes?.length > 0 && (
            <div className="flex flex-wrap justify-around items-center mb-8">
              {finishes.map((finish, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center"
                  onClick={() => setSelectedImage(finish?.images?.[0])}
                >
                  <Image
                    src={getImageUrl(finish?.images?.[0]) || "/placeholder.jpg"}
                    alt={finish?.name?.name || "Finish Name"}
                    width={100}
                    height={80}
                    className="w-[50px] h-[40px] md:w-[100px] md:h-[80px]"
                  />
                  <p className="pt-1 text-[10px] md:text-sm xl:text-base">
                    {finish?.name?.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
