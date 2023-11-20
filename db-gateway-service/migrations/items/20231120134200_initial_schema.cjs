module.exports.up = function(pgm) {
    pgm.createTable('items', {
        id: {
            type: 'serial',
            primaryKey: true
        },
        created_at: {
            type: 'timestamp with time zone',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: 'timestamp with time zone',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP')
        },
        quantity: {
            type: 'integer',
            notNull: true,
            default: 1
        },
        description: {
            type: 'varchar(240)',
            default: ''
        },
        shipping_cost: {
            type: 'integer',
            notNull: true,
            default: 0
        },
        category_id: {
            type: 'integer'
        },
        initial_bid_price: {
            type: 'decimal',
            notNull: true
        },
        final_bid_price: {
            type: 'decimal'
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
