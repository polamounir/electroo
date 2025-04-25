import axios from "axios";
import { useEffect } from "react";
export default function SupplierAllChats() {
  const fetchChats = async () => {
    // const [data, setData] = useState([]);
    const options = {
      method: "GET",
      url: "https://ecommerce.markomedhat.com/api/conversations?page=1&limit=10",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIyMzhjZmIyMC1iNzI2LTRiNGYtMjY1MS0wOGRkODMwYWZkZDUiLCJGdWxsTmFtZSI6Itio2YjZhNinINmF2YbZitixIiwiZW1haWwiOiJuYWthbTU0MTc3QGY1dXJsLmNvbSIsIlVzZXJUeXBlIjoiU3VwcGxpZXIiLCJTdXBwbGllcklkIjoiN2VlMmJmZTYtNDdjOS00OWQ5LTlmYTYtNDI2MWIwMDhhOWNjIiwiVmVyaWZpZWRTdXBwbGllciI6IlRydWUiLCJuYmYiOjE3NDU1ODY2NDMsImV4cCI6MTc0NTU4Njk0MywiaWF0IjoxNzQ1NTg2NjQzfQ.ALgCm5ecr2qT7rHoYmCkv4T4gOtQss6GsWV4T3MSdOs",
      },
    };

    try {
      const { data } = await axios.request(options);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchChats();
  }, []);

  return <div>SupplierAllChats</div>;
}
