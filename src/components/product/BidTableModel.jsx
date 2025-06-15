export default function BidTableModel({ data = [], onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden border-2 border-teal-500">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="absolute top-3 left-3 text-teal-500 hover:text-teal-700 transition"
          >
            ✕
          </button>
        )}

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6 text-right border-b-2 border-teal-500 pb-3 text-teal-600">
          مزايدات المستخدمين
        </h2>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-right border border-teal-200 rounded-lg">
            <thead className="bg-teal-100 text-teal-700 font-medium">
              <tr>
                <th className="px-4 py-3 border-b border-teal-300">
                  اسم المستخدم
                </th>
                <th className="px-4 py-3 border-b border-teal-300">السعر</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((bid, index) => (
                  <tr
                    key={index}
                    className="hover:bg-teal-50 transition-colors duration-150"
                  >
                    <td className="px-4 py-2 border-b border-teal-100">
                      {bid.username}
                    </td>
                    <td className="px-4 py-2 border-b border-teal-100">
                      {bid?.price?.toFixed(2)} جنيه
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-4 text-center text-gray-500 border-b border-teal-100"
                  >
                    لا توجد عروض حاليًا.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
