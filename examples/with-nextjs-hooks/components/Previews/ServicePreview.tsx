import React, { ReactText } from 'react';

// Defines news preview props
export type ServicePreviewProps = {
  id: ReactText;
  // language
  title: string;
  perex: string;
  // attributes
  link: string;
  dateOfPublish: ReactText;
  // behaviors
  onUpdate: () => void;
  onRemove: () => void;
};

// Displays preview of ServiceModel (remote data)
const ServicePreview: React.FC<ServicePreviewProps> = props => {
  const { id, title, perex, link, dateOfPublish, onUpdate, onRemove } = props;
  return (
    <div>
      <h4>{title}</h4>
      <h5>{perex}</h5>
      <p>
        <a href="#">{link}</a>
      </p>
      <p>
        <small>{`ID: ${id} (${dateOfPublish})`}</small>
      </p>
      <p>
        <button type="button" onClick={onUpdate}>
          update
        </button>
        <button type="button" onClick={onRemove}>
          remove
        </button>
      </p>
    </div>
  );
};

// exports
export { ServicePreview };
