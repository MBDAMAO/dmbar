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
            { name: "dark", sub: "dark theme", value: "dark" },
            { name: "light", sub: "light theme", value: "light" },
            {
              name: "system",
              sub: "follow your system theme",
              value: "system",
            },
            {
              name: "transprant",
              sub: "transprant theme (full on windows)",
              value: "transprant",
            },
          ],
        },
        {
          type: "selector",
          name: "Language",
          sub: "Select your preferred language",
          value: "zh-cn",
          options: [
            { name: "English", sub: "", value: "en-us" },
            { name: "简体中文", sub: "", value: "zh-cn" },
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
          name: "Douyin Coolkie",
          sub: "douyin",
          value: "",
        },
        {
          type: "input",
          name: "Bilibili Coolkie",
          sub: "bilibili",
          value: "",
        },
      ],
    },
  ],
};
