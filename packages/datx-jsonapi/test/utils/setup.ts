import { Collection } from 'datx';

import { jsonapi } from '../../src';
import { Event } from './models/Event';
import { Image } from './models/Image';
import { LineItem } from './models/LineItem';
import { Organizer } from './models/Organizer';
import { Photo } from './models/Photo';
import { ProductVariant } from './models/ProductVariant';
import { User } from './models/User';

export {
  Event,
  Image,
  Organizer,
  Photo,
  User,
  ProductVariant,
  LineItem,
};

export class TestStoreCollection extends Collection {
  public static types = [
    User,
    Event,
    Image,
    Organizer,
    Photo,
    ProductVariant,
    LineItem,
  ];
}

export const TestStore = jsonapi(TestStoreCollection);
