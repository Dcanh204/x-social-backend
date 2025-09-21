import { catchAsync } from "~/utils/catchAsync.js";
import { Request, Response } from "express";
import * as searchService from "~/services/search.service.js";
export const searchController = catchAsync(async (req: Request, res: Response) => {
  const limit = Number(req.query.limit);
  const page = Number(req.query.page);
  const content = req.query.content as string;
  const result = await searchService.search(content, limit, page);
  res.json(result);
});
