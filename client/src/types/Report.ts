export type Report = {
  id?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  restTime?: number;
  report?: string;
  reportType?:
    | "CHAT_GPT_WAITING"
    | "CHAT_GPT_RUNNING"
    | "CHAT_GPT_COMPLETE"
    | "CUSTOM";
};
