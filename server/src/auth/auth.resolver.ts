import { Query, Resolver } from '@nestjs/graphql';
import { AuthTokenModel } from '../common/graphql.models';
import { issueAuthToken } from './jwt';

@Resolver()
export class AuthResolver {
  @Query(() => AuthTokenModel)
  authToken() {
    return issueAuthToken();
  }
}
