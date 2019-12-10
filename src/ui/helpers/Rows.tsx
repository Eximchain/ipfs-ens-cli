import React, { FC } from 'react';
import { Box } from 'ink';

interface RowsProps {
  prefix?:string
}

export const Rows: FC<RowsProps> = ({ children, prefix }) => {
    
  return (
    <Box margin={1} flexDirection='column'>
      {
        React.Children.map(children, (child, i) => {
          return <Box key={`${prefix}${i}`} marginBottom={1} flexDirection='row'>{child}</Box>
        })
      }
    </Box>
  )
}

export default Rows;