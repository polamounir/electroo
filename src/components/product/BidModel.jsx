import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../api/axiosInstance";
import BidTableModel from "./BidTableModel";

export default function BidModel({ product }) {
  const [isBidModelOpen, setIsBidModelOpen] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [showBidList, setShowBidList] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [allBids, setAllBids] = useState(product.productBids || []);

  const toggleBidModal = () => setIsBidModelOpen((prev) => !prev);

  const handleBidSubmit = async (e) => {
    e.preventDefault();

    const numericBid = parseFloat(bidAmount);
    if (!numericBid || numericBid < product.bidMinimumPrice) {
      toast.error(`يجب أن تكون المزايدة ${product.bidMinimumPrice} على الأقل`);
      return;
    }

    try {
      setIsSubmitLoading(true);
      const { data } = await api.post("/auctions/place-bid", {
        productId: product.id,
        price: numericBid,
      });

      toast.success(`تم تقديم عرض بقيمة ${numericBid} جنيه`);

      setAllBids((prev) => [
        ...prev,
        {
          username: "أنا",
          price: numericBid,
        },
      ]);

      setBidAmount("");
      setIsBidModelOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.detail || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  return (
    <div dir="rtl">
      <div className="flex gap-4 mt-6 flex-wrap">
        <button
          onClick={toggleBidModal}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-lg shadow-md transition"
        >
          مزايدة على المنتج
        </button>

        <button
          onClick={() => setShowBidList(true)}
          className="px-6 py-3 border border-teal-500 text-teal-600 font-semibold rounded-lg hover:bg-teal-50 transition"
        >
          عرض المزايدات
        </button>
      </div>

      {/* Bid Form Modal */}
      {isBidModelOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <button
              onClick={toggleBidModal}
              className="absolute top-2 left-2 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4 text-right">قدم عرضك</h2>

            <form onSubmit={handleBidSubmit}>
              <input
                type="number"
                placeholder="أدخل قيمة المزايدة"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="w-full px-4 py-2 mb-3 border border-gray-300 rounded text-right focus:border-teal-500 duration-200"
                min={product.bidMinimumPrice}
                step="0.01"
                required
              />
              <p className="text-teal-600 mb-5 text-sm">
                أقل قيمة للمزايدة:{" "}
                <span className="font-bold">
                  {product.bidMinimumPrice} جنيه
                </span>
              </p>
              <button
                type="submit"
                disabled={isSubmitLoading}
                className={`w-full py-2 rounded text-white flex items-center justify-center transition ${
                  isSubmitLoading
                    ? "bg-teal-300 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-500"
                }`}
              >
                {isSubmitLoading ? "جاري الإرسال..." : "إرسال المزايدة"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bid Table Modal */}
      {showBidList && (
        <BidTableModel data={allBids} onClose={() => setShowBidList(false)} />
      )}
    </div>
  );
}
