import React from 'react';
import { Card, Button } from '@/components/ui';
import styles from './AddItem.module.css';

const AddItem = ({ handleAddItem }) => {
  return (
    <Card className={styles.addItemCard}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const itemName = e.target.itemName.value;
          const initialBid = parseFloat(e.target.initialBid.value);
          handleAddItem(itemName, initialBid);
          e.target.reset();
        }}
      >
        <label htmlFor="itemName">Item Name:</label>
        <input type="text" id="itemName" required />

        <label htmlFor="initialBid">Starting Bid:</label>
        <input type="number" id="initialBid" required />

        <Button type="submit">Add Item</Button>
      </form>
    </Card>
  );
};

export default AddItem;
