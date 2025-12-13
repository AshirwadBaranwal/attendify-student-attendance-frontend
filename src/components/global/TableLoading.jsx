import React from "react";

const SkeletonRow = ({ columns }) => {
  return (
    <tr className="animate-pulse border-b border-border last:border-0">
      {columns.slice(0, -1).map((col, idx) => (
        <td key={idx} className="p-4 align-middle">
          {/* 'bg-muted' automatically handles light/dark gray based on your theme */}
          <div className="h-4 w-24 bg-muted rounded-md"></div>
        </td>
      ))}
      <td className="p-4 align-middle">
        <div className="flex gap-2">
          {/* Action buttons skeleton */}
          <div className="h-8 w-8 bg-muted rounded-md"></div>
          <div className="h-8 w-8 bg-muted rounded-md"></div>
        </div>
      </td>
    </tr>
  );
};

const TableSkeleton = ({ ColumnsArray }) => {
  return (
    <div className="w-full">
      {/* Top Toolbar Skeleton */}
      <div className="w-full py-5 flex justify-between items-center">
        <div className="w-40 h-9 rounded-md animate-pulse bg-muted"></div>
        <div className="w-40 h-9 rounded-md animate-pulse bg-muted"></div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-md border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* Table Header */}
            <thead className="bg-muted/50 [&_tr]:border-b border-border">
              <tr>
                {ColumnsArray.map((column, idx) => {
                  return (
                    <th
                      key={idx}
                      className="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                    >
                      {column}
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="[&_tr:last-child]:border-0">
              {[...Array(5)].map((_, idx) => (
                <SkeletonRow key={idx} columns={ColumnsArray} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;
