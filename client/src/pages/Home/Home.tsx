import {
  Box,
  Text,
  HStack,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  VStack,
  Button,
  Spacer,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { YearMonthSwitcher } from "../../components/YearMonthSwitcher";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { fetchAutocomplete, fetchReports } from "../../actions/report";
import { axiosConfigure } from "../../helpers/axiosConfig";
import { Report } from "../../types/Report";
import { ApiStatusCode } from "../../types/ApiStatusCode";
import { useNavigate } from "react-router-dom";
import { Cell } from "./ReportCell";

export const Home = () => {
  const [cookies, , removeCookie] = useCookies(["token"]);
  const navigate = useNavigate();

  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const _fetchReports = async () => {
    const lastDay = new Date(year, month, 0).getDate();
    const reports: Report[] = Array.from(
      { length: lastDay },
      (_, k) => k + 1
    ).map((day) => {
      const date = new Date(year, month, day);
      return {
        date: date,
      };
    });

    const response = await fetchReports(year.toString(), month.toString());
    if (response.code === ApiStatusCode.Success) {
      response.data.forEach((data) => {
        const date = new Date(data.date!);
        const day = date.getDate();
        reports[day - 1] = data;
      });
    } else if (response.code === ApiStatusCode.TokenExpired) {
      removeCookie("token");
      navigate("/login");
      return;
    }
    console.log(response.data.map((data) => new Date(data.startTime!)));

    setReports(reports);
    setIsLoading(false);
  };

  useEffect(() => {
    if (cookies.token === undefined) {
      //ひゃー
      return;
    }

    axiosConfigure();

    _fetchReports();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    _fetchReports();
  }, [year, month]);

  const handleYearMonthChange = (year: number, month: number) => {
    setYear(year);
    setMonth(month);
  };

  const handleAutocomplete = async (item: Report) => {
    const date = item.date;
    setReports((prevState) =>
      prevState.map((obj) =>
        obj.id === item.id ? { ...obj, reportType: "CHAT_GPT_RUNNING" } : obj
      )
    );

    if (!item.id) {
      return;
    }
    const report = await fetchAutocomplete(item.id);
    if (!report.data) {
      return;
    }
    report.data.date = date;
    setReports((prevState) =>
      prevState.map((obj) => (obj.id === item.id ? report.data! : obj))
    );
  };

  if (!cookies.token) {
    return (
      <VStack w={"full"}>
        <Text p={32}>ログインしてください</Text>
      </VStack>
    );
  }

  return (
    <VStack bg={"gray.50"} w={"full"}>
      <HStack py={8} w={"880px"}>
        <YearMonthSwitcher
          year={year}
          month={month}
          onChange={handleYearMonthChange}
        />
        <Spacer />
        <Button>空欄の部分を一括予測</Button>
      </HStack>

      <Box
        w={"1020px"}
        overflowX={"scroll"}
        m={"auto"}
        bg={"white"}
        p={4}
        rounded={"md"}
      >
        {isLoading ? (
          <Center w={"900px"} h={"200px"}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Center>
        ) : (
          <Table w={"1000px"}>
            <Thead>
              <Tr>
                <Th w={"120px"} textAlign={"center"}>日付</Th>
                <Th textAlign={"center"}>開始時間</Th>
                <Th textAlign={"center"}>終了時間</Th>
                <Th w={28} textAlign={"center"}>休憩時間</Th>
                <Th w={28} textAlign={"center"}>稼働時間</Th>
                <Th colSpan={2} w={"400px"}>
                  作業内容
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              <>
                {reports.map((item) => {
                  return (
                    <Cell
                      item={item}
                      handleAutocomplete={() => handleAutocomplete(item)}
                    />
                  );
                })}
              </>
            </Tbody>
          </Table>
        )}
      </Box>
    </VStack>
  );
};
