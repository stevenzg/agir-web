import React from 'react';
import { useParams } from 'next/navigation';

const ProcessDetailPage = () => {
  const params = useParams();
  const { id } = params;
  // TODO: fetch process detail by id
  return (
    <div>
      <h1>流程详情</h1>
      <p>流程ID: {id}</p>
      {/* 展示节点、转移等详细信息 */}
    </div>
  );
};

export default ProcessDetailPage;
