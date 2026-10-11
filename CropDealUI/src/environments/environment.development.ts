export const environment = {
  production: false,
  useMonolithic: true,
  monolithicUrl: 'http://localhost:5240',
  userServiceUrl: 'http://localhost:5024',
  cropServiceUrl: 'http://localhost:5178',
  orderServiceUrl: 'http://localhost:5105',
  transactionServiceUrl: 'http://localhost:5290',
  bankAccountServiceUrl: 'http://localhost:5005',
  cartItemServiceUrl: 'http://localhost:5248',
  ratingReviewServiceUrl: 'http://localhost:5063',
  adminServiceUrl: 'http://localhost:5254',

  get apiUrl(): string { return this.useMonolithic ? this.monolithicUrl : this.userServiceUrl; },
  get cropUrl(): string { return this.useMonolithic ? this.monolithicUrl : this.cropServiceUrl; },
  get orderUrl(): string { return this.useMonolithic ? this.monolithicUrl : this.orderServiceUrl; },
  get transactionUrl(): string { return this.useMonolithic ? this.monolithicUrl : this.transactionServiceUrl; },
  get bankUrl(): string { return this.useMonolithic ? this.monolithicUrl : this.bankAccountServiceUrl; },
  get cartUrl(): string { return this.useMonolithic ? this.monolithicUrl : this.cartItemServiceUrl; },
  get ratingUrl(): string { return this.useMonolithic ? this.monolithicUrl : this.ratingReviewServiceUrl; },
  get adminUrl(): string { return this.useMonolithic ? this.monolithicUrl : this.adminServiceUrl; }
};
