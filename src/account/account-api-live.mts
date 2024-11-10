import { Api } from '@/api.mjs';
import { AuthenticationLive } from '@/auth/authentication.mjs';
import { policyUse, withSystemActor } from '@/auth/authorization.mjs';
import { HttpApiBuilder } from '@effect/platform';
import { Effect, Layer } from 'effect';
import { AccountPolicy } from './account-policy.mjs';
import { CurrentAccount } from './account-schema.mjs';
import { AccountService } from './account-service.mjs';

export const AccountApiLive = HttpApiBuilder.group(Api, 'account', (handlers) =>
  Effect.gen(function* () {
    const accountService = yield* AccountService;
    const accountPolicy = yield* AccountPolicy;

    return handlers
      .handle('signUp', ({ payload }) =>
        accountService.signUp(payload).pipe(withSystemActor),
      )
      .handle('findById', ({ path }) => accountService.findAccountById(path.id))
      .handle('updateById', ({ path, payload }) =>
        accountService
          .updateAccountById(path.id, payload)
          .pipe(policyUse(accountPolicy.canUpdate(path.id))),
      )
      .handle('signIn', ({ payload }) =>
        accountService.signIn(payload).pipe(withSystemActor),
      )
      .handle('me', () => CurrentAccount)
      .handle('invalidate', ({ headers }) =>
        accountService.invalidate(headers['refresh-token']),
      );
  }),
).pipe(
  Layer.provide(AuthenticationLive),
  Layer.provide(AccountService.Live),
  Layer.provide(AccountPolicy.Live),
);
