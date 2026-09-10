import { z } from "zod";
import { FRAMEWORKS } from "../../common";

export const FrameworkSchema = z.object({
  framework: z.enum(FRAMEWORKS).describe("如果用户没有指定，根据 package.json 中的依赖判断")
});

export const ComponentsSchema = FrameworkSchema.extend({
  names: z.array(z.string()).describe("可用的组件名称，支持批量查询")
});

export const ChangelogsSchema = ComponentsSchema.extend({
  framework: z.enum(FRAMEWORKS).describe("如果用户没有指定，根据 package.json 中的依赖判断；"),
  version: z
    .string()
    .optional()
    .describe("返回大于等于该版本号的日志，如果用户没有指定，根据 package.json 中的依赖判断")
});

export const IconSchema = z.object({
  keywords: z
    .array(z.string())
    .min(1)
    .describe("用于匹配图标名的关键词列表（仅支持英文）"),
  limit: z
    .number()
    .int()
    .positive()
    .optional()
    .default(20)
    .describe("返回结果数量上限，避免返回数据过多")
});
