exports.up = pgm => {
    pgm.createTable('auctions', {
        id: 'id',
        item_id: { type: 'int', notNull: true },
        start_date_time: { type: 'timestamp', notNull: true },
        end_date_time: { type: 'timestamp', notNull: true },
        starting_price: { type: 'numeric', notNull: true }
    });
};

exports.down = pgm => {
    pgm.dropTable('auctions');
};
