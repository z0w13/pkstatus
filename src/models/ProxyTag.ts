import { z } from 'zod';
import ApiProxyTag from 'pkapi-ts/models/ProxyTag';

export const IProxyTag = z.object({
  prefix: z.string().nullable(),
  suffix: z.string().nullable(),
});
export type IProxyTag = z.infer<typeof IProxyTag>;

export class ProxyTag implements IProxyTag {
  constructor(
    public prefix: string | null,
    public suffix: string | null,
  ) {}

  static fromPKApi(apiTag: ApiProxyTag): ProxyTag {
    return new ProxyTag(apiTag.prefix, apiTag.suffix);
  }
}
