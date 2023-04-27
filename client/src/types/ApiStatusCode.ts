export enum ApiStatusCode {
  Success = 0,
  FillAllFields = 1,
  EmailAlreadyRegistered = 2,
  InvalidAccount = 3,
  NotUserSpecified = 4,
  NotFieldsSpecified = 5,
  TokenExpired = 6,
  WatchRepositoryNotFound = 7,
  GithubUsernameNotFound = 8,
  InternalServerError = 99,
}
