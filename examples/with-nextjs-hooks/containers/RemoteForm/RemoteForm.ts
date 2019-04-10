import { RemotePersistApi } from 'hooks/useRemotePersist';
import { RemoteModel } from 'models/RemoteModel';
import { ReactElement } from 'react';

export type RemoteFormProps = {
  persistor: RemotePersistApi;
  model: RemoteModel;
  // layout
  render: (props: RemoteFormRenderProps) => ReactElement;
};

export type RemoteFormRenderProps = {
  onSubmit: (e: React.FormEvent) => void;
  errors: Array<string>;
};

const RemoteForm = (props: RemoteFormProps) => {
  // on submit callback
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {};

    return props.persistor.persist(props.model, data);
  };

  // render
  return props.render({
    onSubmit,
    errors: []
  });
};

export { RemoteForm };
