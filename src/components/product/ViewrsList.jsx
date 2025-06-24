import { useEffect } from "react";
import { useProductViewers } from "../../hooks/useProductViewers";
import { FaUserSecret } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";
export default function ViewrsList({ data }) {
  const { viewers } = useProductViewers(data) || [];
  const lista = [
    "#06B6D4",
    null,
    "#14B8A6",
    null,
    "#22C55E",
    "#06B6D4",
    "#2DD4BF",
    "#14B8A6",
    "#10B981",
    "#10B981",
    "#10B981",
    "#10B981",
    "#10B981",
    "#10B981",
    "#10B981",
    "#10B981",
    "#10B981",
    "#10B981",
    "#22C55E",
    "#22C55E",
    "#22C55E",
  ];
  const colors = [
    "#06B6D4",
    "#2DD4BF",
    "#14B8A6",
    "#10B981",
    "#22C55E",
    "#06B6D4",
    "#2DD4BF",
    "#14B8A6",
    "#10B981",
    "#22C55E",
  ];

  const displayedViewrs = viewers.slice(0, 5);
  const restUsers = viewers.slice(5, viewers.length);

  return (
    <div>
      <div className="flex items-center justify-center mb-2">
        <h2>يشاهدون الان </h2>
      </div>
      <ul className="flex ">
        {displayedViewrs?.map((viewer, i) => {
            console.log(viewer);
          return (
            <li
              key={i}
              className={`group w-12 h-12 rounded-full border border-white -ms-2 text-xl  flex justify-center items-center relative`}
              style={{ background: `${colors[i]}` }}
            >
              <span className="text-white text-2xl">
                {viewer ? <FaUserAlt /> : <FaUserSecret />}
              </span>

              <span className=" absolute -top-10 right-5 hidden group-hover:flex bg-teal-200 text-sm px-5 py-2 rounded-es-0 rounded-ss-2xl rounded-se-2xl rounded-ee-2xl text-nowrap">
                {viewer ? viewer : "مجهول"}
              </span>
            </li>
          );
        })}

        {restUsers.length > 0 && (
          <li
            className={`w-12 h-12 rounded-full border border-white -ms-2 text-xl bg-black flex justify-center items-center`}
          >
            <span className="text-white text-2xl">+{restUsers.length}</span>
          </li>
        )}
      </ul>
    </div>
  );
}
