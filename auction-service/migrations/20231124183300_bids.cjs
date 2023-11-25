module.exports.up = function (pgm) {
    pgm.createTable('bids', {
        id: {
            type: 'serial',
            primaryKey: true
        },
        auction_id: {
            type: 'integer',
            notNull: true,
            references: '"auctions"',
            onDelete: 'CASCADE'
        },
        user_id: {
            type: 'integer',
            notNull: true
        },
        bid_amount: {
            type: 'numeric',
            notNull: true
        },
        bid_time: {
            type: 'timestamp with time zone',
            default: pgm.func('CURRENT_TIMESTAMP')
        }
    });
}

module.exports.down = function (pgm) {
    pgm.dropTable('bids');
}