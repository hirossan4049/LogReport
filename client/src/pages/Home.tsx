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
} from "@chakra-ui/react";
import { YearMonthSwitcher } from "../components/YearMonthSwitcher";
import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { TbBrandOpenai } from "react-icons/tb";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

export const Home = () => {
  const today = new Date();
  console.log(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [reports, setReports] = useState<string[]>([]);

  useEffect(() => {
    const lastDay = new Date(year, month, 0).getDate();
    const reports = Array.from({ length: lastDay }, (_, k) => k + 1).map(
      (day) => {
        return String(day);
      }
    );

    setReports(reports);
  }, []);

  const handleYearMonthChange = (year: number, month: number) => {
    setYear(year);
    setMonth(month);
  };

  return (
    <VStack bg={"gray.50"} w={"full"}>
      <YearMonthSwitcher
        year={year}
        month={month}
        onChange={handleYearMonthChange}
      />

      <Box
        w={"880px"}
        overflowX={"scroll"}
        m={"auto"}
        bg={"white"}
        p={4}
        rounded={"md"}
      >
        <Table w={"860px"}>
          <Thead>
            <Tr>
              <Th>日付</Th>
              <Th>開始時間</Th>
              <Th>終了時間</Th>
              <Th>休憩時間</Th>
              <Th colSpan={2} w={"400px"}>
                作業内容
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {reports.map((item) => {
              return (
                <Cell
                  date={item}
                  startTime={"9:00"}
                  endTime={"18:00"}
                  restTime={"1:00"}
                  report={"頑張った"}
                  reportType="CHAT_GPT_WAITING"
                />
              );
            })}
          </Tbody>
        </Table>
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

  const handleCancel = () => {
    setReportMode("normal");
    setReport(props.report);
  };

  const handleOk = () => {
    setReportMode("normal");
  };

  return (
    <Tr>
      <Th>{props.date}</Th>
      <Th>{props.startTime}</Th>
      <Th>{props.endTime}</Th>
      <Th>{props.restTime}</Th>

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
            <Text w={"full"}>{report}</Text>
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
          </HStack>
        </Th>
      )}
    </Tr>
  );
};
