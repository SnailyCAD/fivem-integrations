import { IconTypes } from "../types/IconTypes";
import { TextureTypes } from "../types/TextureTypes";

interface NotificationOptions {
  picture: TextureTypes;
  icon: IconTypes;
  message: string;
  title: string;
  subject?: string;
}

export function createNotification(options: NotificationOptions) {
  SetNotificationTextEntry("STRING");
  AddTextComponentString(options.message);
  SetNotificationMessage(
    options.picture,
    options.picture,
    true,
    options.icon,
    options.title,
    options.subject ?? "",
  );
}
