import { ProxyTag as ApiProxyTag } from 'pkapi.js/dist/esm/structures/member';

export interface IProxyTag {
  prefix: string | null;
  suffix: string | null;
}

export class ProxyTag implements IProxyTag {
  constructor(
    public prefix: string | null,
    public suffix: string | null,
  ) {}

  static fromPKApi(apiTag: ApiProxyTag): ProxyTag {
    return new ProxyTag(apiTag.prefix || null, apiTag.suffix || null);
  }
}
