// tslint:disable:max-classes-per-file

import {
  Collection,
  getModelCollections,
  getModelId,
  Model,
  prop,
} from '../src/index';

describe('Collection', () => {
  describe('Basic features', () => {
    it('should initialize', () => {
      const collection = new Collection();
      expect(collection.length).toBe(0);
    });

    it('Should work with models', () => {
      class Foo extends Model {
        public static type = 'foo';

        @prop public foo: number;
        @prop public bar: number;
        @prop public baz: number;
      }

      class Baz extends Model {
        public static type = 'baz';
      }

      class FooBar {}

      class Store extends Collection {
        public static types = [Foo];
      }

      const store = new Store();
      const foo1 = store.add({foo: 1}, Foo);
      const foo2 = store.add<Foo>({foo: 2}, 'foo');
      const foo3 = store.add(new Foo({foo: 3}));
      const foo4 = new Foo({foo: 4});

      expect(store.length).toBe(3);
      expect(foo1.foo).toBe(1);
      expect(foo2.foo).toBe(2);
      expect(foo3.foo).toBe(3);

      // @ts-ignore - TS won't allow this mistake
      expect(() => store.add({foo: 4}))
        .toThrowError('The type needs to be defined if the object is not an instance of the model.');

      expect(() => store.add({foo: 4}, 'bar'))
        .toThrowError('No model is defined for the type bar.');

      expect(() => store.add({foo: 4}, Baz))
        .toThrowError('No model is defined for the type baz.');

      // @ts-ignore - TS won't allow this mistake
      expect(() => store.add({foo: 4}, FooBar))
        .toThrowError('No model is defined for the type undefined.');

      // @ts-ignore - TS won't allow this mistake
      expect(() => store.add([{foo: 4}, {foo: 5}]))
        .toThrowError('The type needs to be defined if the object is not an instance of the model.');

      expect(store.hasItem(foo1)).toBe(true);
      expect(store.hasItem(foo4)).toBe(false);

      expect(getModelCollections(foo1).length).toBe(1);
      store.remove(foo1);
      expect(getModelCollections(foo1).length).toBe(0);

      expect(getModelCollections(foo2).length).toBe(1);
      store.remove(Foo, getModelId(foo2));
      expect(getModelCollections(foo2).length).toBe(0);

      expect(store.filter((item: Foo) => item.foo > 2).length).toBe(1);
      expect(store.length).toBe(store.findAll().length);
    });

    it('Should support serialization/deserialization', () => {
      class Foo extends Model {
        public static type = 'foo';

        @prop public foo: number;
        @prop public bar: number;
        @prop public baz: number;
      }

      class Store extends Collection {
        public static types = [Foo];
      }

      const store = new Store();
      const foo1 = store.add({foo: 1}, Foo);
      const foo2 = store.add<Foo>({foo: 2}, 'foo');
      const foo3 = store.add(new Foo({foo: 3}));

      const raw = store.toJSON();

      const store2 = new Store(raw);
      expect(store2.length).toBe(3);
      const foo1b = store2.find((item: Foo) => item.foo === 1);
      expect(foo1b).toBeInstanceOf(Foo);
      expect(getModelId(foo1b)).toBe(getModelId(foo1));
      expect(foo1b === foo1).toBe(false);

      const fooB = store2.find(Foo);
      expect(fooB).toBeInstanceOf(Foo);
    });
  });
});
