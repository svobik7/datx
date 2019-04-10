import { Length } from 'class-validator';
import { prop } from 'datx';
import { RemoteModel } from 'models/RemoteModel';

// remote based model with observable properties
class CommentModel extends RemoteModel {
  // remote resource type name
  static type = 'comments';
  // remote resource endpoint
  static endpoint = 'comments';

  @Length(1, 50)
  @prop
  content: string;
}
// exports
export { CommentModel };
