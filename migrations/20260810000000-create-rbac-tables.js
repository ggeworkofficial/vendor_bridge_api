"use strict";

const crypto = require("crypto");

const SYSTEM_ROLES = ["admin", "buyer", "contributor", "reseller"];

const ROLE_DESCRIPTIONS = {
  admin:
    "System administrator with unrestricted access to every resource and permission.",
  buyer: "Purchases products and manages personal profile, orders, receipts and complaints.",
  contributor:
    "Collaborative platform participant with buyer-level access.",
  reseller: "Promotes and resells products with buyer-level access.",
};

const PERMISSIONS = [
  // Users
  ["user.create", "Create a new user account"],
  ["user.get_all", "View a list of all users"],
  ["user.get_self", "View the authenticated user's own profile"],
  ["user.get_one", "View a single user by id"],
  ["user.update_self", "Update the authenticated user's own profile"],
  ["user.update", "Update any user's details"],
  ["user.delete_self", "Delete the authenticated user's own account"],
  ["user.delete", "Delete any user account"],
  // Categories
  ["category.create", "Create a new category"],
  ["category.get_all", "View a list of all categories"],
  ["category.get_one", "View a single category by id"],
  ["category.update", "Update a category"],
  ["category.delete", "Delete a category"],
  // Sellers
  ["seller.create", "Create a new seller"],
  ["seller.get_all", "View a list of all sellers"],
  ["seller.get_one", "View a single seller by id"],
  ["seller.update", "Update a seller"],
  ["seller.delete", "Delete a seller"],
  // Inventory / Products
  ["product.create", "Create a new product"],
  ["product.get_all", "View a list of all products"],
  ["product.get_one", "View a single product by id"],
  ["product.update", "Update a product"],
  ["product.delete", "Delete a product"],
  // Product Images
  ["product_image.create", "Create a new product image"],
  ["product_image.get_all", "View a list of product images"],
  ["product_image.get_one", "View a single product image"],
  ["product_image.update", "Update a product image"],
  ["product_image.delete", "Delete a product image"],
  // Reviews
  ["review.create", "Create a new review"],
  ["review.get_all", "View a list of all reviews"],
  ["review.get_one", "View a single review by id"],
  ["review.update", "Update a review"],
  ["review.delete", "Delete a review"],
  // Orders
  ["order.create", "Create a new order"],
  ["order.get_all", "View a list of all orders"],
  ["order.get_self", "View the authenticated user's own orders"],
  ["order.get_one", "View a single order by id"],
  ["order.update", "Update an order"],
  ["order.cancel_self", "Cancel the authenticated user's own order"],
  // Receipts
  ["receipt.create", "Create a new receipt"],
  ["receipt.get_all", "View a list of all receipts"],
  ["receipt.get_self", "View the authenticated user's own receipts"],
  ["receipt.get_one", "View a single receipt by id"],
  ["receipt.update", "Update a receipt"],
  ["receipt.update_self", "Update the authenticated user's own receipt"],
  // Complaints
  ["complaint.create", "Create a new complaint"],
  ["complaint.get_all", "View a list of all complaints"],
  ["complaint.get_all_for_orders", "View all complaints for the authenticated user's orders"],
  ["complaint.get_one", "View a single complaint by id"],
  ["complaint_message.create", "Create a new complaint message"],
  ["complaint_message.get_all", "View a list of complaint messages"],
  ["complaint_message.get_one", "View a single complaint message"],
  // Logistics
  ["logistics.create", "Create a new logistics record"],
  ["logistics.get_all", "View a list of all logistics records"],
  ["logistics.get_one", "View a single logistics record"],
  ["logistics.get_self", "View the authenticated user's own logistics records"],
  ["logistics.update", "Update a logistics record"],
  // Payment Accounts
  ["payment_account.create", "Create a new payment account"],
  ["payment_account.get_one", "View a single payment account"],
  ["payment_account.get_all", "View a list of all payment accounts"],
  ["payment_account.update", "Update a payment account"],
  ["payment_account.delete", "Delete a payment account"],
  // Settings
  ["setting.create", "Create a new setting"],
  ["setting.get_all", "View a list of all settings"],
  ["setting.get_all_public", "View a list of all public settings"],
  ["setting.get_one_public", "View a single public setting"],
  ["setting.get_one", "View a single setting"],
  ["setting.update", "Update a setting"],
  ["setting.delete", "Delete a setting"],
];

// Permissions granted to buyer, contributor and reseller roles.
const BUYER_PERMISSIONS = [
  "user.get_self",
  "user.update_self",
  "user.delete_self",
  "category.get_one",
  "category.get_all",
  "seller.get_all",
  "seller.get_one",
  "product.get_all",
  "product.get_one",
  "product_image.get_all",
  "product_image.get_one",
  "review.create",
  "review.get_all",
  "review.get_one",
  "review.update",
  "review.delete",
  "order.create",
  "order.get_self",
  "order.cancel_self",
  "receipt.create",
  "receipt.get_self",
  "receipt.update_self",
  "complaint.create",
  "complaint.get_one",
  "complaint.get_all_for_orders",
  "complaint_message.create",
  "complaint_message.get_all",
  "complaint_message.get_one",
  "payment_account.get_all",
  "payment_account.get_one",
  "setting.get_all_public",
  "setting.get_one_public",
];

const ROLE_PERMISSIONS = {
  admin: PERMISSIONS.map(([name]) => name),
  buyer: BUYER_PERMISSIONS,
  contributor: BUYER_PERMISSIONS,
  reseller: BUYER_PERMISSIONS,
};

function deterministicUuid(seed) {
  const hex = crypto.createHash("md5").update(seed).digest("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(12, 15)}-8${hex.slice(15, 18)}-${hex.slice(18, 30)}`;
}

const ROLE_IDS = Object.fromEntries(
  SYSTEM_ROLES.map((name) => [name, deterministicUuid(`role:${name}`)])
);

const PERMISSION_IDS = Object.fromEntries(
  PERMISSIONS.map(([name]) => [name, deterministicUuid(`permission:${name}`)])
);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("roles", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(225),
      },
      description: {
        type: Sequelize.TEXT,
      },
      is_system: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    await queryInterface.createTable("permissions", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(255),
      },
      description: {
        type: Sequelize.TEXT,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    await queryInterface.createTable("user_roles", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      role_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    await queryInterface.addConstraint("user_roles", {
      fields: ["user_id", "role_id"],
      type: "unique",
      name: "user_roles_user_id_role_id_unique",
    });

    await queryInterface.createTable("role_permissions", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      role_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      permission_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "permissions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });

    await queryInterface.addConstraint("role_permissions", {
      fields: ["role_id", "permission_id"],
      type: "unique",
      name: "role_permissions_role_id_permission_id_unique",
    });

    // Initial system roles
    await queryInterface.bulkInsert(
      "roles",
      SYSTEM_ROLES.map((name) => ({
        id: ROLE_IDS[name],
        name,
        description: ROLE_DESCRIPTIONS[name],
        is_system: true,
      }))
    );

    // Initial permission set
    await queryInterface.bulkInsert(
      "permissions",
      PERMISSIONS.map(([name, description]) => ({
        id: PERMISSION_IDS[name],
        name,
        description,
      }))
    );

    // Guard against any missing permission referenced by a role
    Object.values(ROLE_PERMISSIONS).flat().forEach((name) => {
      if (!PERMISSION_IDS[name]) {
        throw new Error(`Unknown permission referenced by role: ${name}`);
      }
    });

    // Populate user_roles from existing users.role assignments
    const users = await queryInterface.sequelize.query(
      "SELECT id, role FROM users WHERE role IN (:roles)",
      {
        replacements: { roles: SYSTEM_ROLES },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (users.length > 0) {
      await queryInterface.bulkInsert(
        "user_roles",
        users.map((user) => ({
          id: deterministicUuid(`user_role:${user.id}:${user.role}`),
          user_id: user.id,
          role_id: ROLE_IDS[user.role],
        }))
      );
    }

    // Populate role_permissions according to the role definitions
    const rolePermissionRows = [];
    for (const [roleName, permissionNames] of Object.entries(ROLE_PERMISSIONS)) {
      for (const permissionName of permissionNames) {
        rolePermissionRows.push({
          id: deterministicUuid(`role_permission:${roleName}:${permissionName}`),
          role_id: ROLE_IDS[roleName],
          permission_id: PERMISSION_IDS[permissionName],
        });
      }
    }

    await queryInterface.bulkInsert("role_permissions", rolePermissionRows);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("role_permissions");
    await queryInterface.dropTable("user_roles");
    await queryInterface.dropTable("permissions");
    await queryInterface.dropTable("roles");
  },
};
