import React, { useEffect, useState, useRef, useCallback } from "react";
import { fetchProductsWomenAsync } from "../productSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function ProductWoMenList() {
  const [menData, setMenData] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const[totalitem,setTotalItem]=useState(0)
  const dispatch = useDispatch();
  const loader = useRef(null);

  
  const getDetails = useCallback(async () => {
    setLoading(true);
    try {
      if(menData.length<=totalitem){
      const data = await dispatch(fetchProductsWomenAsync({ page })).unwrap();
      setMenData((prevData) => [...prevData, ...data?.products.docs]);
      setTotalItem(data?.products?.totalDocs);
      }
    } catch (err) {
      setError("Error while fetching the data");
    } finally {
      setLoading(false);
    }
  }, [dispatch, page]);

  useEffect(() => {
    getDetails();
  }, [getDetails]);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [loading]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    });

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [handleObserver]);

  return (
    <>
      <p className="relative p-1 my-4 text-2xl font-bold text-center">Women Products
        <span className="absolute bottom-0 block w-1/4 h-1 transform -translate-x-1/2 bg-blue-500 left-1/2"></span>
      </p>
      {error && <p className="text-center text-red-500">{error}</p>}
      <div className=" w-[100%] h-[100%] flex  justify-center item center ">
      <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-4 w-[100%] md:w-[70%] md:h-[100%] text-xs md:justify-end   font-popins bg-white md:px-10 md:text-lg">
        {menData?.map((product) => (
          <Link to={`/product-detail/${product.id}`} key={product.id}>
            <img
              src={product.thumbnail}
              alt={product.title}
              className="object-cover w-full h-48 mb-4 md:h-[50vh]"
            />
            <p className="">Shamaim</p>
            <p className="text-gray-600 ">
              {product.AboutTheDesign.slice(0, 38).concat('...')}
            </p>
            <div className="flex">
              <p className="">
                ₹{Math.floor(product.price - product.price * (product.discountPercentage / 100))}
              </p>
              <p className="px-1   line-through text-[#737373]">₹{product.price}</p>
            </div>
            <div className="w-20 h-5 md:h-8 md:w-28 text-center text-[#737373] border border-[#737373] border-1">
              <p>100% cotton</p>
            </div>
          </Link>
        ))}
      </div>
      </div>
      {loading && <p className="text-center">Loading...</p>}
      <div ref={loader} />
    </>
  );
}
