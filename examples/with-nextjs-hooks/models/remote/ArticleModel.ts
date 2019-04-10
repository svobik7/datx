import { prop } from 'datx';
import { RemoteModel } from 'models/RemoteModel';

import { ArticleLanguageModel } from './ArticleLanguageModel';

// remote based model with observable properties
class ArticleModel extends RemoteModel {
  // remote resource type name
  static type = 'articles';
  // remote resource endpoint
  static endpoint = 'articles.json';

  // observable properties
  @prop duration: number;
  @prop published_at: number;

  // observable relations
  @prop.toOne(ArticleLanguageModel) language: ArticleLanguageModel;

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
    return this.language.content;
  }

  // sets 'title' language relational property
  set title(title: string) {
    this.language && (this.language.title = title);
  }

  // sets 'perex' language relational property
  set perex(perex: string) {
    this.language && (this.language.perex = perex);
  }

  // sets 'content' language relational property
  set content(content: string) {
    this.language && (this.language.content = content);
  }
}
// exports
export { ArticleModel };
