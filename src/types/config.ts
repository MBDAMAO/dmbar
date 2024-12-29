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
          value: "Account12",
          options: [
            {
              name: "Account",
              sub: "Security, Cloud, and Subscription",
              value: "Account1",
            },
            {
              name: "Account",
              sub: "Security, Cloud, and Subscription",
              value: "Account12",
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
          type: "selector",
          name: "Theme",
          sub: "Dark or light theme",
          value: "dark",
          options: [
            {
              name: "transprant",
              sub: "transprant background",
              value: "transprant",
            },
            { name: "light", sub: "ligth theme", value: "light" },
            { name: "dark", sub: "dark theme", value: "dark" },
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
          cookie:
            "buvid3=063B581A-C6F5-EE0B-C43F-830C290D5BB209485infoc; b_nut=1714128009; _uuid=261093CFF-7F96-69CC-99AD-C2D1F421B83B06421infoc; enable_web_push=DISABLE; FEED_LIVE_VERSION=V_WATCHLATER_PIP_WINDOW3; buvid4=AACD56BA-1BAC-AF79-AF92-2A6F4D17EA1C35455-022112711-s62au2mc03Xvrbf7mUgygA%3D%3D; rpdid=|(umR|Y|k~Ru0J'u~uRuk)u|l; buvid_fp_plain=undefined; DedeUserID=330838998; DedeUserID__ckMd5=881a8a520eb829f4; header_theme_version=CLOSE; hit-dyn-v2=1; LIVE_BUVID=AUTO1017155301152291; CURRENT_QUALITY=80; fingerprint=4e109b97323e7386f22aedddcb16f57f; PVID=1; is-2022-channel=1; buvid_fp=4e109b97323e7386f22aedddcb16f57f; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzU2MzcyNjgsImlhdCI6MTczNTM3ODAwOCwicGx0IjotMX0.82uQlpOELZVp3S2gzt0CdHy6i_hUk-3UMHQfChzxkYA; bili_ticket_expires=1735637208; SESSDATA=b5d096c5%2C1751001192%2Cfd64d%2Ac2CjBtoPYDkFvkKMasb0Y-a5NxG9Gkc6_X9BKMDZaM3FfD9OQme7qeetCqmzKZLKXLxf8SVmt0V2tKaW9aUS1mcUtGYVhDUXpIaG8tVWdhR2xwRGw5QTJyQzdEdmlyMEdPbUtHR2RPelZHQnRGRnF4ejZsOVFRa3lWZ2sycE5zWFBpUFZQWXhmQzJRIIEC; bili_jct=9c42a0041d45631ed0b8eff4ad0657c7; CURRENT_FNVAL=4048; b_lsid=B4FEA442_19413132D44; home_feed_column=4; browser_resolution=927-898; bp_t_offset_330838998=1016397220255105024",
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
