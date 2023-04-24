import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Tr,
  Th,
  Input,
  HStack,
  IconButton,
  Tooltip,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useMemo, useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { TbBrandOpenai } from "react-icons/tb";
import { Report } from "../../types/Report";
import { putReport } from "../../actions/report";

type CellProps = {
  item: Report;
  handleAutocomplete: () => void;
};

export const Cell = (props: CellProps) => {
  const toast = useToast();
  const weeks = ["日", "月", "火", "水", "木", "金", "土"];
  const japaneseDate = useMemo(() => {
    const date = new Date(props.item.date);
    const day = date.getDay();
    const week = weeks[day];
    return `${date.getDate()}日（${week}）`;
  }, [props.item.date]);
  const [report, setReport] = useState(props.item.report);
  const [reportMode, setReportMode] = useState<"edit" | "normal">("normal");
  const [hover, setHover] = useState(false);

  const getDefaultStartTime = () => {
    const startTimeDate = new Date(props.item.startTime!);
    return (
      (startTimeDate.getHours() || 0).toString().padStart(2, "0") +
      ":" +
      (startTimeDate.getMinutes() || 0).toString().padStart(2, "0")
    );
  };
  const [startTime, setStartTime] = useState(getDefaultStartTime());

  const getDefaultEndTime = () => {
    const endTimeDate = new Date(props.item.endTime!);
    return (
      (endTimeDate.getHours() || 0).toString().padStart(2, "0") +
      ":" +
      (endTimeDate.getMinutes() || 0).toString().padStart(2, "0")
    );
  };
  const [endTime, setEndTime] = useState(getDefaultEndTime());

  const getDefaultRestTime = () => {
    const restTimeDate = new Date(props.item.restTime!);
    return (
      (restTimeDate.getHours() || 0).toString().padStart(2, "0") +
      ":" +
      (restTimeDate.getMinutes() || 0).toString().padStart(2, "0")
    );
  };
  const [restTime, setRestTime] = useState(getDefaultRestTime());

  const [opetime, setOpetime] = useState("00:00");

  useEffect(() => {
    setReport(props.item.report);
  }, [props.item.report]);

  useEffect(() => {
    calcOpetime();
  }, [startTime, endTime, restTime]);

  const calcOpetime = () => {
    const date = new Date(props.item.date);
    const [startHour, startMinute] = startTime
      .split(":")
      .map((v) => parseInt(v));
    const [endHour, endMinute] = endTime.split(":").map((v) => parseInt(v));
    const [restHour, restMinute] = restTime.split(":").map((v) => parseInt(v));

    date.setHours(endHour);
    date.setMinutes(endMinute);
    date.setHours(date.getHours() - startHour - restHour);
    date.setMinutes(date.getMinutes() - startMinute - restMinute);

    setOpetime(
      `${date.getHours().toString().padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`
    );
  };

  const handleCancel = () => {
    setReportMode("normal");
    setReport(props.item.report);
    setStartTime(getDefaultStartTime());
    setEndTime(getDefaultEndTime());
    setRestTime(getDefaultRestTime());
  };

  const handleOk = async () => {
    try {
      await handlePutReport();
      await setReportMode("normal");
    } catch (e) {
      console.error(e);
      toast({
        title: "エラー",
        description: "レポートの更新に失敗しました",
        status: "error",
      });
      handleCancel()
    }
  };

  const handlePutReport = async () => {
    const date = new Date(props.item.date);
    const [startHour, startMinute] = startTime
      .split(":")
      .map((v) => parseInt(v));
    const [endHour, endMinute] = endTime.split(":").map((v) => parseInt(v));
    const [restHour, restMinute] = restTime.split(":").map((v) => parseInt(v));

    date.setHours(endHour);
    date.setMinutes(endMinute);
    date.setHours(date.getHours() - startHour - restHour);
    date.setMinutes(date.getMinutes() - startMinute - restMinute);

    const [sdate, edate] = [startTime, endTime].map((v) => {
      const date = new Date(props.item.date);
      const [hour, minute] = v.split(":").map((v) => parseInt(v));
      date.setHours(hour);
      date.setMinutes(minute);
      return date.toISOString();
    });

    const rdate = (() => {
      const [h, m] = restTime.split(":").map((v) => parseInt(v));
      return h * 60 + m;
    })();

    let dateIso = "";
    if (props.item.date instanceof Date) {
      dateIso = props.item.date.toISOString();
    } else {
      dateIso = new Date(props.item.date).toISOString();
    }

    await putReport(dateIso, sdate, edate, rdate, `${report}`);
  };

  const ReportTh = () => {
    if (props.item.reportType === "CHAT_GPT_RUNNING") {
      return (
        <Th p={"10px"} pl={"32px"}>
          <Spinner h={5} w={5} />
        </Th>
      );
    } else {
      if (reportMode === "edit") {
        return (
          <Th>
            <HStack>
              <Input
                size={"sm"}
                h={5}
                value={report}
                onChange={(e) => {
                  setReport(e.target.value);
                }}
              />
              <IconButton
                size={"sm"}
                h={5}
                icon={<CheckIcon />}
                aria-label={"ok"}
                onClick={handleOk}
                bg={""}
              />
              <IconButton
                size={"sm"}
                h={5}
                icon={<CloseIcon />}
                aria-label={"cancel"}
                onClick={handleCancel}
                bg={""}
              />
            </HStack>
          </Th>
        );
      } else {
        return (
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
                  <Tooltip label={"Githubから推測"}>
                    <IconButton
                      size={"sm"}
                      icon={<TbBrandOpenai />}
                      aria-label={"edit"}
                      h={"20px"}
                      w={"20px"}
                      onClick={props.handleAutocomplete}
                    />
                  </Tooltip>
                </>
              )}
            </HStack>
          </Th>
        );
      }
    }
  };

  return (
    <Tr
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      p={0}
      h={5}
    >
      <Th
        color={
          japaneseDate.includes("（土）")
            ? "blue.300"
            : japaneseDate.includes("（日）")
            ? "red.300"
            : ""
        }
      >
        {japaneseDate}
      </Th>

      {reportMode === "edit" ? (
        <>
          <Th w={28} textAlign={"center"}>
            <Input
              placeholder="Select Date and Time"
              size="sm"
              h={5}
              p={"0"}
              m={0}
              w={"full"}
              textAlign={"center"}
              type="time"
              defaultValue={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
              }}
            />
          </Th>
          <Th w={28} textAlign={"center"}>
            <Input
              placeholder="Select Date and Time"
              size="sm"
              h={5}
              w={"full"}
              type="time"
              textAlign={"center"}
              defaultValue={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
              }}
            />
          </Th>
          <Th w={28} textAlign={"center"}>
            <Input
              placeholder="Select Date and Time"
              size="sm"
              h={5}
              w={"full"}
              type="time"
              textAlign={"center"}
              defaultValue={restTime}
              onChange={(e) => {
                setRestTime(e.target.value);
              }}
            />
          </Th>
          <Th w={28} textAlign={"center"}>
            {opetime ?? "0:00"}
          </Th>

          <ReportTh />
        </>
      ) : (
        <>
          <Th w={28} textAlign={"center"}>
            {startTime}
          </Th>
          <Th w={28} textAlign={"center"}>
            {endTime}
          </Th>
          <Th w={28} textAlign={"center"}>
            {restTime}
          </Th>
          <Th w={28} textAlign={"center"}>
            {opetime ?? "0:00"}
          </Th>
          <ReportTh />
        </>
      )}
    </Tr>
  );
};
