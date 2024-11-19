import { HttpApiEndpoint, HttpApiGroup, OpenApi } from '@effect/platform';
import { Schema } from 'effect';
import { Challenge, ChallengeId, ChallengeView } from './challenge-schema.mjs';
import { ChallengeNotFound } from './challenge-error.mjs';
import { Authentication } from '@/auth/authentication.mjs';
import { FindManyUrlParams } from '@/misc/find-many-url-params-schema.mjs';
import { FindManyResultSchema } from '@/misc/find-many-result-schema.mjs';
import { Unauthorized } from '@/auth/error-403.mjs';
import { LikeConflict, LikeNotFound } from '@/like/like-error.mjs';
import { Like } from '@/like/like-schema.mjs';
import { ChallengeParticipant } from './challenge-participant-schema.mjs';
import {
  ChallengeParticipantConflict,
  ChallengeParticipantNotFound,
} from './challenge-participant-error.mjs';
import { Account } from '@/account/account-schema.mjs';

export class ChallengeApi extends HttpApiGroup.make('challenge')
  .add(
    HttpApiEndpoint.get('findAll', '/')
      .setUrlParams(FindManyUrlParams)
      .annotateContext(
        OpenApi.annotations({
          description:
            '(사용가능) 챌린지 목록을 조회합니다. 페이지와 한 페이지당 챌린지 수를 지정할 수 있습니다.',
          override: {
            summary: '(사용가능) 챌린지 목록 조회',
          },
        }),
      )
      .addSuccess(FindManyResultSchema(ChallengeView)),
  )
  .add(
    HttpApiEndpoint.get('findById', '/:id')
      .setPath(
        Schema.Struct({
          id: ChallengeId,
        }),
      )
      .addError(ChallengeNotFound)
      .addSuccess(ChallengeView)
      .annotateContext(
        OpenApi.annotations({
          description:
            '(사용가능) 챌린지를 조회합니다. 챌린지가 존재하지 않는 경우 404를 반환합니다.',
          override: {
            summary: '(사용가능) 단일 챌린지 조회',
          },
        }),
      ),
  )
  .add(
    HttpApiEndpoint.post('create', '/')
      .middleware(Authentication)
      .setPayload(Challenge.jsonCreate)
      .addError(Unauthorized)
      .addError(ChallengeNotFound)
      .addSuccess(ChallengeView)
      .annotateContext(
        OpenApi.annotations({
          description: '(사용가능) 챌린지를 생성합니다.',
          override: {
            summary: '(사용가능) 챌린지 생성',
          },
        }),
      ),
  )
  .add(
    HttpApiEndpoint.patch('updateById', '/:id')
      .middleware(Authentication)
      .setPath(
        Schema.Struct({
          id: ChallengeId,
        }),
      )
      .setPayload(Schema.partialWith(Challenge.jsonUpdate, { exact: true }))
      .addError(Unauthorized)
      .addError(ChallengeNotFound)
      .addSuccess(ChallengeView)
      .annotateContext(
        OpenApi.annotations({
          description: '(사용가능) 챌린지를 수정합니다.',
          override: {
            summary: '(사용가능) 챌린지 수정',
          },
        }),
      ),
  )
  .add(
    HttpApiEndpoint.del('deleteById', '/:id')
      .middleware(Authentication)
      .setPath(
        Schema.Struct({
          id: ChallengeId,
        }),
      )
      .addError(Unauthorized)
      .addError(ChallengeNotFound)
      .annotateContext(
        OpenApi.annotations({
          description: '(사용가능) 챌린지를 삭제합니다.',
          override: {
            summary: '(사용가능) 챌린지 삭제',
          },
        }),
      ),
  )
  .add(
    HttpApiEndpoint.get('findLikeStatus', '/:id/like-status')
      .middleware(Authentication)
      .setPath(
        Schema.Struct({
          id: ChallengeId,
        }),
      )
      .addError(LikeNotFound)
      .addSuccess(Like)
      .addSuccess(Schema.Literal('not implemented yet'))
      .annotateContext(
        OpenApi.annotations({
          description:
            '(사용가능) 챌린지에 좋아요를 눌렀는지 확인합니다. 챌린지가 존재하지 않는 경우 404를 반환합니다.',
          override: {
            summary: '(사용가능) 챌린지 좋아요 상태 조회',
          },
        }),
      ),
  )
  .add(
    HttpApiEndpoint.post('likeChallengeById', '/:id/like')
      .middleware(Authentication)
      .setPath(
        Schema.Struct({
          id: ChallengeId,
        }),
      )
      .addError(ChallengeNotFound)
      .addError(LikeConflict)
      .addError(Unauthorized)
      .addSuccess(ChallengeView)
      .annotateContext(
        OpenApi.annotations({
          description:
            '(사용가능) 챌린지에 좋아요를 누릅니다. 챌린지가 존재하지 않는 경우 404를 반환합니다.',
          override: {
            summary: '(사용가능) 챌린지 좋아요',
          },
        }),
      ),
  )
  .add(
    HttpApiEndpoint.del('removeLikeChallengeById', '/:id/like')
      .middleware(Authentication)
      .setPath(
        Schema.Struct({
          id: ChallengeId,
        }),
      )
      .addError(ChallengeNotFound)
      .addError(LikeNotFound)
      .addError(Unauthorized)
      .addSuccess(ChallengeView)
      .annotateContext(
        OpenApi.annotations({
          description:
            '(사용가능) 챌린지에 좋아요를 취소합니다. 챌린지가 존재하지 않는 경우 404를 반환합니다.',
          override: {
            summary: '(사용가능) 챌린지 좋아요 취소',
          },
        }),
      ),
  )
  .add(
    HttpApiEndpoint.post('dislikeChallengeById', '/:id/dislike')
      .middleware(Authentication)
      .setPath(
        Schema.Struct({
          id: ChallengeId,
        }),
      )
      .addError(ChallengeNotFound)
      .addError(LikeConflict)
      .addError(Unauthorized)
      .addSuccess(ChallengeView)
      .annotateContext(
        OpenApi.annotations({
          description:
            '(사용가능) 챌린지에 싫어요를 누릅니다. 챌린지가 존재하지 않는 경우 404를 반환합니다.',
          override: {
            summary: '(사용가능) 챌린지 싫어요',
          },
        }),
      ),
  )
  .add(
    HttpApiEndpoint.del('removeDislikeChallengeById', '/:id/dislike')
      .middleware(Authentication)
      .setPath(
        Schema.Struct({
          id: ChallengeId,
        }),
      )
      .addError(ChallengeNotFound)
      .addError(LikeNotFound)
      .addError(Unauthorized)
      .addSuccess(ChallengeView)
      .annotateContext(
        OpenApi.annotations({
          description:
            '(사용가능) 챌린지에 싫어요를 취소합니다. 챌린지가 존재하지 않는 경우 404를 반환합니다.',
          override: {
            summary: '(사용가능) 챌린지 싫어요 취소',
          },
        }),
      ),
  )
  .add(
    HttpApiEndpoint.get('getChallengeMembers', '/:id/member')
      .setPath(
        Schema.Struct({
          id: ChallengeId,
        }),
      )
      .addError(ChallengeNotFound)
      .addSuccess(Schema.Array(Account.json))
      .annotateContext(
        OpenApi.annotations({
          description:
            '(사용가능) 챌린지에 참여한 사용자 목록을 조회합니다. 챌린지가 존재하지 않는 경우 404를 반환합니다.',
          override: {
            summary: '(사용가능) 챌린지 참여자 목록 조회',
          },
        }),
      ),
  )
  .add(
    HttpApiEndpoint.post('joinChallengeById', '/:id/member')
      .middleware(Authentication)
      .setPath(
        Schema.Struct({
          id: ChallengeId,
        }),
      )
      .addError(ChallengeNotFound)
      .addError(ChallengeParticipantConflict)
      .addError(Unauthorized)
      .addSuccess(ChallengeParticipant)
      .annotateContext(
        OpenApi.annotations({
          description:
            '(사용가능) 챌린지에 참여합니다. 챌린지가 존재하지 않는 경우 404를 반환합니다. 이미 참여하였을 경우 409를 반환합니다.',
          override: {
            summary: '(사용가능) 챌린지 참여',
          },
        }),
      ),
  )
  .add(
    HttpApiEndpoint.del('leaveChallengeById', '/:id/member')
      .middleware(Authentication)
      .setPath(
        Schema.Struct({
          id: ChallengeId,
        }),
      )
      .addError(ChallengeParticipantNotFound)
      .addError(Unauthorized)
      .annotateContext(
        OpenApi.annotations({
          description:
            '(사용가능) 챌린지에서 탈퇴합니다. 챌린지가 존재하지 않는 경우 404를 반환합니다. 챌린지에 참여하지 않았을 경우에도 404를 반환합니다.',
          override: {
            summary: '(사용가능) 챌린지 탈퇴',
          },
        }),
      ),
  )
  .prefix('/api/challenges')
  .annotateContext(
    OpenApi.annotations({
      title: '(사용가능) 챌린지 API',
    }),
  ) {}
