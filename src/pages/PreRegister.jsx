import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supplierImg from "../assets/images/supplier.jpg";
import userImg from "../assets/images/tech.jpg";
import { toast } from "sonner";

import Cookies from "js-cookie";

const RoleCard = ({ to, title, role, hoverRole, setHoverRole, image }) => (
  <Link
    to={to}
    className={`border rounded-lg p-4 flex-1 cursor-pointer hover:shadow-md transition-all ${
      hoverRole === role ? "border-teal-500" : "border-gray-200"
    }`}
    onMouseEnter={() => setHoverRole(role)}
    onMouseLeave={() => setHoverRole(null)}
    role="link"
    aria-label={`Navigate to ${title} registration page`}
  >
    <article className="flex flex-col items-center text-center">
      <div className="bg-green-50 rounded-full p-4 mb-4">
        <img src={image} alt="IMAGE" className="w-32 h-32 object-cover" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
    </article>
  </Link>
);

export default function PreRegister() {
  const [hoverRole, setHoverRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token =
      Cookies.get("accessToken") || localStorage.getItem("accessToken");
    if (token) {
      navigate("/redirect-user");
      toast.info("يرجي تسجيل الخروج اولاً ");
    }
  }, [navigate]);

  return (
    <main className="min-h-[70svh] pt-40 pb-40">
      <section className="flex flex-col items-center p-6 max-w-3xl mx-auto">
        <header className="w-full text-right mb-6">
          <h1 className="text-2xl font-bold mb-2">هل أنت مستخدم أم تاجر؟</h1>
          <p className="text-gray-600 text-sm">
            سيساعدنا تحديد الدور المناسب لك على تخصيص تجربتك معنا
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 w-full mb-8">
          <RoleCard
            to="/register"
            title="مستخدم"
            role="merchant"
            hoverRole={hoverRole}
            setHoverRole={setHoverRole}
            image={userImg}
          />
          <RoleCard
            to="/supplier-register"
            title="تاجر"
            role="supplier"
            hoverRole={hoverRole}
            setHoverRole={setHoverRole}
            image={supplierImg}
          />
        </div>
      </section>
    </main>
  );
}
