import React from "react";

const ContactUs = () => {
  return (
    <div className="bg-gray-50 flex items-center justify-center p-6 py-30">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          تواصل معنا
        </h2>
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 mb-2" htmlFor="name">
                الاسم
              </label>
              <input
                type="text"
                id="name"
                placeholder="اسمك"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-2" htmlFor="email">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-2" htmlFor="subject">
              الموضوع
            </label>
            <input
              type="text"
              id="subject"
              placeholder="موضوع الرسالة"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-2" htmlFor="message">
              الرسالة
            </label>
            <textarea
              id="message"
              rows="5"
              placeholder="اكتب رسالتك هنا..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-all duration-300"
            >
              إرسال الرسالة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
