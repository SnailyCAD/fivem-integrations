const notifications: HTMLDivElement[] = [];

interface CreateNotificationOptions {
  title: string;
  message: string;
  type?: "success" | "error";
  timeout?: number;
}

const notificationPortal = document.getElementById("notification-portal");
const NOTIFICATION_TIMEOUT_IN_MS = 10_000; // after 10 seconds

export function createNotification(options: CreateNotificationOptions) {
  if (!notificationPortal) {
    throw new Error("Notification portal not found");
  }

  const formattedDate = formatDate(new Date());

  const template = `
  <div class="animate-enter dark:bg-quinary pointer-events-auto flex min-w-[28rem] max-w-md w-full rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
  <div class="flex w-0 flex-1 items-start p-4">
    <div class="-mt-1 ml-3 flex-1">
      <div class="flex items-center justify-between text-sm font-medium text-neutral-300">
        <p>${formattedDate}</p>
        <p>SnailyCAD</p>
      </div>
      <p class="mb-1 mt-2 text-[1.05em] font-semibold capitalize text-gray-900 dark:text-gray-100">${options.title}</p>
      <div class="text-neutral-500 dark:text-gray-300">${options.message}</div>
    </div>
  </div>
</div>
`;

  const element = document.createElement("div");
  element.innerHTML = template;

  notificationPortal.appendChild(element);

  notifications.push(element);

  const timeout = options.timeout ?? NOTIFICATION_TIMEOUT_IN_MS;

  setTimeout(() => {
    element.remove();
    notifications.splice(notifications.indexOf(element), 1);
  }, timeout);
}

function formatDate(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
}
