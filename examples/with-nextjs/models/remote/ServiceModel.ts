import { prop } from 'datx';
import { RemoteModel } from 'models/RemoteModel';

import { ServiceLanguageModel } from './ServiceLanguageModel';

// remote based model with observable properties
class ServiceModel extends RemoteModel {
  // remote resource type name
  static type = 'services';
  // remote resource endpoint
  static endpoint = 'services.json';

  // observable properties
  @prop link: string;
  @prop published_at: number;

  // observable relations
  @prop.toOne(ServiceLanguageModel) language: ServiceLanguageModel;

  // gets 'title' language relational property
  get title(): string {
    return this.language.title;
  }

  // gets 'perex' language relational property
  get perex(): string {
    return this.language.perex;
  }

  // gets 'content' language relational property
  get content(): string {
    return '';
  }

  // sets 'title' language relational property
  set title(title: string) {
    this.language && (this.language.title = title);
  }

  // sets 'perex' language relational property
  set perex(perex: string) {
    this.language && (this.language.perex = perex);
  }
}
// exports
export { ServiceModel };
