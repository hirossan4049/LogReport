import { VStack, Text, HStack, IconButton, Icon } from "@chakra-ui/react";
import { YearMonthSwitcher } from "../components/YearMonthSwitcher";
import { useState } from "react";


export const Home = () => {
  const [year, setYear] = useState(2023);
  const [month, setMonth] = useState(1);

  const handleYearMonthChange = (year: number, month: number) => {
    setYear(year)
    setMonth(month)
  };

  return (
    <VStack>
      <YearMonthSwitcher year={year} month={month} onChange={handleYearMonthChange} />
    </VStack>
  );
};
