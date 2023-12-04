import React from 'react';
import { Button } from '@/components/ui';
const Trigger = ({ triggerText, buttonRef, showModal }) => {
  return (
    <Button
      className="btn btn-lg btn-danger center modal-button"
      ref={buttonRef}
      onClick={showModal}
    >
      {triggerText}
    </Button>
  );
};
export default Trigger;
