import {
  Box,
  Text,
  HStack,
  IconButton,
  Input,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  VStack,
  Button,
  Tooltip,
  Spacer,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { YearMonthSwitcher } from "../components/YearMonthSwitcher";
import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { TbBrandOpenai } from "react-icons/tb";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { useCookies } from "react-cookie";
import { fetchReports } from "../actions/report";
import { axiosConfigure } from "../helpers/axiosConfig";
import { Report } from "../types/Report";

export const Home = () => {
  const [cookies, ,] = useCookies(["token"]);
  const today = new Date();
  console.log(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (cookies.token === undefined) {
      //ひゃー
      return;
    }

    const lastDay = new Date(year, month, 0).getDate();
    const weeks = ["日", "月", "火", "水", "木", "金", "土"];
    const reports: Report[] = Array.from(
      { length: lastDay },
      (_, k) => k + 1
    ).map((day) => {
      const date = new Date(year, month, day).getDay();
      const week = weeks[date];
      return {
        date: `${day}日（${week}）`,
      };
    });

    axiosConfigure();

    const _fetchReports = async () => {
      const response = await fetchReports(year.toString(), month.toString());
      console.log(response.data.map((data) => new Date(data.date).getDate()));

      response.data.forEach((data) => {
        const date = new Date(data.date).getDate();
        reports[date - 1] = {
          id: data.id,
          date: reports[date - 1].date,
          startTime: data.startTime,
          endTime: data.endTime,
          report: data.report,
          reportType: data.reportType,
        };
      });

      setReports(reports);
      setIsLoading(false);
    };

    _fetchReports();
  }, []);

  const handleYearMonthChange = (year: number, month: number) => {
    setYear(year);
    setMonth(month);
  };

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
        w={"920px"}
        overflowX={"scroll"}
        m={"auto"}
        bg={"white"}
        p={4}
        rounded={"md"}
      >
        {isLoading ? (
          <Center w={"900px"}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Center>
        ) : (
          <Table w={"900px"}>
            <Thead>
              <Tr>
                <Th>日付</Th>
                <Th>開始時間</Th>
                <Th>終了時間</Th>
                <Th>休憩時間</Th>
                <Th>稼働時間</Th>
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
                      date={item.date}
                      startTime={"0:00"}
                      endTime={"0:00"}
                      restTime={"0:00"}
                      report={item.report ?? ""}
                      reportType="CHAT_GPT_WAITING"
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

type CellProps = {
  date: string;
  startTime: string;
  endTime: string;
  restTime: string;
  report: string;
  reportType: "CHAT_GPT_WAITING" | "CHAT_GPT_RUNNING";
};

const Cell = (props: CellProps) => {
  const [report, setReport] = useState(props.report);
  const [reportMode, setReportMode] = useState<"edit" | "normal">("normal");
  const [hover, setHover] = useState(false);

  const handleCancel = () => {
    setReportMode("normal");
    setReport(props.report);
  };

  const handleOk = () => {
    setReportMode("normal");
  };

  // TODO
  const opeseconds =
    new Date(`1990-01-01 ${props.endTime}`).getTime() -
    new Date(`1990-01-01 ${props.startTime}`).getTime();
  // new Date(`${props.restTime}`).getTime();

  const opetime =
    Math.floor(opeseconds / 1000 / 60 / 60) +
    ":" +
    Math.floor((opeseconds / 1000 / 60) % 60);

  return (
    <Tr
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Th
        color={
          props.date.includes("（土）")
            ? "blue.300"
            : props.date.includes("（日）")
            ? "red.300"
            : ""
        }
      >
        {props.date}
      </Th>
      <Th>{props.startTime}</Th>
      <Th>{props.endTime}</Th>
      <Th>{props.restTime}</Th>
      <Th>{opetime}</Th>

      {reportMode === "edit" ? (
        <Th>
          <HStack>
            <Input
              size={"sm"}
              value={report}
              onChange={(e) => {
                setReport(e.target.value);
              }}
            />
            <IconButton
              size={"sm"}
              icon={<CheckIcon />}
              aria-label={"ok"}
              onClick={handleOk}
            />
            <IconButton
              size={"sm"}
              icon={<CloseIcon />}
              aria-label={"cancel"}
              onClick={handleCancel}
            />
          </HStack>
        </Th>
      ) : (
        <Th>
          <HStack>
            <Text w={"full"} h={"20px"}>
              {report}
            </Text>
            {hover && (
              <>
                <IconButton
                  size={"sm"}
                  icon={<FiEdit2 />}
                  aria-label={"edit"}
                  onClick={() => setReportMode("edit")}
                  h={"20px"}
                  w={"20px"}
                />

                {props.reportType === "CHAT_GPT_WAITING" && (
                  <Tooltip label={"Githubから推測"}>
                    <IconButton
                      size={"sm"}
                      icon={<TbBrandOpenai />}
                      aria-label={"edit"}
                      h={"20px"}
                      w={"20px"}
                    />
                  </Tooltip>
                )}
              </>
            )}
          </HStack>
        </Th>
      )}
    </Tr>
  );
};
