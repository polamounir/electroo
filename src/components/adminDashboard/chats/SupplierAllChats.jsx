import axios from "axios";
import { useEffect } from "react";
export default function SupplierAllChats() {
  const fetchChats = async () => {
    const options = {
      method: "GET",
      url: "https://ecommerce.zerobytetools.com/api/conversations?page=1&limit=10",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI1NGVlZTQ5YS1jZjlhLTQ1MzUtZTE5Ni0wOGRkNzA0MDMyOTEiLCJGdWxsTmFtZSI6Ik1hcmtvIE1lZGhhdCIsImVtYWlsIjoiemVyb2J5dGU5OTU1QGdtYWlsLmNvbSIsIlVzZXJUeXBlIjoiVXNlciIsIm5iZiI6MTc0MzQxNzU2MSwiZXhwIjoxODA4MjE3NTYxLCJpYXQiOjE3NDM0MTc1NjF9.1H-l-rzFGUrj64IxlL78N5Zd0zhW10cAvShxQJbeQN8",
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
