import {
  FaTools,
  FaShippingFast,
  FaHeadset,
  FaUserPlus,
  FaMapMarkerAlt,
  FaClock,
  FaQuestionCircle,
} from "react-icons/fa";
import { MdOutlineElectricalServices } from "react-icons/md";
import { HiOutlineLightningBolt } from "react-icons/hi";

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-right" dir="rtl">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-3 text-teal-500">
          <HiOutlineLightningBolt className="inline mr-2" />
          منصة تواصل موردين قطع الغيار مع فنيي الصيانة
        </h1>
        <p className="text-lg text-gray-600">
          نوفر حلولاً متكاملة لتوصيل قطع غيار الأجهزة الإلكترونية لفنيي الصيانة
          المعتمدين
        </p>
      </header>

      <section className="mb-10 bg-teal-50 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <MdOutlineElectricalServices className="text-3xl text-teal-500 ml-2" />
          <h2 className="text-2xl font-semibold text-teal-700">من نحن؟</h2>
        </div>
        <p className="text-lg mb-4">
          نحن <strong className="text-teal-600">منصة متخصصة</strong> في ربط
          موردين ومصنعي <strong>القطع الإلكترونية ولوحات الدوائر</strong> مع
          فنيي الصيانة المعتمدين. نهدف إلى تسهيل عملية توفير قطع الغيار الأصلية
          بأسعار تنافسية مع ضمان وصولها في{" "}
          <strong className="text-teal-600">أسرع وقت ممكن</strong>.
        </p>
      </section>

      <section className="mb-10">
        <div className="flex items-center mb-6">
          {/* <MdVisionTimeline className="text-3xl text-teal-500 ml-2" /> */}
          <h2 className="text-2xl font-semibold text-teal-700">
            رؤيتنا ورسالتنا
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-teal-500">
            <h3 className="text-xl font-medium mb-3 flex items-center">
              <FaTools className="ml-2 text-teal-500" />
              <span>الرؤية</span>
            </h3>
            <p>
              أن نكون المنصة الاكبر لربط موردي القطع الإلكترونية بفنيي الصيانة
              المحترفين.
            </p>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-teal-500">
            <h3 className="text-xl font-medium mb-3 flex items-center">
              <FaShippingFast className="ml-2 text-teal-500" />
              <span>الرسالة</span>
            </h3>
            <p>
              توفير نظام متكامل يضمن وصول القطع الإلكترونية الأصلية بسرعة ودقة
              لفنيي الصيانة المعتمدين.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-6 text-teal-700">
          كيف تعمل المنصة؟
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-medium mb-3 flex items-center text-teal-600">
              <FaUserPlus className="ml-2" />
              <span>للموردين والتجار</span>
            </h3>
            <ul className="list-disc pr-5 space-y-2 text-gray-700">
              <li>تسجيل حساب كمورد أو تاجر لقطع الغيار الإلكترونية</li>
              <li>عرض المنتجات (لوحات دوائر - قطع غيار - مكونات إلكترونية)</li>
              <li>التواصل المباشر مع فنيي الصيانة المعتمدين</li>
              <li>نظام طلبات متكامل مع إدارة المخزون</li>
            </ul>
          </div>
          <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-medium mb-3 flex items-center text-teal-600">
              <FaTools className="ml-2" />
              <span>لفنيي الصيانة</span>
            </h3>
            <ul className="list-disc pr-5 space-y-2 text-gray-700">
              <li>إنشاء حساب كفني صيانة او مستخدم</li>
              <li>البحث عن القطع الإلكترونية المطلوبة</li>
              <li>طلب قطع الغيار مع تتبع الشحن</li>
              <li>الدعم الفني المباشر من الموردين</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-center mb-6">
          <FaQuestionCircle className="text-3xl text-teal-500 ml-2" />
          <h2 className="text-2xl font-semibold text-teal-700">
            الأسئلة الشائعة
          </h2>
        </div>

        <div className="space-y-4">
          <div className="border border-teal-100 rounded-lg p-5 hover:border-teal-300 transition-colors">
            <h3 className="text-xl font-medium mb-2 flex items-center">
              <FaUserPlus className="ml-2 text-teal-500" />
              <span>كيف يمكنني التسجيل كمورد أو فني صيانة؟</span>
            </h3>
            <ul className="list-disc pr-5 space-y-1 text-gray-700">
              <li>اضغط على زر "إنشاء حساب"</li>
              <li>اختر نوع الحساب (مورد/تاجر أو مستخدم)</li>
              <li>
                املأ البيانات المطلوبة بما في ذلك الرخصة التجارية (للموردين)
              </li>
              <li>انتظر الموافقة على حسابك (خلال 24 ساعة عمل)</li>
            </ul>
          </div>

          <div className="border border-teal-100 rounded-lg p-5 hover:border-teal-300 transition-colors">
            <h3 className="text-xl font-medium mb-2 flex items-center">
              <FaMapMarkerAlt className="ml-2 text-teal-500" />
              <span>ما هي مناطق التغطية؟</span>
            </h3>
            <p className="mb-2 text-gray-700">نحن نغطي حالياً:</p>
            <ul className="list-disc pr-5 text-gray-700">
              <li>جميع محافظات مصر</li>
            </ul>
          </div>

          <div className="border border-teal-100 rounded-lg p-5 hover:border-teal-300 transition-colors">
            <h3 className="text-xl font-medium mb-2 flex items-center">
              <FaClock className="ml-2 text-teal-500" />
              <span>كم يستغرق وصول الطلبات؟</span>
            </h3>
            <p className="text-gray-700">
              <strong className="text-teal-600">للطلبات العاجلة:</strong> خلال
              24-48 ساعة (في المدن الرئيسية)
              <br />
              <strong className="text-teal-600">للطلبات العادية:</strong> 2-5
              أيام عمل حسب الموقع
            </p>
          </div>

          <div className="border border-teal-100 rounded-lg p-5 hover:border-teal-300 transition-colors">
            <h3 className="text-xl font-medium mb-2 flex items-center">
              <FaHeadset className="ml-2 text-teal-500" />
              <span>كيف أحصل على الدعم الفني؟</span>
            </h3>

            <ul className="list-disc pr-5 text-gray-700">
              <li>
                الدعم عبر{" "}
                <strong className="text-teal-600">الدردشة الحية</strong> (من 8
                صباحاً إلى 10 مساءً)
              </li>
              {/* <li>تذاكر الدعم الفني على المنصة</li> */}
              <li>
                الاتصال على{" "}
                <strong className="text-teal-600">01234567890</strong>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="bg-teal-600 text-white p-8 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 flex items-center justify-end">
          <FaHeadset className="ml-2" />
          <span>تواصل مع فريق الدعم</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-medium mb-3">للأسئلة الفنية:</h3>
            <p className="mb-2">support@electro.com</p>
            <p>01234567890</p>
          </div>
          {/* <div>
            <h3 className="text-xl font-medium mb-3">للموردين والشركاء:</h3>
            <p className="mb-2">partners@electro.com</p>
            <p>01234567890</p>
          </div> */}
        </div>
        <p className="mt-6 text-teal-100 text-center">
          نعمل من 8 صباحاً حتى 10 مساء
        </p>
      </section>
    </div>
  );
};

export default About;
