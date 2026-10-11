export class ErrorHandler {
  static extractErrorMessage(error: any): string {
    if (error.error && typeof error.error === 'string') {
      return error.error;
    }
    if (error.error && error.error.message) {
      return error.error.message;
    }
    if (error.error && error.error.errors) {
      const errors = Object.values(error.error.errors).flat();
      return (errors as string[]).join(', ');
    }
    if (error.error && error.error.title) {
      return error.error.title;
    }
    if (error.status === 400) return 'Invalid request. Please check your input.';
    if (error.status === 401) return 'Unauthorized. Please login again.';
    if (error.status === 403) return 'Access denied.';
    if (error.status === 404) return 'Resource not found.';
    if (error.status === 500) return 'Server error. Please try again later.';
    return 'An error occurred. Please try again.';
  }
}
