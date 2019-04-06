import { prop } from 'datx';
import { RemoteModel } from 'models/RemoteModel';

// remote based model with observable properties
class ArticleLanguageModel extends RemoteModel {
  // remote resource type name
  static type = 'articles_langs';
  // remote resource endpoint
  static endpoint = 'articles/langs';
  // observable properties
  @prop title: string;
  @prop perex: string;
  @prop content: string;
}
// exports
export { ArticleLanguageModel };
