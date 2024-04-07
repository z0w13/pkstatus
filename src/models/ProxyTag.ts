import { z } from 'zod';
import { ProxyTag as ApiProxyTag } from 'pkapi.js/dist/esm/structures/member';

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
    return new ProxyTag(apiTag.prefix || null, apiTag.suffix || null);
  }
}
