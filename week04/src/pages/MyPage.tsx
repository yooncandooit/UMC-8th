import axios from "axios";
import { getMyInfo } from "../apis/auth.ts"; 
import { useEffect, useState } from "react";

const MyPage = () => {
const [data, setData] = useState<{ name?: string }>({});

  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();
      console.log(response);
      setData(response.data);
    };
    getData();
  }, []);

  return <div>{data?.name}</div>;
};

export default MyPage;
