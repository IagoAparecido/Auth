import { SetMetadata } from '@nestjs/common';

export interface PolicyHandler {
  action: string;
  subject: string;
  conditions?: any;
}

export const CHECK_POLICIES_KEY = 'check_policy';
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers);
