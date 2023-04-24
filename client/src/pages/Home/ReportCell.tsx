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
} from "@chakra-ui/react";
import { useMemo, useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { TbBrandOpenai } from "react-icons/tb";
import { Report } from "../../types/Report";

type CellProps = {
  item: Report;
  handleAutocomplete: () => void;
};

export const Cell = (props: CellProps) => {
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

  const startTime = useMemo(() => {
    const startTimeDate = new Date(props.item.startTime!);
    return (
      (startTimeDate.getHours() || 0).toString().padStart(2, "0") +
      ":" +
      (startTimeDate.getMinutes() || 0).toString().padStart(2, "0")
    );
  }, [props.item.startTime]);

  const endTime = useMemo(() => {
    const endTimeDate = new Date(props.item.endTime!);
    return (
      (endTimeDate.getHours() || 0).toString().padStart(2, "0") +
      ":" +
      (endTimeDate.getMinutes() || 0).toString().padStart(2, "0")
    );
  }, [props.item.endTime]);

  const restTime = useMemo(() => {
    const restTimeDate = new Date(props.item.restTime!);
    return (
      (restTimeDate.getHours() || 0).toString().padStart(2, "0") +
      ":" +
      (restTimeDate.getMinutes() || 0).toString().padStart(2, "0")
    );
  }, [props.item.endTime]);

  useEffect(() => {
    setReport(props.item.report);
  }, [props.item.report]);

  const handleCancel = () => {
    setReportMode("normal");
    setReport(props.item.report);
  };

  const handleOk = () => {
    setReportMode("normal");
  };

  // TODO
  const opeseconds =
    new Date(`1990-01-01 ${props.item.endTime}`).getTime() -
    new Date(`1990-01-01 ${props.item.startTime}`).getTime();
  // new Date(`${props.restTime}`).getTime();
  let opetime = "0:00";
  if (opeseconds) {
    opetime =
      Math.floor(opeseconds / 1000 / 60 / 60) +
      ":" +
      Math.floor((opeseconds / 1000 / 60) % 60);
  }

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
              onBlur={(e) => {
                console.log(e.target.value);
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
              onBlur={(e) => {
                console.log(e.target.value.split(":"));
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
              onBlur={(e) => {
                console.log(e.target.value.split(":"));
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
