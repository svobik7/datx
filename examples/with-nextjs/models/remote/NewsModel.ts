import { prop } from 'datx';
import {
  IRelatedRemoteModel,
  IRemoteModel,
  RemoteModel
} from 'models/RemoteModel';

// remote based model with observable properties
class NewsModel extends RemoteModel {
  // remote resource type name
  static type = 'news';
  // remote resource endpoint
  static endpoint = 'news.json';

  // observable properties
  @prop position: number;

  // polymorphic relation
  related: IRemoteModel<IRelatedRemoteModel>;

  // observable relations
  // @prop.toOne(NewsLanguageModel) language: NewsLanguageModel;

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
