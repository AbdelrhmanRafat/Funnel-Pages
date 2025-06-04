import React from "react";
import { ProductDetailsProps } from "@/types/funnel";
import "./classic_product_details.css";

// Import our new component-based UI
import BundleOptionSelector from "./BundleOptionSelector";
import OptionSummary from "./OptionSummary";
import VariantSelector from "./VariantSelector";

const ClassicProductDetails: React.FC<ProductDetailsProps> = ({
  funnelData,
  isArabic,
  formatCurrency,
  selectedImage,
  setSelectedImage,
  selectedOption,
  setSelectedOption,
  t,
}) => {
  const { product } = funnelData;
  const [zoomPosition, setZoomPosition] = React.useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = React.useState(false);
  const [selectedVariants, setSelectedVariants] = React.useState<any[]>([]);
  const [timeLeft, setTimeLeft] = React.useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 4, minutes: 59, seconds: 59 });
  const imageRef = React.useRef<HTMLDivElement>(null);

  // Set first image as default if none selected
  React.useEffect(() => {
    if (!selectedImage && product?.image) {
      setSelectedImage(product.image);
    }
  }, [product, selectedImage, setSelectedImage]);

  // Only initialize the selected option if bundles exist in the API data
  // We don't initialize variants automatically - user must select a bundle first
  React.useEffect(() => {
    // Check if bundles exist in the API data
    if (funnelData.purchase_options && funnelData.purchase_options.length > 0) {
      if (!selectedOption) {
        // Initialize with the first option but don't create variants yet
        setSelectedOption(funnelData.purchase_options[0]);
        setSelectedVariants([]);
      }
    } else {
      // No bundles available, reset states
      setSelectedVariants([]);
    }
  }, [funnelData.purchase_options, selectedOption, setSelectedOption]);

  // Countdown timer effect
  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds -= 1;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes -= 1;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours -= 1;
            } else {
              // Reset timer when it reaches zero
              hours = 4;
              minutes = 59;
              seconds = 59;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!product) return null;

  // Get all product images including main and attachments
  const allImages = [
    product.image,
    ...(product.attachment && Array.isArray(product.attachment)
      ? product.attachment
          .map((att) => att.image_path || att.path || "")
          .filter((path) => path !== "")
      : []),
  ];

  // Handle mouse movement over the image for zoom effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  // Handle purchase option selection
  // When a bundle is selected, create the variant slots
  const handleOptionSelect = (option: any) => {
    // Since we're handling option with objects, make sure to compare by ID
    // Don't clear if selecting the same option
    if (selectedOption && selectedOption.id === option.id) {
      return;
    }

    // Clear previous selection
    setSelectedVariants([]);

    // Set the new option
    setSelectedOption(option);

    // Create variant slots based on the selected bundle quantity
    if (option && option.quantity > 0) {
      // Initialize with proper empty structure to avoid undefined checks later
      // Now we also track which index each variant belongs to
      const newVariants = Array(option.quantity)
        .fill(0)
        .map((_, idx) => ({
          color: null,
          size: null,
          __index: idx, // Store the index in the variant itself
        }));
      setSelectedVariants(newVariants);
    }
  };

  // Handle variant selection with uniqueness tracking
  const handleVariantSelect = (index: number, variant: any) => {
    console.log("Selecting variant:", variant, "at index:", index);

    // Create a completely new variant array to help React detect changes
    setSelectedVariants((prev) => {
      // Copy the array to avoid mutating the previous state
      const newVariants = [...prev];

      // Update the variant at the specific index with a fresh object
      newVariants[index] = {
        ...variant,
        __index: index,
        // Add a unique timestamp to force React to see this as a new selection
        __uniqueKey: `${index}-${Date.now()}-${Math.random()}`,
      };

      console.log("Updated variants array:", newVariants);
      return newVariants;
    });
  };

  // Create a container for product details
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-md p-4 md:p-6 mb-6 border border-gray-100 main-content-area">
      <div className="product-top-spacer"></div>
      {/* Background pattern for visual interest */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 opacity-50 rounded-full -mr-10 -mt-10 z-0"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-50 opacity-50 rounded-full -ml-8 -mb-8 z-0"></div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:gap-12">
        {/* Left side - Product Images (should be on left in LTR, right in RTL) */}
        <div className="lg:w-3/5 order-1 mb-0 rtl-order-2 product-image-container product-image-sticky">
          {/* Soft label indicating product status */}
          <div className="absolute top-2 left-2 z-20">
            <span className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
              {isArabic ? "جديد" : "NEW"}
            </span>
            {product.qty !== undefined && product.qty < 20 && (
              <span className="inline-block bg-amber-500 text-white text-xs px-3 py-1 rounded-full shadow-md ml-2">
                {isArabic ? "الكمية محدودة" : "LIMITED STOCK"}
              </span>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:gap-4">
            {/* Thumbnails - Vertical on desktop, horizontal on mobile */}
            <div className="order-2 md:order-1 md:w-1/6 overflow-auto">
              <div className="flex md:flex-col py-2 gap-2 md:gap-3 overflow-x-auto md:overflow-x-visible md:h-[400px] md:py-0">
                {allImages.map((imgPath, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(imgPath)}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 border-2 rounded-lg overflow-hidden transform transition-all duration-200 hover:scale-105 ${selectedImage === imgPath ? "border-blue-500 shadow-md" : "border-gray-200 hover:border-blue-300"}`}
                  >
                    <img
                      src={imgPath}
                      alt={`${isArabic ? product.name_ar : product.name_en} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Main Image - Large display */}
            <div
              ref={imageRef}
              className="relative order-1 md:order-2 md:w-5/6 h-[300px] md:h-[500px] bg-gradient-to-br from-white to-gray-50 rounded-xl overflow-hidden mb-3 md:mb-0 shadow-inner"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setShowZoom(true)}
              onMouseLeave={() => setShowZoom(false)}
            >
              {/* Add a subtle pattern overlay for visual texture */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")",
                }}
              ></div>

              {selectedImage && (
                <>
                  <img
                    src={selectedImage}
                    alt={isArabic ? product.name_ar : product.name_en}
                    className="w-full h-full object-contain drop-shadow-sm"
                  />

                  {/* Zoom effect overlay - only visible on hover */}
                  {showZoom && (
                    <div
                      className="absolute inset-0 opacity-0 lg:opacity-100 pointer-events-none"
                      style={{
                        backgroundImage: `url(${selectedImage})`,
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        backgroundSize: "180%",
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                  )}
                </>
              )}

              {/* Image navigation buttons */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-3">
                <button
                  onClick={() => {
                    const currentIndex = allImages.indexOf(selectedImage || "");
                    const prevIndex =
                      (currentIndex - 1 + allImages.length) % allImages.length;
                    setSelectedImage(allImages[prevIndex]);
                  }}
                  className="bg-white hover:bg-blue-50 rounded-full p-3 shadow-md text-blue-600 transition-all duration-200 transform hover:scale-110"
                  aria-label="Previous image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    const currentIndex = allImages.indexOf(selectedImage || "");
                    const nextIndex = (currentIndex + 1) % allImages.length;
                    setSelectedImage(allImages[nextIndex]);
                  }}
                  className="bg-white hover:bg-blue-50 rounded-full p-3 shadow-md text-blue-600 transition-all duration-200 transform hover:scale-110"
                  aria-label="Next image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              {/* Zoom hint indicator */}
              <div className="absolute bottom-3 right-3 bg-white/70 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-gray-600 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
                {isArabic ? "حرك الماوس للتكبير" : "Hover to zoom"}
              </div>
            </div>
          </div>

          {/* Mobile image thumbnails indicator - styled as dots */}
          <div className="flex justify-center mt-4 gap-2 md:hidden">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(allImages[index])}
                className={`transition-all duration-200 ${allImages.indexOf(selectedImage || "") === index ? "w-4 h-2 bg-blue-500" : "w-2 h-2 bg-gray-300 hover:bg-gray-400"} rounded-full`}
              />
            ))}
          </div>
        </div>

        {/* Right side - Product Details (should be on right in LTR, left in RTL) */}
        <div className="lg:w-2/5 order-2 rtl-order-1 product-details-container">
          {/* Product title with fancy gradient background */}
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent rounded-lg"></div>
            <h1 className="relative z-10 text-3xl font-bold text-gray-800 py-2 px-4">
              {isArabic ? product.name_ar : product.name_en}
            </h1>
          </div>

          {/* Only show rating information if it exists in the API data */}
          {product.meta && product.meta.rating && (
            <div className="flex items-center mb-4 bg-amber-50/50 p-2 rounded-lg border border-amber-100 shadow-sm">
              <div className="flex text-amber-400">
                {Array.from(
                  { length: Math.min(Math.round(product.meta.rating), 5) },
                  (_, i) => (
                    <svg
                      key={i}
                      className="w-6 h-6 drop-shadow-sm transform transition-transform duration-200 hover:scale-110"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ),
                )}
                {Array.from(
                  {
                    length:
                      5 - Math.min(Math.round(product.meta.rating || 0), 5),
                  },
                  (_, i) => (
                    <svg
                      key={i + 5}
                      className="w-6 h-6 text-gray-200"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ),
                )}
              </div>
              <span className="text-sm font-medium text-amber-700 ms-2 flex items-center">
                {product.meta.reviews_count ? (
                  <>
                    <span className="bg-amber-100 rounded-full w-6 h-6 inline-flex items-center justify-center mr-1">
                      {product.meta.rating.toFixed(1)}
                    </span>
                    {`(${product.meta.reviews_count} ${isArabic ? "تقييم" : "reviews"})`}
                  </>
                ) : (
                  <span className="text-gray-500">
                    {isArabic ? "لا توجد تقييمات" : "No reviews yet"}
                  </span>
                )}
              </span>
            </div>
          )}

          {/* Product essential info: Category, SKU, Quantity */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-y-2">
              {/* Category */}
              {product.category && (
                <div className="w-full sm:w-1/2 flex items-center text-sm">
                  <span className="text-gray-500 font-medium mr-2">
                    {isArabic ? "الفئة:" : "Category:"}
                  </span>
                  <span className="text-gray-700">
                    {isArabic
                      ? product.category.name_ar
                      : product.category.name_en}
                  </span>
                </div>
              )}

              {/* SKU Code */}
              {product.sku_code && (
                <div className="w-full sm:w-1/2 flex items-center text-sm">
                  <span className="text-gray-500 font-medium mr-2">
                    {isArabic ? "رمز المنتج:" : "SKU:"}
                  </span>
                  <span className="text-gray-700 font-mono">
                    {product.sku_code}
                  </span>
                </div>
              )}

              {/* Quantity */}
              <div className="w-full sm:w-1/2 flex items-center text-sm">
                <span className="text-gray-500 font-medium mr-2">
                  {isArabic ? "الكمية المتوفرة:" : "Available:"}
                </span>
                <span className="text-gray-700">
                  {product.qty !== undefined && product.qty > 0
                    ? product.qty
                    : isArabic
                      ? "غير متوفر"
                      : "Out of stock"}
                </span>
              </div>
            </div>
          </div>

          {/* Product essential info in card format */}
          <div className="mb-6 flex flex-wrap gap-4">
            {/* Category card */}
            {product.category && (
              <div className="flex-1 min-w-[150px] bg-gradient-to-br from-blue-50 to-white p-3 rounded-lg shadow-sm border border-blue-100 transition-all hover:shadow-md">
                <div className="flex items-center mb-1">
                  <svg
                    className="w-4 h-4 text-blue-500 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span className="text-xs font-semibold text-blue-700">
                    {isArabic ? "الفئة" : "CATEGORY"}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-800">
                  {isArabic
                    ? product.category.name_ar
                    : product.category.name_en}
                </div>
              </div>
            )}

            {/* SKU card */}
            {product.sku_code && (
              <div className="flex-1 min-w-[150px] bg-gradient-to-br from-purple-50 to-white p-3 rounded-lg shadow-sm border border-purple-100 transition-all hover:shadow-md">
                <div className="flex items-center mb-1">
                  <svg
                    className="w-4 h-4 text-purple-500 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                    />
                  </svg>
                  <span className="text-xs font-semibold text-purple-700">
                    {isArabic ? "رمز المنتج" : "SKU"}
                  </span>
                </div>
                <div className="text-sm font-medium font-mono text-gray-800">
                  {product.sku_code}
                </div>
              </div>
            )}

            {/* Stock card */}
            <div className="flex-1 min-w-[150px] bg-gradient-to-br from-teal-50 to-white p-3 rounded-lg shadow-sm border border-teal-100 transition-all hover:shadow-md">
              <div className="flex items-center mb-1">
                <svg
                  className="w-4 h-4 text-teal-500 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
                <span className="text-xs font-semibold text-teal-700">
                  {isArabic ? "المخزون" : "STOCK"}
                </span>
              </div>
              <div className="text-sm font-medium text-gray-800">
                {product.qty !== undefined && product.qty > 0 ? (
                  <span className="flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                    {product.qty} {isArabic ? "متوفر" : "Available"}
                  </span>
                ) : (
                  <span className="flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                    {isArabic ? "غير متوفر" : "Out of stock"}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Price section with better visual design */}
          <div className="mb-6 bg-gradient-to-r from-blue-50 via-blue-50 to-transparent p-5 rounded-xl shadow-sm border border-blue-100">
            {product.price > 0 ? (
              <div className="space-y-2">
                {product.price_after_discount &&
                product.price_after_discount < product.price ? (
                  <>
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex items-baseline">
                          <div className="text-4xl font-bold text-blue-700">
                            {formatCurrency(product.price_after_discount)}
                          </div>
                          <span className="ml-2 text-lg text-gray-500 line-through">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                        <div className="mt-1">
                          <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                            {isArabic ? "توفير" : "You save"}{" "}
                            {formatCurrency(
                              product.price - product.price_after_discount,
                            )}{" "}
                            (
                            {Math.round(
                              (1 -
                                product.price_after_discount / product.price) *
                                100,
                            )}
                            %)
                          </span>
                        </div>
                      </div>
                      <div className="hidden md:block ml-4 -mt-2">
                        <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1.5 rounded-md transform rotate-3 shadow-sm">
                          {isArabic ? "عرض خاص" : "SPECIAL OFFER!"}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-4xl font-bold text-blue-700">
                    {formatCurrency(product.price)}
                  </div>
                )}

                {/* Free shipping badge if applicable */}
                {product.meta && product.meta.shipping_available && (
                  <div className="flex items-center mt-2 text-sm text-blue-600">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                      />
                    </svg>
                    {isArabic ? "شحن سريع متاح" : "Fast shipping available"}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-2xl font-bold text-gray-400">
                {isArabic ? "غير متوفر حالياً" : "Currently unavailable"}
              </div>
            )}
          </div>

          {/* Product description - Collapsible on mobile */}
          <div className="mb-6">
            <div className="flex justify-between items-center cursor-pointer mb-2">
              <h2 className="text-lg font-semibold">
                {isArabic ? "وصف المنتج" : "Product Description"}
              </h2>
              <svg
                className="w-5 h-5 md:hidden"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <div
              className="text-gray-600 prose max-w-none px-3 py-2 bg-gray-50/50 rounded-md border border-gray-100"
              dangerouslySetInnerHTML={{
                __html: isArabic
                  ? product.description_ar
                  : product.description_en,
              }}
            />
          </div>

          {/* Visual separator to reduce white space */}
          <div className="product-section-divider"></div>

          {/* Size and Color options are only shown in the variants section after selecting a bundle */}

          {/* Bundle Purchase Options with visual card design */}
          <div className="mb-6 p-3 rounded-lg bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm">
            <div className="flex items-center mb-3">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-800">
                {isArabic ? "اختر الكمية" : "Select Quantity"}
              </h2>
            </div>

            <BundleOptionSelector
              options={funnelData.purchase_options || []}
              selectedOptionId={selectedOption?.id || null}
              onSelectOption={handleOptionSelect}
              formatCurrency={formatCurrency}
              isArabic={isArabic}
            />

            {/* Variants will appear directly under the selected bundle */}
            {selectedOption && selectedVariants.length > 0 && (
              <div className="mt-5">
                {/* Subtle divider between bundle and variants */}
                <div className="my-3 border-t border-gray-100"></div>
                {selectedVariants.map((variant, index) => (
                  <VariantSelector
                    key={`variant-${index}`}
                    index={index}
                    variant={variant}
                    productOptions={
                      product.options && product.options.length > 0
                        ? product.options[0].options
                        : undefined
                    }
                    onSelect={handleVariantSelect}
                    isArabic={isArabic}
                    t={t}
                  />
                ))}
              </div>
            )}

            {/* Summary of selected items - moved to after variants section */}
            {selectedOption && (
              <div className="mt-4">
                <OptionSummary
                  selectedOption={selectedOption}
                  formatCurrency={formatCurrency}
                  isArabic={isArabic}
                />
                {/* Add visual separator after the summary for better layout */}
                <div className="product-section-divider mt-6"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassicProductDetails;
