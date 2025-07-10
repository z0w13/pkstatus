import PluralKit from 'src/lib/PluralKit/PluralKit';
import ApiClient from 'src/lib/PluralKit/ApiClient';

class ServiceStore {
  private static instance: ServiceStore;
  public pluralKit: PluralKit;

  private constructor(token?: string) {
    this.pluralKit = new PluralKit(new ApiClient({ token }));
  }

  public static getInstance(token?: string): ServiceStore {
    if (!ServiceStore.instance) {
      ServiceStore.instance = new ServiceStore(token);
    }

    return ServiceStore.instance;
  }
}

export function useServices(token?: string): ServiceStore {
  return ServiceStore.getInstance(token);
}
