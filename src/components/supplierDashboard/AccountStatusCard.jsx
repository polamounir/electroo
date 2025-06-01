import {
  FaClock,
  FaTimesCircle,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";

function getPendingStatus() {
  return {
    icon: <FaClock className="text-amber-500" size={24} />,
    bgColor: "bg-amber-50",
    textColor: "text-amber-800",
    title: "قيد المراجعة",
    description: "يتم التحقق من حسابك من قبل فريقنا",
    actionText: "تحقق لاحقًا",
  };
}

function getRejectedStatus(message) {
  return {
    icon: <FaTimesCircle className="text-red-500" size={24} />,
    bgColor: "bg-red-50",
    textColor: "text-red-800",
    title: "تم رفض التحقق",
    description: message || "يرجى مراجعة المشكلات وإعادة التقديم",
    actionText: "إعادة إرسال المستندات",
  };
}

function getVerifiedStatus() {
  return {
    icon: <FaCheckCircle className="text-teal-500" size={24} />,
    bgColor: "bg-teal-50",
    textColor: "text-teal-800",
    title: "تم التحقق من الحساب",
    description: "تم تفعيل الوصول الكامل لحسابك",
    actionText: "الانتقال إلى لوحة التحكم",
  };
}

export default function AccountStatusCard({ status, message }) {
  let currentStatus;

  switch (status) {
    case "Pending":
      currentStatus = getPendingStatus();
      break;
    case "Rejected":
      currentStatus = getRejectedStatus(message);
      break;
    case "Verified":
      currentStatus = getVerifiedStatus();
      break;
    default:
      currentStatus = getPendingStatus();
      break;
  }

  return (
    <div
      className={`${currentStatus.bgColor} rounded-xl p-6 mx-auto shadow-sm`}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className="p-3 bg-white rounded-full shadow-xs">
          {currentStatus.icon}
        </div>

        <div>
          <h3
            className={`${currentStatus.textColor} font-semibold text-lg mb-1`}
          >
            {currentStatus.title}
          </h3>
          <p className="text-gray-600 mb-4">{currentStatus.description}</p>
        </div>

    

        <div>
          <button
            className={`mt-2 w-full py-2 px-4 rounded-lg font-medium ${
              status === "Rejected"
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-teal-600 text-white hover:bg-teal-700"
            } transition-colors`}
          >
            {currentStatus.actionText}
          </button>
        </div>
      </div>
    </div>
  );
}
