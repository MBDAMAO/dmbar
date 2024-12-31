import { useConfig } from "../stores/config.ts";
import { useHttp } from "../utils/http";

export async function fetchRelatedVideos() {}

function requestGetTemplate(url: string) {
  let cookie = useConfig().useBilibiliCookie();
  return useHttp({
    url: url,
    method: "GET",
    headers: {
      Cookie: cookie,
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    },
  });
}
export async function fetchHomepageRecommendations() {
  return await requestGetTemplate(
    "https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd?ps=12&fresh_idx=1&fresh_type=4"
  );
}

export async function fetchShortVideoModeList() {}

export async function getVideoDetails(bvid: string) {
  return await requestGetTemplate(
    `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`
  );
}

export async function getVideoUrl(bvid: string, cid: number, qn: number) {
  return await requestGetTemplate(
    `https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${cid}&qn=${qn}&fnval=1&fnver=0&fourk=1&platform=html5&high_quality=1`
  );
}

export async function getLiveRoomInfo(room: string) {
  return await requestGetTemplate(
    `https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${room}`
  );
}

export async function search(
  search_type: string,
  keyword: string,
  order: string,
  duration: string,
  tids: string,
  page: string
) {
  let url = `https://api.bilibili.com/x/web-interface/wbi/search/type?`;
  url += `search_type=${search_type}&keyword=${keyword}&order=${order}&duration=${duration}&tids=${tids}&page=${page}`;
  return await requestGetTemplate(url);
}
import bilibili from "./live.ts";

export async function getLiveUrl(roomId: string) {
  let cookie = useConfig().useBilibiliCookie();
  let parser = bilibili("https://live.bilibili.com/" + roomId, cookie);
  let result: ParsedResult | Error | null;
  try {
    result = await parser.parse();
  } catch (e) {
    result = Error("Error");
  }
  if (result instanceof Error || result === null) {
    return Error("Error");
  } else if (result) {
    console.log(result.links);
  }
  return result.links;
}

export async function defaultSearchContent() {
  return await requestGetTemplate(
    "https://api.bilibili.com/x/web-interface/search/default"
  );
}

export async function hotSearchWords() {
  return await requestGetTemplate(
    "https://app.bilibili.com/x/v2/search/trending/ranking"
  );
}
