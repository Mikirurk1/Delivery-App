import { GraphQLError } from 'graphql';
import type { AuthUser } from './jwt';

export type AuthContext = {
  user?: AuthUser | null;
};

export function requireAuth(context: AuthContext): AuthUser {
  if (context.user) {
    return context.user;
  }

  throw new GraphQLError('Authentication required', {
    extensions: {
      code: 'UNAUTHENTICATED',
      errorId: 'AUTH_TOKEN_REQUIRED',
    },
  });
}
