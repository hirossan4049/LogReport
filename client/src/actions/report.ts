import axios from "axios";
import { ApiStatusCode } from "../types/ApiStatusCode";
import { Report } from "../types/Report";

type ReportResponse = {
  code: ApiStatusCode;
  msg: string;
  data: Report[];
};

type AutoCompleteResponse = {
  code: ApiStatusCode;
  msg: string;
  data?: Report;
};

type PutReportResponse = {
  code: ApiStatusCode;
  msg: string;
  data?: Report;
};

export const fetchReports = async (year: string, month: string) => {
  try {
    const res = await axios.get<ReportResponse>(
      `/report?year=${year}&month=${month}`
    );
    return res.data;
  } catch (e) {
    return { code: 99, msg: "Internal Server Error", data: [] };
  }
};

export const fetchAutocomplete = async (reportId: string) => {
  try {
    const res = await axios.post<AutoCompleteResponse>(`/report/autocomplete`, {
      reportId: reportId,
    });
    return res.data;
  } catch (e) {
    return { code: 99, msg: "Internal Server Error", data: null };
  }
};

export const putReport = async (
  date: string,
  startTime: string,
  endTime: string,
  restTime: number,
  report: string
) => {
  try {
    const res = await axios.put<PutReportResponse>("/report", {
      date: date,
      startTime: startTime,
      endTime: endTime,
      restTime: restTime,
      report: report,
    });
    return res.data;
  } catch (e) {
    return { code: 99, msg: "Internal Server Error", data: null };
  }
};

export const login = async (email: string, password: string) => {
  try {
    const res = await axios.post<ReportResponse>("/user/login", {
      email: email,
      password: password,
    });
    return res.data;
  } catch (e) {
    return { code: 99, msg: "Internal Server Error", token: null };
  }
};
