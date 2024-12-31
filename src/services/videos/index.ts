export type Video = {
  title: string;
  url: string;
  cover: string;
  owner: string;
  pubDate: string;
  play: number;
  duration: string;
  platform: string;
};
type HomeRcmdResp = {
  result: Array<Video>;
};
import { fetchHomepageRecommendations, search } from "../../apis/bilibili";
export const getHomeRecommend = async (): Promise<HomeRcmdResp> => {
  const response = (await fetchHomepageRecommendations()).body.data.item;
  const updatedResponse = response.map((video) => ({
    ...video,
    owner: video.owner.name,
    play: formattedPlays(video.stat.view),
    pubDate: formattedDateTime(video.pubdate),
    url: video.bvid,
    cover:
      video.pic.replace(/^http:/, "https:") +
      "@672w_378h_1c_!web-home-common-cover.avif",
    duration: formattedDuration(video.duration),
  }));
  return { result: updatedResponse };
};

type SearchResult = {
  totalPages: number;
  totalItems: number;
  page: number;
  pageSize: number;
  result: Array<Video>;
};
export const getSearchResult = async (
  keyword: string
): Promise<SearchResult> => {
  const resp: any = await search("video", keyword, "totalrank", "0", "0", "1");
  const data = resp.body.data;
  const result: any = data.result;
  const page = data.page;
  const pageSize = data.pageSize;
  const numPages = data.numPages;
  const numResults = data.numResults;
  const mappedVideoList = result.map((video) => ({
    ...video,
    owner: {
      name: video.author,
    },
    stat: {
      view: video.play,
    },
    play: formattedPlays(video.play),
    duration: video.duration,
    cover: "https:" + video.pic + "@672w_378h_1c_!web-home-common-cover.avif",
  }));
  return {
    totalPages: numPages,
    totalItems: numResults,
    page: page,
    pageSize: pageSize,
    result: mappedVideoList,
  };
};

// 格式化播放量
const formattedPlays = (plays: number) => {
  if (typeof plays !== "number" || isNaN(plays)) return "NaN";
  if (plays >= 10000) {
    return (plays / 10000).toFixed(2) + "万";
  }
  return plays.toString();
}

// 格式化持续时间
const formattedDuration = (duration: number) => {
  if (typeof duration !== "number" || isNaN(duration)) return "NaN";
  const totalSeconds = duration;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

const formattedDateTime = (pubTime: number) => {
  // 确保 pubTime 是数字类型
  const pubTimestamp =
    typeof pubTime === "number" && !isNaN(pubTime) ? pubTime : 0;
  if (pubTimestamp === 0) return "NaN";

  const now = new Date();
  const pubDate = new Date(pubTimestamp * 1000); // 转换 pubTime 为 Date 对象
  const diff = now.getTime() - pubDate.getTime(); // 使用 getTime() 获取时间戳

  if (diff < 24 * 60 * 60 * 1000) {
    // 小于 24 小时
    return Math.floor(diff / (60 * 60 * 1000)) + "小时前";
  } else {
    return pubDate.toLocaleDateString();
  }
}
