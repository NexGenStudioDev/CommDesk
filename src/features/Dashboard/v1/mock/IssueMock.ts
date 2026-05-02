export type Issue = {
  id: number;
  title: string;
  status: "open" | "resolved";
};

export const mockIssues: Issue[] = [
  {
    id: 1,
    title: "Login API not working",
    status: "open",
  },
  {
    id: 2,
    title: "UI bug in dashboard",
    status: "resolved",
  },
  {
    id: 3,
    title: "Unable to submit form",
    status: "open",
  },
];