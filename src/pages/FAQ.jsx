import React, { useState } from "react";

export default function FAQ() {
  const [expandedItem, setExpandedItem] = useState(null);

  const faqItems = [
    {
      id: 1,
      question: "من نحن؟",
      answer:
        "نحن منصّة إلكترونية متخصصة في ربط وتوفير القنوات التسويقية للمنتجات الغذائية، ونسعى إلى تسهيلة توزيع وإيصال هذه المنتجات إلى نطاق واسع. هدفنا توصيل المنتج الغذائي في وقت قياسي وبأفضل جودة للعميل النهائي.",
    },
    {
      id: 2,
      question: "كيف يمكنني التسجيل كتاجر أو مورد في المنصة؟",
      answer:
        'ببساطة عليك النقر على زر "إنشاء حساب"، واختيار نوع الحساب (تاجر أو مورد)، ثم تعبئة النموذج وتقديم جميع البيانات المطلوبة ثم متابعة الخطوات التي تظهر لك لتفعيل حسابك.',
    },
    {
      id: 3,
      question: "هل يوجد دعم فني للطلب؟",
      answer:
        "نعم! نوفر فريق دعم فني متكامل يسعى لتقديم المساعدة الفنية بشكل سريع وتام. يمكنك التواصل معنا من خلال تذاكر الدعم في صفحة اتصل بنا.",
    },
    {
      id: 4,
      question: "ما نطاق تغطية المنصة؟",
      answer:
        "توجد خدمات المنصة في المدن الرئيسية مثل: الرياض، جدة، الإحسائي، و المدينة عند الاستمرار (يمكن للمستخدم).",
    },
    {
      id: 5,
      question: "كم يستغرق الشحن؟",
      answer:
        "يعتمد الوقت على موقعك من مستودع ومخازن البضائع المطلوبة، لكن في المتوسط يستغرق فترة 2-7 أيام.",
    },
    {
      id: 6,
      question: "كيف يمكنني التعامل مع خدمة العملاء؟",
      answer:
        "يمكننك مراسلة الفريق عبر البريد الإلكتروني، أو من خلال نظام تذاكر الدعم على الموقع. أو الاتصال برقم الدعم المتوفر في أسفل الصفحة.",
    },
  ];

  const toggleItem = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    <div className="pt-10 pb-20 px-4 md:px-10 lg:px-20  mx-auto min-h-[90svh]">
      <h1 className="text-xl font-bold text-red-500 mb-8 text-right">
        بعض الأسئلة الشائعة
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
        <div className="lg:col-span-1">
          {faqItems.slice(0, 3).map((item) => (
            <div key={item.id} className="mb-6">
              <h2 className="text-base font-semibold mb-2 text-right">
                {item.question}
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex justify-end mt-2">
                  <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-right leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1 flex justify-center items-center">
          <img
            src="/api/placeholder/300/300"
            alt="FAQ"
            className="max-w-full"
          />
        </div>

        <div className="lg:col-span-1">
          {faqItems.slice(3).map((item) => (
            <div key={item.id} className="mb-6">
              <h2 className="text-base font-semibold mb-2 text-right">
                {item.question}
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex justify-end mt-2">
                  <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-right leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1 flex justify-center items-center">
          <img
            src="/api/placeholder/300/300"
            alt="FAQ"
            className="max-w-full"
          />
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 transition-colors">
          قراءة المزيد
        </button>
      </div>
    </div>
  );
}
