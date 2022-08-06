import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const hashString = (str: string, salt: string) => {
    const hash = crypto.pbkdf2Sync(str, salt, 1000, 64, `sha512`).toString(`hex`);
    return hash;
};

export const verifyJWT = (token: string) => {
    const secrets = useRuntimeConfig().secretVariables;
    var decoded = jwt.verify(token, secrets.SERVER_SECRET);
    return decoded;
}