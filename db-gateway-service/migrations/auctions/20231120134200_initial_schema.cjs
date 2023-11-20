module.exports.up = function(pgm) {
    pgm.createTable('auctions', {
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
        item_id: {
            type: 'integer',
            notNull: true
        },
        seller_id: {
            type: 'integer'
        },
        start_time: {
            type: 'timestamp with time zone',
            notNull: true
        },
        end_time: {
            type: 'timestamp with time zone',
            notNull: true
        },
        status: {
            type: 'varchar(20)',
            notNull: true
        }
    });
};

module.exports.down = function(pgm) {
    pgm.dropTable('auctions');
};
