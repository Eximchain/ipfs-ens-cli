import React, { FC } from 'react';
import Select from './Select';
export interface ConfirmActionProps {
  action: string
  confirm: () => void
  deny: () => void
}

export const ConfirmAction: FC<ConfirmActionProps> = ({ action, confirm, deny }) => {
  return (
    <Select label={action}
      items={[
        { 'label': 'Yes, Continue', value: 'Yes' },
        { 'label': 'No, Go Back', value: 'No' }
      ]}
      onSelect={({ value }) => {
        if (value === 'Yes') {
          confirm();
        } else {
          deny();
        }
      }} />
  )
}