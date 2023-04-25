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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
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
import { ChevronDownIcon } from "@chakra-ui/icons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../../assets/Koruri-Regular-normal";

export const Home = () => {
  const [cookies, , removeCookie] = useCookies(["token"]);
  const navigate = useNavigate();

  const today = new Date();

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExportLoading, setIsExportLoading] = useState(false);

  const _fetchReports = async () => {
    const lastDay = new Date(year, month, 0).getDate();
    const reports: Report[] = Array.from(
      { length: lastDay },
      (_, k) => k + 1
    ).map((day) => {
      const date = new Date(year, month - 1, day);
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

  const handlePdfExport = () => {
    setIsExportLoading(true);
    const target = document.getElementById("report-table");
    if (target === null) return;

    html2canvas(target, { scale: 3.5 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/svg", 1.0);
      let pdf = new jsPDF();
      pdf.setFontSize(10);
      pdf.setFont("Koruri-Regular", "normal");
      pdf.text(`${year}年${month}月 作業報告書`, 10, 10);

      pdf.addImage(
        imgData,
        "SVG",
        5,
        12,
        canvas.width / 18,
        canvas.height / 18
      );
      pdf.save(`${year}-${month}-作業報告書.pdf`);
      setIsExportLoading(false);
    });
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
      <HStack py={2} w={"1020px"}>
        <YearMonthSwitcher
          year={year}
          month={month}
          onChange={handleYearMonthChange}
        />
        <Spacer />
        {/* <Button>空欄の部分を一括予測</Button> */}
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={
              isExportLoading ? (
                <Spinner h={3} w={3} mx={1.5} />
              ) : (
                <ChevronDownIcon />
              )
            }
          >
            エクスポート
          </MenuButton>
          <MenuList>
            <MenuItem onClick={handlePdfExport}>PDFで保存</MenuItem>
          </MenuList>
        </Menu>
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
          <Table w={"1000px"} id="report-table">
            <Thead>
              <Tr>
                <Th w={"120px"} textAlign={"center"}>
                  日付
                </Th>
                <Th textAlign={"center"}>開始時間</Th>
                <Th textAlign={"center"}>終了時間</Th>
                <Th w={28} textAlign={"center"}>
                  休憩時間
                </Th>
                <Th w={28} textAlign={"center"}>
                  稼働時間
                </Th>
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
