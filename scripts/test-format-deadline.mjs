import { formatDeadline } from "../lib/format-deadline.ts";

const samples = [
  "5/29",
  "5/29(목)",
  "5.29",
  "5월 29일",
  "5월29일(목)",
  "29일",
  "29일(목)",
  "(목)",
  "목요일",
  "5/29 3교시",
  "5월29일 오전 10시까지",
  "수업시간",
  "미정",
  "Date(2025,4,29,10,0)",
];

for (const s of samples) {
  console.log(JSON.stringify(s), "→", formatDeadline(s));
}
