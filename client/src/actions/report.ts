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
  data: string;
}

export const fetchReports = async (year: string, month: string) => {
  try {
    const res = await axios.get<ReportResponse>(
      `http://localhost:3000/report?year=${year}&month=${month}`
    );
    return res.data;
  } catch (e) {
    return { code: 99, msg: "Internal Server Error", data: [] };
  }
};

export const fetchAutocomplete = async (reportId: string) => {
  try {
    const res = await axios.post<AutoCompleteResponse>(
      `http://localhost:3000/report/autocomplete`,
      {
        reportId: reportId,
      }
    );
    return res.data
  } catch (e) {

  }
}

export const login = async (email: string, password: string) => {
  try {
    const res = await axios.post<ReportResponse>(
      "http://localhost:3000/user/login",
      {
        email: email,
        password: password,
      }
    );
    return res.data;
  } catch (e) {
    return { code: 99, msg: "Internal Server Error", token: null };
  }
};

