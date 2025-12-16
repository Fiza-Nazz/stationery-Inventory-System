"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, Search, Package, CheckCircle, X } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  retailPrice: number;
  stock: number;
};

type CartItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
};

export default function SalesPage() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [animateCart, setAnimateCart] = useState<string>("");

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Failed to fetch products:", err));
  }, []);

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.productId === product._id);

    if (existing) {
      if (existing.quantity + 1 > product.stock) {
        alert("Cannot add more than available stock!");
        return;
      }
      setCart(cart.map(item => item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      if (product.stock <= 0) {
        alert("Product out of stock!");
        return;
      }
      setCart([...cart, { productId: product._id, name: product.name, quantity: 1, price: product.retailPrice }]);
    }
    
    setAnimateCart(product._id);
    setTimeout(() => setAnimateCart(""), 600);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, qty: number) => {
    const product = products.find(p => p._id === productId);
    if (!product) return;

    if (qty < 1 || qty > product.stock) return;

    setCart(cart.map(item => item.productId === productId ? { ...item, quantity: qty } : item));
  };

  const getTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const createSale = async () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, paymentMethod }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Sale ID:", data.sale._id);
        alert("Sale completed successfully ✅");

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setCart([]);
        const refreshed = await fetch("/api/products").then(res => res.json());
        setProducts(refreshed);

        router.push(`/invoices/${data.sale._id}`);
      } else {
        alert(data.error || "Sale failed!");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while creating sale!");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-amber-900 relative overflow-hidden">
      {/* Animated Background Pattern - Responsive sizing */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-amber-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-64 h-64 sm:w-96 sm:h-96 bg-red-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-yellow-400 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Success Modal - Responsive sizing */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md animate-fadeIn px-4">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-6 sm:p-10 shadow-2xl transform animate-scaleIn border-t-4 border-green-500 max-w-md w-full">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 animate-bounce shadow-xl">
                <CheckCircle className="w-10 h-10 sm:w-14 sm:h-14 text-white" strokeWidth={3} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">فروخت مکمل!</h3>
              <p className="text-base sm:text-lg text-gray-600 mb-3 sm:mb-4">Sale Completed Successfully</p>
              <div className="w-full h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-[1600px] mx-auto p-3 sm:p-4 md:p-6">
        {/* Premium Header - Responsive layout */}
        <div className="bg-gradient-to-r from-red-800 via-red-700 to-amber-700 rounded-lg shadow-2xl mb-4 sm:mb-6 overflow-hidden border-b-4 border-amber-500">
          <div className="relative p-4 sm:p-6">
            {/* Decorative Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-amber-400 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto">
                {/* Logo - Responsive sizing */}
                <div className="relative group flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full blur-md group-hover:blur-lg transition-all duration-300 opacity-50"></div>
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-full p-1.5 sm:p-2 shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border-2 sm:border-4 border-amber-400">
                    <img 
                      src="/logo.png" 
                      alt="Dukan Logo" 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-xl sm:text-2xl font-bold text-red-700">د</div>';
                      }}
                    />
                  </div>
                </div>

                {/* Brand Text - Responsive sizing */}
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-0.5 sm:mb-1 drop-shadow-2xl tracking-wide truncate" style={{fontFamily: 'serif'}}>
                    حبیب دکان
                  </h1>
                  <p className="text-amber-200 text-xs sm:text-sm md:text-base lg:text-lg font-semibold tracking-wider truncate">HABIB DUKAN - Point of Sale</p>
                </div>
              </div>

              {/* Cart Summary - Responsive sizing */}
              <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg px-4 sm:px-6 md:px-8 py-3 sm:py-4 border border-white border-opacity-30 shadow-xl w-full sm:w-auto">
                <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4">
                  <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300 flex-shrink-0" strokeWidth={2.5} />
                  <div className="text-center sm:text-right">
                    <p className="text-amber-200 text-xs sm:text-sm font-semibold uppercase tracking-wider">Cart Items</p>
                    <p className="text-white text-2xl sm:text-3xl font-bold">{cart.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid - Responsive layout */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Products Section - Takes full width on mobile, 2/3 on desktop */}
          <div className="lg:col-span-2">
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl p-4 sm:p-5 border border-gray-200">
              {/* Header with Search - Responsive flex direction */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-5 pb-4 border-b-2 border-amber-200 gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-600 to-amber-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                    <Package className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="truncate">Available Products</span>
                </h2>
                {/* Search Bar - Responsive width and text color fixed to black */}
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 w-full sm:w-64 md:w-80 rounded-lg border-2 border-gray-300 focus:border-red-600 focus:outline-none transition-all duration-300 bg-white shadow-sm font-medium text-gray-900 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Products Grid - Responsive columns and height */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-h-[450px] sm:max-h-[550px] md:max-h-[650px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredProducts.length === 0 && (
                  <div className="col-span-full text-center py-12 sm:py-16">
                    <Package className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-base sm:text-lg font-semibold">No products found</p>
                  </div>
                )}
                {filteredProducts.map(product => (
                  <div
                    key={product._id}
                    className={`relative group bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-lg p-3 sm:p-4 shadow-md hover:shadow-xl hover:border-red-400 transform hover:-translate-y-1 transition-all duration-300 ${
                      animateCart === product._id ? 'animate-pulse scale-105 border-green-500' : ''
                    }`}
                  >
                    {/* Stock Badge - Responsive sizing */}
                    <div className={`absolute top-2 sm:top-3 right-2 sm:right-3 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs font-bold shadow-md ${
                      product.stock > 10 ? 'bg-green-500 text-white' : 
                      product.stock > 0 ? 'bg-yellow-500 text-white' : 
                      'bg-red-500 text-white'
                    }`}>
                      {product.stock > 0 ? `Stock: ${product.stock}` : 'OUT'}
                    </div>

                    <div className="mb-3 sm:mb-4 pt-5 sm:pt-6">
                      <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 line-clamp-2 min-h-[44px] sm:min-h-[56px]">{product.name}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs sm:text-sm text-gray-500 font-semibold">Rs.</span>
                        <span className="text-2xl sm:text-3xl font-bold text-red-700">{product.retailPrice.toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock <= 0}
                      className={`w-full py-2.5 sm:py-3 rounded-lg font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-md text-sm sm:text-base ${
                        product.stock > 0
                          ? 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 hover:shadow-lg transform hover:scale-105'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cart Section - Takes full width on mobile, 1/3 on desktop */}
          <div className="lg:col-span-1">
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl p-4 sm:p-5 border border-gray-200 lg:sticky lg:top-4">
              {/* Cart Header - Responsive sizing */}
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b-2 border-amber-200">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-600 to-amber-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Shopping Cart</h2>
              </div>

              {/* Cart Items - Responsive height */}
              <div className="mb-4 sm:mb-5 max-h-[250px] sm:max-h-[280px] md:max-h-[320px] overflow-y-auto custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="text-center py-10 sm:py-14">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" />
                    </div>
                    <p className="text-gray-400 font-semibold text-sm sm:text-base">Cart is empty</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div
                      key={item.productId}
                      className="bg-gradient-to-r from-gray-50 to-amber-50 border-2 border-gray-200 rounded-lg p-3 sm:p-4 mb-2 sm:mb-3 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-2 sm:mb-3">
                        <h4 className="font-bold text-gray-900 flex-1 text-xs sm:text-sm leading-tight">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-red-600 hover:text-white hover:bg-red-600 rounded-md p-1 sm:p-1.5 transition-all duration-300 ml-2 flex-shrink-0"
                        >
                          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.5} />
                        </button>
                      </div>

                      <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-1.5 sm:gap-2 bg-white rounded-md p-1 shadow-sm border border-gray-200">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-100 hover:bg-red-100 rounded-md flex items-center justify-center transition-all duration-300"
                          >
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" strokeWidth={2.5} />
                          </button>
                          <span className="w-6 sm:w-8 text-center font-bold text-gray-900 text-sm sm:text-base">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-100 hover:bg-green-100 rounded-md flex items-center justify-center transition-all duration-300"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" strokeWidth={2.5} />
                          </button>
                        </div>
                        <p className="font-bold text-base sm:text-lg md:text-xl text-red-700 whitespace-nowrap">
                          Rs. {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Payment Method - Responsive sizing */}
              <div className="mb-4 sm:mb-5">
                <label className="block text-xs sm:text-sm font-bold text-gray-800 mb-2 sm:mb-3 uppercase tracking-wider">Payment Method</label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button
                    onClick={() => setPaymentMethod("Cash")}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 font-bold text-sm sm:text-base ${
                      paymentMethod === "Cash"
                        ? 'bg-gradient-to-br from-red-600 to-amber-600 text-white border-transparent shadow-lg scale-105'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-red-400 shadow-sm'
                    }`}
                  >
                    <Banknote className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                    <span>Cash</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod("Card")}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 font-bold text-sm sm:text-base ${
                      paymentMethod === "Card"
                        ? 'bg-gradient-to-br from-red-600 to-amber-600 text-white border-transparent shadow-lg scale-105'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-red-400 shadow-sm'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
                    <span>Card</span>
                  </button>
                </div>
              </div>

              {/* Total - Responsive sizing */}
              <div className="bg-gradient-to-r from-red-700 to-amber-700 rounded-lg p-4 sm:p-5 mb-4 sm:mb-5 shadow-xl border-t-4 border-amber-400">
                <div className="flex justify-between items-center text-white">
                  <span className="text-base sm:text-lg font-bold uppercase tracking-wider">Total Amount</span>
                  <div className="text-right">
                    <div className="text-xs text-amber-200 mb-1">PKR</div>
                    <div className="text-2xl sm:text-3xl font-bold whitespace-nowrap">Rs. {getTotal().toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Complete Sale Button - Responsive sizing */}
              <button
                onClick={createSale}
                disabled={loading || cart.length === 0}
                className={`w-full py-3 sm:py-4 rounded-lg font-bold text-white text-base sm:text-lg transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-lg ${
                  loading || cart.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                    <span>Complete Sale</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.7); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #dc2626, #d97706);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #b91c1c, #b45309);
        }
      `}</style>
    </div>
  );
}