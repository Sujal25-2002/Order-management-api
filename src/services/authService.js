function buildTokenPayload(user) {
  return {
    sub: user.id,
    role: user.role,
    email: user.email,
  };
}

function buildAuthUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
  };
}

export { buildTokenPayload, buildAuthUser };
