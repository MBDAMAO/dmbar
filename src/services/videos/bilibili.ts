import { HomeRcmdResp, Video } from "@/types/videos/video";
import { fetchHomepageRecommendations, search } from "@/apis/bilibili";
export const getHomeRecommend = async (): Promise<HomeRcmdResp> => {
  const response = (await fetchHomepageRecommendations()).body.data.item;
  const updatedResponse = response.map((video: any) => ({
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
  keyword: string,
  page: number
): Promise<SearchResult> => {
  const resp: any = await search(
    "video",
    keyword,
    "totalrank",
    "0",
    "0",
    page.toString()
  );
  const data = resp.body.data;
  const result: any = data.result;
  const pageSize = data.pageSize;
  const numPages = data.numPages;
  const numResults = data.numResults;
  const mappedVideoList = result.map((video) => ({
    ...video,
    owner: video.author,
    play: formattedPlays(video.play),
    duration: video.duration,
    url: video.bvid,
    pubDate: formattedDateTime(video.pubdate),
    cover: "https:" + video.pic + "@672w_378h_1c_!web-home-common-cover.avif",
  }));
  return {
    totalPages: numPages,
    totalItems: numResults,
    page: data.page,
    pageSize: pageSize,
    result: mappedVideoList,
  };
};

const formattedPlays = (plays: number): string => {
  if (typeof plays !== "number" || isNaN(plays)) return "NaN";
  if (plays >= 10000) return (plays / 10000).toFixed(2) + "万";
  return plays.toString();
};

const formattedDuration = (duration: number): string => {
  if (typeof duration !== "number" || isNaN(duration)) return "NaN";
  const totalSeconds = Math.floor(duration);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

const formattedDateTime = (pubTime: number): string => {
  const pubTimestamp =
    typeof pubTime === "number" && !isNaN(pubTime) ? pubTime : 0;
  if (pubTimestamp === 0) return "NaN";
  const now = new Date();
  const pubDate = new Date(pubTimestamp * 1000);
  const diff = now.getTime() - pubDate.getTime();
  if (diff < 24 * 60 * 60 * 1000) {
    return Math.floor(diff / (60 * 60 * 1000)) + "小时前";
  } else {
    return pubDate.toLocaleDateString();
  }
};
