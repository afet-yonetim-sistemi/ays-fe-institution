export const formatStatus = (status: string, t: (key: string) => string): string => {
  switch (status) {
    case 'WAITING':
      return t('waiting');
    case 'COMPLETED':
      return t('completed');
    case 'REJECTED':
      return t('rejected');
    case 'APPROVED':
      return t('Approved');
    default:
      return status.charAt(0) + status.slice(1).toLowerCase();
  }
};
