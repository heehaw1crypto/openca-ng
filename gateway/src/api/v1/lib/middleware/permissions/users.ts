export const RoleEnum = {
  SUPER_ADMIN: "SUPER_ADMIN",
  USER: "USER",
};

export const userHasRole = ({ getUser, roleEnum }) => {
  return async (req) => {
    const user = getUser(req);
    if (!user) return false;

    const roleList = user.roleList.filter((role) => role.enum === roleEnum);

    return roleList.length > 0;
  };
};
