import { HStack, IconButton, Text, Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  BsChevronDoubleLeft,
  BsChevronLeft,
  BsChevronRight,
  BsChevronDoubleRight,
} from "react-icons/bs";

export const YearMonthSwitcher = (props: {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
}) => {
  const [year, setYear] = useState(props.year);
  const [month, setMonth] = useState(props.month);

  useEffect(() => {
    props.onChange(year, month);
  }, [year, month]);

  const handlePrevMonth = () => {
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  };

  const handlePrevYear = () => {
    setYear(year - 1);
  };

  const handleNextYear = () => {
    setYear(year + 1);
  };

  return (
    <HStack spacing={0}>
      <Tooltip label={"1年前"}>
        <IconButton
          onClick={handlePrevYear}
          bg={"clear"}
          icon={<BsChevronDoubleLeft />}
          aria-label={"1年前"}
        />
      </Tooltip>
      <Tooltip label={"1ヶ月前"}>
        <IconButton
          onClick={handlePrevMonth}
          bg={"clear"}
          icon={<BsChevronLeft />}
          aria-label={"1ヶ月前"}
        />
      </Tooltip>
      <Text px={2}>{year}年</Text>
      <Text px={2}>{month}月</Text>
      <Tooltip label={"1ヶ月後"}>
        <IconButton
          onClick={handleNextMonth}
          bg={"clear"}
          icon={<BsChevronRight />}
          aria-label={"1ヶ月後"}
        />
      </Tooltip>
      <Tooltip label={"1年後"}>
        <IconButton
          onClick={handleNextYear}
          bg={"clear"}
          icon={<BsChevronDoubleRight />}
          aria-label="1年後"
        />
      </Tooltip>
    </HStack>
  );
};
