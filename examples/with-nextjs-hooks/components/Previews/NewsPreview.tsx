import React, { ReactText } from 'react';

// Defines news preview props
export type NewsPreviewProps = {
  id: ReactText;
  position: ReactText;
  // language
  title: string;
  perex: string;
  // behaviors
  onUpdate?: () => void;
  onRemove?: () => void;
};

// Displays preview of NewsModel (remote data)
const NewsPreview: React.FC<NewsPreviewProps> = props => {
  const { id, position, title, perex, onUpdate, onRemove } = props;
  return (
    <div>
      <h4>{title}</h4>
      <h5>{perex}</h5>
      <p>
        <small>{`ID: ${id} (#${position})`}</small>
      </p>
      <p>
        {onUpdate && (
          <button type="button" onClick={onUpdate}>
            update
          </button>
        )}
        {onRemove && (
          <button type="button" onClick={onRemove}>
            remove
          </button>
        )}
      </p>
    </div>
  );
};

// exports
export { NewsPreview };
