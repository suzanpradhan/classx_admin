'use client';

import { useEffect, useRef } from 'react';
import { Button } from '../zenbuddha/src';

interface AlertDialogProps {
  onClickYes: () => void;
  onClickNo: () => void;
  isOpen: boolean;
  deleteContent?: string;
}

const AlertDialog = (props: AlertDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  useEffect(() => {
    props.isOpen ? dialogRef.current?.showModal() : dialogRef.current?.close();
  }, [props.isOpen]);
  return (
    props.isOpen && (
      <dialog
        ref={dialogRef}
        className=" backdrop:bg-componentBgGrey backdrop:bg-opacity-60 rounded-xl"
      >
        <div className="w-56 m-4">
          <div className="text-base">
            Are you sure you want to delete user for{' '}
            {props.deleteContent ?? 'username'}?
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              className="flex-1 h-8"
              text="Yes"
              kind="danger"
              onClick={props.onClickYes}
            />{' '}
            <Button
              className="flex-1 h-8"
              text="No"
              kind="secondary"
              onClick={props.onClickNo ?? props.onClickNo}
            />
          </div>
        </div>
      </dialog>
    )
  );
};
export default AlertDialog;
