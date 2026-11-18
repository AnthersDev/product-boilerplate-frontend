import React, { useMemo, useState } from 'react';
/**
 * Storybook:
 * - ListPageLayout — https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/layouts-dashboard-layouts-list-page-layout--docs
 * - AdvancedDataTable — https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-data-display-advanced-data-table--docs
 * - show (Toast) — https://main--685923032e27da931cdadb63.chromatic.com/?path=/story/components-feedback-and-status-toast--docs
 */
import { ListPageLayout, show } from '@marmeto_engineering/anthers-components';

import { AnthersStorybookLinks } from '@/demo/anthers-storybook';
import { reportColumns, type ReportOrderEdge } from '@/features/reports';
import { httpClient } from '@/services/api';

const REPORTS_FILTER_TYPE = 'reports';

/** Sample listing page using Anthers `AdvancedDataTable` (docs / Chromatic reference). */
const Reports = () => {
  const [selectedRows, setSelectedRows] = useState<ReportOrderEdge[]>([]);

  const bulkActions = useMemo(
    () => [
      {
        variant: 'primary' as const,
        children: 'Archive',
        onClick: () => {
          show(
            selectedRows.length
              ? `Archived ${selectedRows.length} order${selectedRows.length === 1 ? '' : 's'} (demo).`
              : 'Select orders to archive (demo).',
            { type: 'success' },
          );
        },
      },
      {
        children: 'Delete',
        onClick: () => {
          show(
            selectedRows.length
              ? `Deleted ${selectedRows.length} order${selectedRows.length === 1 ? '' : 's'} (demo).`
              : 'Select orders to delete (demo).',
            { type: 'success' },
          );
        },
      },
    ],
    [selectedRows],
  );

  return (
    <>
      {/* @clean-demo anthers-storybook */}
      <AnthersStorybookLinks
        className="mb-3"
        components={['ListPageLayout', 'AdvancedDataTable', 'Badge', 'Dropdown', 'Toast']}
      />
      {/* @clean-demo-end */}
      <ListPageLayout
        title="Reports"
        description="Example order report with search, filters, bulk actions, and saved views. Point `apiEndpoint` at your product API when you leave mock mode."
        advancedDataTableProps={{
          apiEndpoint: '/reports',
          apiClient: httpClient,
          columnsData: reportColumns,
          searchPlaceholder: 'Search orders...',
          selectable: true,
          wrapCard: true,
          hideCommand: true,
          showSearch: true,
          enableSaveView: true,
          filterListType: REPORTS_FILTER_TYPE,
          bulkActions,
          onSelectionChange: (rows) => setSelectedRows(rows as ReportOrderEdge[]),
          emptyState: {
            title: 'No orders to display',
            description: 'There are currently no orders matching your filters or criteria.',
          },
          dataEmptyState: {
            title: 'No search results found',
            description:
              "We couldn't find any orders matching your search. Try adjusting your search terms or clearing the search to see all orders.",
          },
        }}
      />
    </>
  );
};

export default Reports;
