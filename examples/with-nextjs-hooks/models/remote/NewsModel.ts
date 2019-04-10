import { prop } from 'datx';
import { IRemoteModel, RemoteModel } from 'models/RemoteModel';

/**
 * Remote model definition
 * - defines remote endpoint
 * - defines remote attributes
 * - defines model observables & behavior
 */
class NewsModel extends RemoteModel {
  // remote resource type name
  static type = 'news';
  // remote resource endpoint
  static endpoint = 'news';

  // observable properties
  @prop position: number;

  // polymorphic relation
  related: IRemoteModel<{
    title: string;
    perex: string;
    content: string;
  }>;

  // gets 'title' language relational property
  get title(): string {
    return this.related.title;
  }

  // gets 'perex' language relational property
  get perex(): string {
    return this.related.perex;
  }

  // gets 'content' language relational property
  get content(): string {
    return this.related.content;
  }

  // sets 'title' language relational property
  set title(title: string) {
    this.related && (this.related.title = title);
  }

  // sets 'perex' language relational property
  set perex(perex: string) {
    this.related && (this.related.perex = perex);
  }

  // sets 'content' language relational property
  set content(content: string) {
    this.related && (this.related.content = content);
  }
}
// exports
export { NewsModel };
