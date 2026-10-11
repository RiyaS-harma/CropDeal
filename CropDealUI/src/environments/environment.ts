const monolithicUrl = 'https://cropdeal-api-d6f0bga9ahfbf5gv.centralus-01.azurewebsites.net';

export const environment = {
  production: true,
  useMonolithic: true,
  monolithicUrl,
  userServiceUrl: 'http://localhost:5024',
  cropServiceUrl: 'http://localhost:5178',
  orderServiceUrl: 'http://localhost:5105',
  transactionServiceUrl: 'http://localhost:5290',
  bankAccountServiceUrl: 'http://localhost:5005',
  cartItemServiceUrl: 'http://localhost:5248',
  ratingReviewServiceUrl: 'http://localhost:5063',
  adminServiceUrl: 'http://localhost:5254',

  apiUrl: monolithicUrl,
  cropUrl: monolithicUrl,
  orderUrl: monolithicUrl,
  transactionUrl: monolithicUrl,
  bankUrl: monolithicUrl,
  cartUrl: monolithicUrl,
  ratingUrl: monolithicUrl,
  adminUrl: monolithicUrl
};
