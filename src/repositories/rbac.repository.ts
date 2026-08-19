import UserRole from "../models/user-role.model";
import Role from "../models/role.model";
import RolePermission from "../models/role-permission.model";
import Permission from "../models/permission.model";

export const hasPermission = async (
  userId: string,
  permission: string
): Promise<boolean> => {
  const userRoles = await UserRole.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Role,
        as: "role",
        required: true,
        include: [
          {
            model: RolePermission,
            as: "rolePermissions",
            required: true,
            include: [
              {
                model: Permission,
                as: "permission",
                required: true,
                where: { name: permission },
              },
            ],
          },
        ],
      },
    ],
  });

  return userRoles.length > 0;
};
