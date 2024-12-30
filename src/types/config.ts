export type Option = {
  name: String;
  sub: String;
  value: any;
};

export type Components = {
  type: String;
  name: String;
  sub: String;
  value: any;
  options?: Array<Option>;
};

export type Section = {
  name: String;
  title: String;
  components: Array<Components>;
};

export type Config = {
  sections: Array<Section>;
};

export type ConfigPath = {
  sectionIndex: Number;
  componentIndex: Number;
};

export const defaultConfig: Config = {
  sections: [
    {
      name: "account",
      title: "Account Settings",
      components: [
        {
          type: "selector",
          name: "Account Settings",
          sub: "Security, Cloud, and Subscription",
          image:
            "https://gravatar.com/avatar/f4fd76a3084fa1ad216c7906d14b0e64?size=256",
          value: "Account",
          options: [
            {
              name: "Account",
              sub: "Security, Cloud, and Subscription",
              value: "Account",
            },
            {
              name: "Account",
              sub: "Security, Cloud, and Subscription",
              value: "Account",
            },
          ],
        },
      ],
    },
    {
      name: "general",
      title: "General Settings",
      components: [
        {
          type: "switch",
          name: "Enable Notifications",
          sub: "Notification settings for your account",
          value: false,
        },
        {
          type: "selector",
          name: "Theme",
          sub: "Dark or light theme",
          value: "dark",
          options: [
            {
              name: "transprant",
              sub: "Security, Cloud, and Subscription",
              value: "transprant",
            },
            {
              name: "dark",
              sub: "Security, Cloud, and Subscription",
              value: "dark",
            },
            {
              name: "light",
              sub: "Security, Cloud, and Subscription",
              value: "light",
            },
            {
              name: "system",
              sub: "Security, Cloud, and Subscription",
              value: "system",
            },
          ],
        },
      ],
    },
    {
      name: "video",
      title: "Video Settings",
      components: [
        {
          type: "input",
          placeholder: "Enter your preferred video quality...",
        },
        {
          type: "switch",
          name: "Enable HD",
          sub: "HD video quality settings",
          value: true,
        },
      ],
    },
    {
      name: "about",
      title: "About",
      components: [
        {
          type: "switch",
          name: "Enable HD",
          sub: "HD video quality settings",
          value: true,
        },
      ],
    },
  ],
};
