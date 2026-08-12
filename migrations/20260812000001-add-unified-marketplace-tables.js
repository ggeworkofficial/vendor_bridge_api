'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Add ref_code to users
    await queryInterface.addColumn('users', 'ref_code', {
      type: Sequelize.STRING(16),
      allowNull: true,
    });

    // Populate ref_code for existing users
    await queryInterface.sequelize.query(`
      UPDATE users SET ref_code = substring(md5(random()::text) from 1 for 7) WHERE ref_code IS NULL;
    `);
    
    // Ensure uniqueness manually before constraint
    await queryInterface.changeColumn('users', 'ref_code', {
      type: Sequelize.STRING(16),
      allowNull: false,
      unique: true,
    });

    // 2. Create listings table
    await queryInterface.createTable('listings', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
      },
      kind: {
        type: Sequelize.ENUM('product', 'service', 'skill'),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(160),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      price_model: {
        type: Sequelize.ENUM('fixed', 'hourly', 'daily', 'project'),
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id'
        }
      },
      location: {
        type: Sequelize.STRING(120),
        allowNull: true,
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('under_review', 'published', 'flagged', 'banned'),
        defaultValue: 'under_review',
      },
      moderation_note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      reviewed_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      reviewed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      product_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'inventory',
          key: 'id'
        }
      },
      bulk_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      bulk_only: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      moq: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      commission_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      commission_percent: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });

    // 3. Create listing_media
    await queryInterface.createTable('listing_media', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      listing_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'listings',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      file_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      kind: {
        type: Sequelize.ENUM('image', 'portfolio'),
        allowNull: false,
      },
      is_primary: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      position: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });

    // 4. Create listing_price_tiers
    await queryInterface.createTable('listing_price_tiers', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      listing_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'listings',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      min_qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      unit_price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
    
    await queryInterface.addConstraint('listing_price_tiers', {
      fields: ['listing_id', 'min_qty'],
      type: 'unique',
      name: 'unique_listing_min_qty'
    });

    // 5. Create follows
    await queryInterface.createTable('follows', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      follower_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      seller_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'sellers',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
    
    await queryInterface.addConstraint('follows', {
      fields: ['follower_id', 'seller_id'],
      type: 'unique',
      name: 'unique_follow_pair'
    });

    // 6. modify orders
    await queryInterface.addColumn('orders', 'referral_code', {
      type: Sequelize.STRING(16),
      allowNull: true,
    });

    // 7. modify order_items
    await queryInterface.addColumn('order_items', 'unit_price', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    });
    
    await queryInterface.sequelize.query(`
      UPDATE order_items SET unit_price = price WHERE unit_price IS NULL;
    `);

    await queryInterface.changeColumn('order_items', 'unit_price', {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
    });

    await queryInterface.addColumn('order_items', 'listing_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'listings',
        key: 'id'
      },
      onDelete: 'SET NULL'
    });

    // 8. Create referrals
    await queryInterface.createTable('referrals', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      reseller_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      listing_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'listings',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      order_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'orders',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      order_total: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      commission_percent: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      commission_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'cleared', 'paid', 'void'),
        defaultValue: 'pending',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });

    // 9. Create withdrawals
    await queryInterface.createTable('withdrawals', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      method: {
        type: Sequelize.ENUM('bank', 'telebirr', 'cbe_birr'),
        allowNull: false,
      },
      account_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      account_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected', 'paid'),
        defaultValue: 'pending',
      },
      processed_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      processed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('withdrawals');
    await queryInterface.dropTable('referrals');
    await queryInterface.removeColumn('order_items', 'listing_id');
    await queryInterface.removeColumn('order_items', 'unit_price');
    await queryInterface.removeColumn('orders', 'referral_code');
    await queryInterface.dropTable('follows');
    await queryInterface.dropTable('listing_price_tiers');
    await queryInterface.dropTable('listing_media');
    await queryInterface.dropTable('listings');
    
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_listings_kind" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_listings_price_model" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_listings_status" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_listing_media_kind" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_referrals_status" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_withdrawals_method" CASCADE;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_withdrawals_status" CASCADE;');

    await queryInterface.removeColumn('users', 'ref_code');
  }
};
