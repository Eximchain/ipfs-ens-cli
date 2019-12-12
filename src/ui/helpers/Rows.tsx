import React, { FC } from 'react';
import { Box, BoxProps } from 'ink';

export const Column: FC<BoxProps> = ({ children, ...props }) => (
  <Box {...props} flexDirection='column'>{children}</Box>
)

export const Row: FC<BoxProps & RowsProps> = ({ children, noLinePad, ...props }) => (
  children !== null ? (
    <Box {...props} marginBottom={noLinePad ? 0 : 1} flexDirection='row'>{children}</Box>
  ) : null
)

interface RowsProps {
  prefix?: string
  noSideMargin?: boolean
  noLinePad?: boolean
}

export const Rows: FC<RowsProps & BoxProps> = ({ children, prefix, noSideMargin, ...props }) => (
  <Column {...props} margin={noSideMargin ? 0 : 1}>
    {
      React.Children.map(children, (child, i) => {
        return child !== null ? <Row key={`${prefix}${i}`} {...props}>{child}</Row> : null;
      })
    }
  </Column>
)

export default Rows;