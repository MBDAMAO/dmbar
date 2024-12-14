// import { fetch } from "@tauri-apps/plugin-http";

// 添加 Cookie 作为请求头
// 添加 Cookie 作为请求头
function appendCookieToHeaders(cookie: string) {
  return {
    "Content-Type": "application/json",
    "Cookie": `SESSDATA=${cookie}`,
  };
}

export async function fetchRelatedVideos(
  aid: number | null,
  bvid: string | null,
  sessdata: string
) {
  const url = new URL(
    "https://api.bilibili.com/x/web-interface/archive/related"
  );

  // Prepare query parameters
  if (aid) url.searchParams.append("aid", aid.toString());
  if (bvid) url.searchParams.append("bvid", bvid);

  try {
    // Send GET request with query parameters and Cookie in the headers
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: appendCookieToHeaders(sessdata), // 将 Cookie 添加到请求头
    });

    // Parse JSON response
    const data = await response.json();
    console.log("Related Videos:", data);
    return data;
  } catch (error) {
    console.error("Error fetching related videos:", error);
  }
}

export async function fetchHomepageRecommendations(sessdata: string) {
  const url = new URL(
    "https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd"
  );

  const params = {
    fresh_type: "4", // Relatedness (default)
    ps: "12", // Max 12 videos per page
    fresh_idx: "5", // Current page
    fresh_idx_1h: "5", // Similar to fresh_idx
    fetch_row: "16", // Rows to fetch
  };

  // Append query parameters to the URL
  Object.keys(params).forEach((key: any) =>
    url.searchParams.append(key, params[key])
  );

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: appendCookieToHeaders(sessdata), // 将 Cookie 添加到请求头
    });
    const data = await response.json();
    console.log("Homepage Recommendations:", data);
    return data;
  } catch (error) {
    console.error("Error fetching homepage recommendations:", error);
  }
}

export async function fetchShortVideoModeList(sessdata: string) {
  const url = new URL("https://app.bilibili.com/x/v2/feed/index");

  const params = {
    fnval: "272", // Video stream format
    fnver: "1", // Video stream version
    fourk: "0", // Max quality 1080p
    inline_danmu: "2", // Display Danmu
    inline_sound: "1", // Enable sound
    qn: "32", // Quality level (32: 1080p)
    s_locale: "zh_CN", // Language
  };

  // Append query parameters to the URL
  Object.keys(params).forEach((key: any) =>
    url.searchParams.append(key, params[key])
  );

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: appendCookieToHeaders(sessdata), // 将 Cookie 添加到请求头
    });

    const data = await response.json();
    console.log("Short Video Mode List:", data);
    return data;
  } catch (error) {
    console.error("Error fetching short video mode list:", error);
  }
}

export async function getVideoDetails(
  bvid: string,
  sessdata: string,
  aid?: string
) {
  const url = "https://api.bilibili.com/x/web-interface/view";
  const params = new URLSearchParams();
  console.log("wtf")
  if (bvid) {
    params.append("bvid", bvid);
  } else if (aid) {
    params.append("aid", aid);
  } else {
    throw new Error("必须提供 bvid 或 aid");
  }

  try {
    const response = await fetch(`${url}?${params.toString()}`, {
      method: "GET",
      headers: appendCookieToHeaders(sessdata), // 将 Cookie 添加到请求头
    });

    if (!response.ok) {
      throw new Error(`HTTP 错误：${response.status}`);
    }

    // 解析 JSON 响应
    const data = await response.json();

    if (data.code !== 0) {
      throw new Error(`API 错误：${data.message}`);
    }

    return data.data; // 返回视频详细信息
  } catch (error) {
    console.error("获取视频详细信息失败：", error);
  }
}
