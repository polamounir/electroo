import { useEffect } from "react";
import { useProductViewers } from "../../hooks/useProductViewers";

export default function ViewrsList({ data }) {
  const { viewers } = useProductViewers(data);
  console.log(viewers);

  const lista = ["dd", "rr", "aa", "ax", "op"];

  return (
    <div>
      <ul>
        {lista.map((Viewer) => {
          <div className="w-10 h-10">
            <div></div>
          </div>;
        })}
      </ul>
    </div>
  );
}
