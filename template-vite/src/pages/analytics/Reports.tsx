import React from 'react';
import { ListPageLayout } from '@marmeto_engineering/anthers-components';

import { reportColumns } from '@/features/reports';
import { httpClient } from '@/services/api';

/** Sample listing page using Anthers `AdvancedDataTable` (Chromatic default story shape). */
const Reports = () => (
  <ListPageLayout
    title="Reports"
    description="Example order report powered by Advanced Data Table. Point `apiEndpoint` at your product API when you leave mock mode."
    advancedDataTableProps={{
      apiEndpoint: '/reports',
      apiClient: httpClient,
      columnsData: reportColumns,
      searchPlaceholder: 'Search orders...',
      selectable: true,
      wrapCard: true,
      hideCommand: true,
      emptyState: {
        title: 'No reports to display',
        description: 'There are currently no orders matching your filters or criteria.',
      },
      dataEmptyState: {
        title: 'No search results found',
        description:
          "We couldn't find any orders matching your search. Try adjusting your search terms or clearing the search to see all orders.",
      },
    }}
  />
);

export default Reports;
