import React, { FC } from 'react';
import Select from './Select';
import ChevronText from './ChevronText';
export interface ConfirmActionProps {
  action: string
  confirm: () => void
  confirmMsg?: string
  deny: () => void
  denyMsg?: string
}

export const ConfirmAction: FC<ConfirmActionProps> = (props) => {
  const { action, confirm, deny, confirmMsg, denyMsg } = props;
  let yes = confirmMsg || 'Yes, Continue';
  let no = denyMsg || 'No, Go Back'
  return (
    <Select 
      label={
        <ChevronText>{ action }</ChevronText>
      }
      items={[
        { 'label': yes, value: 'Yes' },
        { 'label': no, value: 'No' }
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