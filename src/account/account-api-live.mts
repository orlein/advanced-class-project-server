import { Api } from '@/api.mjs';
import { AuthenticationLive } from '@/auth/authentication-live.mjs';
import { policyUse, withSystemActor } from '@/auth/authorization.mjs';
import { HttpApiBuilder } from '@effect/platform';
import { Effect, Layer } from 'effect';
import { AccountPolicy } from './account-policy.mjs';
import { CurrentAccount } from './account-schema.mjs';
import { AccountService } from './account-service.mjs';

export const AccountApiLive = HttpApiBuilder.group(
  Api,
  'accounts',
  (handlers) =>
    Effect.gen(function* () {
      const accountService = yield* AccountService;
      const accountPolicy = yield* AccountPolicy;

      return handlers
        .handle('signUp', ({ payload }) =>
          accountService.createAccount(payload).pipe(withSystemActor),
        )
        .handle('findById', ({ headers, path }) =>
          accountService
            .findAccountById(path.id)
            .pipe(policyUse(accountPolicy.canRead(path.id))),
        )
        .handle('me', () => CurrentAccount);
    }),
).pipe(
  Layer.provide(AuthenticationLive),
  Layer.provide(AccountService.Live),
  Layer.provide(AccountPolicy.Live),
);
