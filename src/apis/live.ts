
export const NOT_LIVE = Error("当前直播间未开播");
type Platform = "douyu" | "huya" | "bilibili" | "douyin";

interface ParsedResult {
    platform: Platform;
    title: string;
    anchor: string;
    roomID: number;
    category: string;
    links: string[];
}

interface HistoryItem extends Omit<ParsedResult, "links" | "title" | "roomID"> {
    id: number;
    last_play_time: Date;
    last_title: string;
    room_id: number;
}

abstract class LiveStreamParser {
    protected roomID: number;
    protected baseURL: string;

    constructor(roomID: number, baseURL: string) {
        this.roomID = roomID;
        this.baseURL = baseURL;
    }

    abstract parse(): Promise<ParsedResult | typeof NOT_LIVE | Error>;

    protected get roomURL(): string {
        return this.baseURL + this.roomID.toString();
    }
}

import { invoke } from "@tauri-apps/api/core";

class BilibiliParser extends LiveStreamParser {
    cookie: string;
    url: string;
    constructor(cookie: string, roomID = 0, url = "") {
        super(roomID, "");
        this.cookie = cookie;
        this.url = url;
    }

    async parse(): Promise<ParsedResult | Error> {
        try {
            const result = await invoke<ParsedResult>("parse_bilibili", {
                roomId: this.roomID,
                cookie: this.cookie,
                url: this.url || null,
            });
            return result;
        } catch (e) {
            return Error(String(e));
        }
    }
}

export default function createBilibiliParser(
    input: string | number,
    cookie: string,
) {
    let roomID: number | undefined = undefined;
    let url: string | undefined = undefined;

    if (typeof input === "number") roomID = input;
    else url = input;

    return new BilibiliParser(cookie, roomID, url);
}
