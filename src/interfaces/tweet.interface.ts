import { TweetAudience, TweetType } from "~/constants/enums.js";
import { Media } from "./media.interface.js";

export interface TweetRequestBody {
  type: TweetType;
  audience: TweetAudience;
  content: string;
  parent_id: null | string;
  hashtags: string[];
  mentions: string[];
  medias: Media[];
}
