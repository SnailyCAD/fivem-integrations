import { IconTypes } from "../types/IconTypes";
import { TextureTypes } from "../types/TextureTypes";

interface NotificationOptions {
  picture: TextureTypes;
  message: string;
  title: string;
  icon?: IconTypes;
  subject?: string;
}

export function createNotification(options: NotificationOptions) {
  SetNotificationTextEntry("STRING");
  AddTextComponentString(options.message);
  SetNotificationMessage(
    options.picture,
    options.picture,
    true,
    options.icon ?? IconTypes.None,
    options.title,
    options.subject ?? "",
  );
}
