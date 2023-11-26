module.exports.up = function(pgm) {
    console.log('Executing up migration...');
    // inside that database, create a table called items

    pgm.createTable('categories',
        {
            id: {
                type: 'serial',
                primaryKey: true
            },
            created_at: {
                type: 'timestamp without time zone',
                default: pgm.func('CURRENT_TIMESTAMP')
            },
            category: {
                type: 'varchar(240)',
                notNull: true
            }
        }
    );

    pgm.createTable('items', {
        id: {
            type: 'serial',
            primaryKey: true
        },
        created_at: {
            type: 'timestamp without time zone',
            default: pgm.func('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: 'timestamp without time zone',
            default: pgm.func('CURRENT_TIMESTAMP')
        },
        quantity: {
            type: 'integer',
            default: 1
        },
        description: {
            type: 'varchar(240)',
            default: ''
        },
        shipping_cost: {
            type: 'decimal',
            default: 0
        },
        category_id: {
            type: 'integer',
            foreignKey: {
                name: 'category_id_fk',
                table: 'categories',
                mapping: 'id',
                rules: {
                    onDelete: 'CASCADE',
                    onUpdate: 'RESTRICT'
                }
            }
        },
        initial_bid_price: {
            type: 'decimal',
            notNull: true
        },
        final_bid_price: {
            type: 'decimal'
        },
        seller_id: {
            type: 'integer'
        },
        buyer_id: {
            type: 'integer'
        },
        photo_url1: { type: 'varchar' },
        photo_url2: { type: 'varchar' },
        photo_url3: { type: 'varchar' },
        photo_url4: { type: 'varchar' },
        photo_url5: { type: 'varchar' }
    });
};

module.exports.down = function(pgm) {
    pgm.dropTable('items');
};
