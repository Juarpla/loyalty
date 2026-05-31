export const demoAdminPasscode = "loyalty2026";
export const authorizedAdminSession = "authorized_admin_session";
export const registeredAdminCredentialsCookieName = "registered_admin_credentials";
export const adminCompanyIdCookieName = "admin_company_id";
export const demoAdminCompanyId = "demo-company";

export type RegisteredAdminCredentials = {
  username: string;
  passcode: string;
};

export function normalizeAdminCredential(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function isValidRegisteredAdminCredentials(input: RegisteredAdminCredentials) {
  return input.username.length >= 2 && input.passcode.length >= 4;
}

export function encodeRegisteredAdminCredentials(credentials: RegisteredAdminCredentials) {
  return Buffer.from(JSON.stringify(credentials), "utf8").toString("base64url");
}

export function decodeRegisteredAdminCredentials(value: string | undefined) {
  if (!value) return null;

  try {
    const decoded = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
    const username = normalizeAdminCredential(decoded?.username);
    const passcode = normalizeAdminCredential(decoded?.passcode);

    if (!isValidRegisteredAdminCredentials({ username, passcode })) {
      return null;
    }

    return { username, passcode };
  } catch {
    return null;
  }
}

export function getCookieValue(cookieHeader: string | null, cookieName: string) {
  if (!cookieHeader) return undefined;

  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${cookieName}=`))
    ?.slice(cookieName.length + 1);
}

export function getRegisteredAdminCredentialsFromCookieHeader(cookieHeader: string | null) {
  return decodeRegisteredAdminCredentials(
    getCookieValue(cookieHeader, registeredAdminCredentialsCookieName),
  );
}

export function matchesRegisteredAdminCredentials(
  input: RegisteredAdminCredentials,
  cookieHeader: string | null,
) {
  const registeredCredentials = getRegisteredAdminCredentialsFromCookieHeader(cookieHeader);

  return (
    registeredCredentials?.username === input.username &&
    registeredCredentials.passcode === input.passcode
  );
}

export function createAdminCompanyId(username: string) {
  const normalizedUsername = normalizeAdminCredential(username).toLowerCase();

  if (!normalizedUsername || normalizedUsername === "demo") {
    return demoAdminCompanyId;
  }

  let hash = 2166136261;

  for (let index = 0; index < normalizedUsername.length; index += 1) {
    hash ^= normalizedUsername.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `company-${(hash >>> 0).toString(36)}`;
}

export function getAdminCompanyIdFromCookieHeader(cookieHeader: string | null) {
  const explicitCompanyId = normalizeAdminCredential(
    getCookieValue(cookieHeader, adminCompanyIdCookieName),
  );

  if (explicitCompanyId) {
    return explicitCompanyId;
  }

  const registeredCredentials = getRegisteredAdminCredentialsFromCookieHeader(cookieHeader);

  if (registeredCredentials) {
    return createAdminCompanyId(registeredCredentials.username);
  }

  return "";
}
