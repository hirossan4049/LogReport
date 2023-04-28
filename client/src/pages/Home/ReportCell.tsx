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
  Spacer,
} from "@chakra-ui/react";
import { useMemo, useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { TbBrandOpenai } from "react-icons/tb";
import { Report } from "../../types/Report";
import { fetchAutocomplete, putReport } from "../../actions/report";
import { ApiStatusCode } from "../../types/ApiStatusCode";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { calcOpetime, date2Time, min2Time } from "../../helpers/DateHelpers";

type CellProps = {
  item: Report;
  updateReport: (report: Report) => void;
};

export const Cell = (props: CellProps) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(["token"]);

  const weeks = ["日", "月", "火", "水", "木", "金", "土"];
  const japaneseDate = useMemo(() => {
    const date = new Date(props.item.date);
    const day = date.getDay();
    const week = weeks[day];
    return `${date.getDate()}日(${week})`;
  }, [props.item.date]);
  const [report, setReport] = useState(props.item.report);
  const [reportMode, setReportMode] = useState<"edit" | "normal">("normal");
  const [reportType, setReportType] = useState(props.item.reportType);
  const [id, setId] = useState(props.item.id);
  const [hover, setHover] = useState(false);

  const [startTime, setStartTime] = useState(date2Time(props.item.startTime!));
  const [endTime, setEndTime] = useState(date2Time(props.item.endTime!));
  const [restTime, setRestTime] = useState(min2Time(props.item.restTime ?? 0));

  const [opetime, setOpetime] = useState("00:00");
  const [isNoValue, setIsNoValue] = useState(true);

  useEffect(() => {
    setReport(props.item.report);
    setReportType(props.item.reportType);
  }, [props.item]);

  useEffect(() => {
    setIsNoValue(opetime === "00:00");
  }, [opetime]);

  useEffect(() => {
    const calcOpe = calcOpetime(
      props.item.date,
      startTime,
      endTime,
      restTime,
      "time"
    );
    setOpetime(calcOpe.toString());
  }, [startTime, endTime, restTime]);

  const handleCancel = () => {
    setReportMode("normal");
    setReport(props.item.report);
    setStartTime(date2Time(props.item.startTime!));
    setEndTime(date2Time(props.item.endTime!));
    setRestTime(min2Time(props.item.restTime ?? 0));
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
      handleCancel();
    }
  };

  const handlePutReport = async () => {
    console.log(props.item.date);
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

    const res = await putReport(dateIso, sdate, edate, rdate, report || "");
    if (res.data) {
      setId(res.data.id);
      setReportType(res.data.reportType);
      props.updateReport(res.data);
    }
    return res.data;
  };

  const handleAutocomplete = async () => {
    let currentId: string | undefined = id;
    if (!id) {
      const res = await handlePutReport();
      if (!res?.id) {
        alert("error autocomplete");
        return;
      } else {
        currentId = res.id;
      }
    }

    if (!currentId) {
      alert("error autocomplete");
      return;
    }

    const currentReportType = reportType;
    setReportType("CHAT_GPT_RUNNING");

    const report = await fetchAutocomplete(currentId);
    switch (report.code) {
      case ApiStatusCode.Success:
        toast({
          title: "推測完了",
          status: "success",
        });
        break;
      case ApiStatusCode.TokenExpired:
        toast({
          title: "トークン期限が切れています。",
          status: "error",
        });
        removeCookie("token");
        navigate("/login");
        break;
      case ApiStatusCode.WatchRepositoryNotFound:
        toast({
          title: "リポジトリが見つかりませんでした",
          description: "設定から有効なリポジトリを設定してください",
          status: "error",
        });
        setReportType(currentReportType);
        break;
      case ApiStatusCode.GithubUsernameNotFound:
        toast({
          title: "GitHubのユーザー名が見つかりませんでした",
          description: "設定から有効なユーザー名を設定してください",
          status: "error",
        });
        setReportType(currentReportType);
        break;
      default:
        break;
    }

    if (!report.data) {
      return;
    }
    // report.data.date = date;
    setReport(report.data.report);
    setReportType(report.data.reportType);
    props.updateReport(report.data);
  };

  const ReportTh = useMemo(() => {
    if (reportType === "CHAT_GPT_RUNNING") {
      return (
        <Th p={"10px"} pl={"32px"}>
          <Spinner h={5} w={5} />
        </Th>
      );
    } else {
      if (reportMode === "edit") {
        return (
          <Th px={2} py={1}>
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
                bg={""}
              />
              <IconButton
                size={"sm"}
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
          <Th px={2} py={1.5}>
            <HStack>
              {reportType === "CHAT_GPT_COMPLETE" ? (
                <HStack w={"full"}>
                  <Text>{report}</Text>
                  <Text
                    fontSize={"10px"}
                    bg={"gray.100"}
                    rounded={"full"}
                    px={2}
                    py={0.1}
                  >
                    GPT
                  </Text>
                  <Spacer w={"full"} />
                </HStack>
              ) : (
                <Text w={"full"} h={"20px"}>
                  {report}
                </Text>
              )}
              {hover && (
                <>
                  <IconButton
                    size={"sm"}
                    icon={<FiEdit2 />}
                    aria-label={"edit"}
                    onClick={() => setReportMode("edit")}
                    h={"22px"}
                    w={"22px"}
                  />
                  <Tooltip label={"Githubから推測"}>
                    <IconButton
                      size={"sm"}
                      icon={<TbBrandOpenai />}
                      aria-label={"edit"}
                      h={"22px"}
                      w={"22px"}
                      onClick={handleAutocomplete}
                    />
                  </Tooltip>
                </>
              )}
            </HStack>
          </Th>
        );
      }
    }
  }, [hover, report, reportMode, reportType]);

  return (
    <Tr
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      p={0}
      h={5}
    >
      <Th
        color={
          japaneseDate.includes("(土)")
            ? "blue.300"
            : japaneseDate.includes("(日)")
            ? "red.300"
            : ""
        }
        textAlign={"center"}
        p={0}
      >
        {japaneseDate}
      </Th>

      {reportMode === "edit" ? (
        <>
          <Th w={28} textAlign={"center"} px={2} py={0}>
            <Input
              placeholder="Select Date and Time"
              size="sm"
              fontWeight={"bold"}
              w={"full"}
              textAlign={"center"}
              type="time"
              defaultValue={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
              }}
            />
          </Th>
          <Th w={28} textAlign={"center"} px={2} py={0}>
            <Input
              placeholder="Select Date and Time"
              size="sm"
              fontWeight={"bold"}
              w={"full"}
              type="time"
              textAlign={"center"}
              defaultValue={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
              }}
            />
          </Th>
          <Th w={28} textAlign={"center"} px={2} py={0}>
            <Input
              placeholder="Select Date and Time"
              size="sm"
              fontWeight={"bold"}
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

          {ReportTh}
        </>
      ) : (
        <>
          <Th w={28} textAlign={"center"} color={isNoValue ? "gray.300" : ""}>
            {startTime}
          </Th>
          <Th w={28} textAlign={"center"} color={isNoValue ? "gray.300" : ""}>
            {endTime}
          </Th>
          <Th w={28} textAlign={"center"} color={isNoValue ? "gray.300" : ""}>
            {restTime}
          </Th>
          <Th w={28} textAlign={"center"} color={isNoValue ? "gray.300" : ""}>
            {opetime ?? "0:00"}
          </Th>
          {ReportTh}
        </>
      )}
    </Tr>
  );
};
