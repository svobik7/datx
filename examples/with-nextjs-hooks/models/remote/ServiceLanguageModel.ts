import { prop } from 'datx';
import { RemoteModel } from 'models/RemoteModel';

// remote based model with observable properties
class ServiceLanguageModel extends RemoteModel {
  // remote resource type name
  static type = 'services_langs';
  // remote resource endpoint
  static endpoint = 'services/langs';
  // observable properties
  @prop title: string;
  @prop perex: string;
  @prop content: string;
}
// exports
export { ServiceLanguageModel };
