import jwt, { JwtPayload } from 'jsonwebtoken';
import { RealmUser } from '../models/RealmUser';
import { AuthUser } from '../models/AuthUser';
import { Secret } from '../models/Secret';
import { Realm } from '../models/Realm';

interface TokenUser extends JwtPayload {
  email: string;
  username?: string;
  roles?: string[];
  realmId?: number;
  allowedRealms?: any;
  allowedDomains?: string[];
}

interface User extends TokenUser {
  id: string | number;
  password?: string;
  realm?: string;
}

interface RealmData {
  realmId: number;
  realmSecret: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

type TokenType = 'authUser' | 'realmUser';

export const getRealmData = async (
  tokenUser: TokenUser,
  type: TokenType
): Promise<{ realmData: RealmData; user: User }> => {
  let users: User[];

  if (type === 'authUser') {
    users = (await AuthUser.find().lean()) as User[];
  } else if (type === 'realmUser') {
    users = (await RealmUser.find().lean()) as User[];
  } else {
    throw new Error('Invalid token type');
  }

  let user = users.find((u: any) => u.email === tokenUser.email);
  console.log('the user ', user);

  let realmData = await Secret.findOne({ realmId: user?.realmId }).lean();
  return { realmData: realmData as RealmData, user: user as User };
};

export const verifyAccessToken = async (
  token: string,
  type: TokenType
): Promise<TokenUser> => {
  try {
    let tokenUser = jwt.decode(token) as TokenUser;
    let data = await getRealmData(tokenUser, type);
    const decoded = jwt.verify(token, data.realmData.realmSecret) as TokenUser;
    return decoded;
  } catch (err) {
    throw new Error('Invalid token');
  }
};

export const verifyRefreshToken = async (
  token: string,
  type: TokenType
): Promise<TokenUser> => {
  try {
    let tokenUser = jwt.decode(token) as TokenUser;
    let data = await getRealmData(tokenUser, type);
    console.log('the data ', data);
    return jwt.verify(token, data.realmData.realmSecret) as TokenUser;
  } catch (err) {
    throw new Error('Invalid token');
  }
};

export const generateRealmUserToken = async (
  user: User
): Promise<TokenResponse> => {
  let realm = await Realm.findOne({ id: user.realmId }).lean();
  let realmData = await Secret.findOne({ realmId: user.realmId }).lean();

  const payload: any = {};

  if (user && user.email) {
    payload.email = user.email;
  }

  if (user && user.username) {
    payload.username = user.username;
  }

  if (user && user.roles) {
    payload.roles = user.roles;
  }

  if (user && user.allowedRealms) {
    payload.allowedRealms = user.allowedRealms;
  }

  if (user && user.allowedDomains) {
    payload.allowedDomains = user.allowedDomains;
  }

  if (realm && realm.name) {
    payload.realm = realm.name;
  }

  const accessToken = jwt.sign(payload, (realmData as any).realmSecret, {
    expiresIn: '10m',
    issuer: process.env.ISSUER,
  });

  const refreshToken = jwt.sign(
    { email: user.email, username: user.username },
    (realmData as any).realmSecret,
    {
      expiresIn: '7d',
      issuer: process.env.ISSUER,
    }
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const generateTokenUsingRefreshToken = async (
  refreshToken: string,
  type: TokenType
): Promise<TokenResponse> => {
  let isVerified = await verifyRefreshToken(refreshToken, type);
  if (!isVerified) {
    throw new Error('Invalid refresh token');
  }

  let tokenUser = jwt.decode(refreshToken) as TokenUser;
  let data = await getRealmData(tokenUser, type);
  let newTokens = await generateRealmUserToken(data.user);
  console.log('new tokens ', newTokens);
  return newTokens;
};
