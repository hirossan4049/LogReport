export function date2Time(date: Date | string): string {
  const startTimeDate = new Date(date);
  return (
    (startTimeDate.getHours() || 0).toString().padStart(2, "0") +
    ":" +
    (startTimeDate.getMinutes() || 0).toString().padStart(2, "0")
  );
}

export function min2Time(min: number): string {
  return `${Math.floor(min / 60)
    .toString()
    .padStart(2, "0")}:${(min % 60).toString().padStart(2, "0")}`;
}

export function calcOpetime(
  _date: Date | string,
  startTime: string,
  endTime: string,
  restTime: string,
  mode: "time" | "min"
) {
  const date = new Date(_date);
  const [startHour, startMinute] = startTime.split(":").map((v) => parseInt(v));
  const [endHour, endMinute] = endTime.split(":").map((v) => parseInt(v));
  const [restHour, restMinute] = restTime.split(":").map((v) => parseInt(v));

  date.setHours(endHour);
  date.setMinutes(endMinute);
  date.setHours(date.getHours() - startHour - restHour);
  date.setMinutes(date.getMinutes() - startMinute - restMinute);

  if (mode == "time") {
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  } else {
    return date.getHours() * 60 + date.getMinutes();
  }
}
