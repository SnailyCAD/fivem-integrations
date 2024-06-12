import { IntlProvider } from "next-intl";

const MESSAGES_REQUIRED_IN_COMPONENTS = {
  Common: {
    optionalField: "Optional",
    select: "Select...",
    startTyping: "Start typing...",
    noOptions: "No options",
    searching: "Searching...",
    show: "Show",
    hide: "Hide",
  },
  Statuses: {
    ACCEPTED: "Accepted",
    PASSED: "Passed",
    PAID: "Paid",
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    DECLINED: "Declined",
    DENIED: "Denied",
    UNPAID: "Unpaid",
    FAILED: "Failed",
    CANCELED: "Canceled",
  },
};

interface Props {
  children: React.ReactNode;
}

export function NextIntlWrapper(props: Props) {
  return (
    <IntlProvider messages={MESSAGES_REQUIRED_IN_COMPONENTS} locale="en">
      {props.children}
    </IntlProvider>
  );
}
