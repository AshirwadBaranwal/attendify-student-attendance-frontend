import React from "react";

const SkeletonRow = ({ columns }) => {
  return (
    <tr className="animate-pulse">
      {columns.slice(0, -1).map((col, idx) => (
        <td key={idx} className="px-4 py-3">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </td>
      ))}
      <td className="px-4 py-3 flex gap-2">
        <div className="h-8 w-8 bg-gray-200 rounded"></div>
        <div className="h-8 w-8 bg-gray-200 rounded"></div>
      </td>
    </tr>
  );
};

const TableSkeleton = ({ ColumnsArray }) => {
  return (
    <div>
      <div className="w-full py-5 flex justify-between items-center">
        <div className="w-40 h-8 rounded-md animate-pulse bg-gray-200"></div>
        <div className="w-40 h-8 rounded-md animate-pulse bg-gray-200"></div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              {ColumnsArray.map((column, idx) => {
                return (
                  <th
                    key={idx}
                    className="px-4 py-2 text-left text-sm font-medium text-gray-500"
                  >
                    {column}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[...Array(3)].map((_, idx) => (
              <SkeletonRow key={idx} columns={ColumnsArray} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableSkeleton;
