import { useHttp } from "../utils/http";

let cookie =
  "buvid3=063B581A-C6F5-EE0B-C43F-830C290D5BB209485infoc; b_nut=1714128009; _uuid=261093CFF-7F96-69CC-99AD-C2D1F421B83B06421infoc; enable_web_push=DISABLE; FEED_LIVE_VERSION=V_WATCHLATER_PIP_WINDOW3; buvid4=AACD56BA-1BAC-AF79-AF92-2A6F4D17EA1C35455-022112711-s62au2mc03Xvrbf7mUgygA%3D%3D; rpdid=|(umR|Y|k~Ru0J'u~uRuk)u|l; buvid_fp_plain=undefined; DedeUserID=330838998; DedeUserID__ckMd5=881a8a520eb829f4; header_theme_version=CLOSE; hit-dyn-v2=1; LIVE_BUVID=AUTO1017155301152291; CURRENT_QUALITY=80; fingerprint=4e109b97323e7386f22aedddcb16f57f; buvid_fp=4e109b97323e7386f22aedddcb16f57f; bp_t_offset_330838998=1014818102514286592; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzUzNzk4MzUsImlhdCI6MTczNTEyMDU3NSwicGx0IjotMX0.ExD191eGUcSse6XDeX5vI853YUqmBAIV0SImtvLj5-w; bili_ticket_expires=1735379775; PVID=1; home_feed_column=5; browser_resolution=1707-898; b_lsid=5F382E4F_1940161E95F; SESSDATA=f1a61326%2C1750741980%2C7807e%2Ac2CjC51_hfA0HeqD5_kmGqKt6jXNt9uSpDvA6DsH6cypm7wSaFA7tWXIS8-c02AqER7pESVlcyb01Nam1sQV9zNEJVSXRKajVkQlEwZkZBN2JZYmtaamhFZVN1WUtXT1Q0MFdZRUVreHU4cngya0czUUtxLXBGbWNEd0dLSndySVhtRTM3eW9NUUlRIIEC; bili_jct=4c2068228e7db67317c67c99e5f3579a; sid=6it9c9iu; CURRENT_FNVAL=4048";
export async function fetchRelatedVideos() {}

export async function fetchHomepageRecommendations() {
  return await useHttp({
    url: "https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd?ps=12&fresh_idx=1&fresh_type=4",
    method: "GET",
    headers: {
      Cookie: cookie,
    },
  });
}

export async function fetchShortVideoModeList() {}

export async function getVideoDetails(bvid: string) {
  let url = `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`;
  return await useHttp({
    url,
    method: "GET",
    headers: {
      Cookie: cookie,
    },
  });
}

export async function getVideoUrl(bvid: string, cid: number, qn: number) {
  let url = `https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${cid}&qn=${qn}&fnval=1&fnver=0&fourk=1&platform=html5&high_quality=1`;
  return await useHttp({
    url,
    method: "GET",
    headers: {
      Cookie: cookie,
    },
  });
}

export async function getLiveRoomInfo(room: string) {
  let url = `https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${room}`;
  return await useHttp({
    url,
    method: "GET",
    headers: {
      Cookie: cookie,
    },
  });
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
  return await useHttp({
    url,
    method: "GET",
    headers: {
      Cookie: cookie,
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    },
  });
}
import bilibili from "./live.ts";

export async function getLiveUrl(roomId: string) {
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
