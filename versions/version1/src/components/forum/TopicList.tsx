import React from 'react';

interface Topic {
  id: string;
  title: string;
  description: string;
  // Otros campos que necesites
}

interface TopicListProps {
  topics: Topic[];
}

const TopicList: React.FC<TopicListProps> = ({ topics }) => {
  return (
    <div className="space-y-4">
      {topics.map(topic => (
        <div key={topic.id} className="border p-4 rounded-lg shadow hover:shadow-md">
          <h2 className="text-xl font-bold mb-2">{topic.title}</h2>
          <p className="text-gray-600 mb-4">{topic.description}</p>
          {/* Otros detalles del tema */}
        </div>
      ))}
    </div>
  );
};

export default TopicList;
