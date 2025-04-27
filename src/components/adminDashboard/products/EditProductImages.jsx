import { useParams } from "react-router-dom";
import { getProductById } from "../../../api/product";
import { useQuery } from "@tanstack/react-query";

export default function EditProductImages() {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });
  return <div>EditProductImages</div>;
}
