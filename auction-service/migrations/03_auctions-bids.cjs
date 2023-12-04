module.exports.up = function(pgm) {
    // Create the auctions table
    pgm.createTable('auctions', {
        id: {
            type: 'serial',
            primaryKey: true
        },
        created_at: {
            type: 'timestamp without time zone',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: 'timestamp without time zone',
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
            type: 'timestamp without time zone',
            notNull: true
        },
        end_time: {
            type: 'timestamp without time zone',
            notNull: true
        },
        starting_price: {
            type: 'numeric',
            notNull: true
        },
        status: {
            type: 'varchar(20)',
            notNull: true
        },
        last_bid_time: {
            type: 'timestamp without time zone'
        },
        bid_increment: {
            type: 'numeric',
            notNull: true,
            default: 5
        }
    });

    // Create the bids table
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
            type: 'timestamp without time zone',
            default: pgm.func('CURRENT_TIMESTAMP')
        }
    });

    // Add winning bid column
    pgm.addColumns('auctions', {
        winning_bid_id: {
            type: 'integer',
            references: '"bids"',
            onDelete: 'SET NULL'
        }
    });

    // Create indexes for efficient querying
    pgm.createIndex('bids', 'auction_id');
    pgm.createIndex('auctions', 'winning_bid_id');

    // Trigger function to update the winning bid
    pgm.createFunction('update_auction_winning_bid', [], {
        returns: 'TRIGGER',
        language: 'plpgsql'
    }, `
    BEGIN
        UPDATE auctions
        SET winning_bid_id = NEW.id,
            last_bid_time = NEW.bid_time
        WHERE id = NEW.auction_id;
        RETURN NEW;
    END;
    `);

    pgm.createTrigger('bids', 'trigger_update_auction_winning_bid', {
        when: 'AFTER',
        operation: 'INSERT',
        function: 'update_auction_winning_bid',
        level: 'ROW'
    });
};

module.exports.down = function(pgm) {
    pgm.dropTrigger('bids', 'trigger_update_auction_winning_bid');
    pgm.dropFunction('update_auction_winning_bid', []);
    
    pgm.dropIndex('bids', 'auction_id');
    pgm.dropIndex('auctions', 'winning_bid_id');

    pgm.dropTable('bids');
    pgm.dropTable('auctions');
};