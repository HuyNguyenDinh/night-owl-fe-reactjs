import PropTypes from 'prop-types';
import merge from 'lodash/merge';
// import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box, TextField } from '@mui/material';
// components
import { BaseOptionChart } from '../../../../components/chart';

// ----------------------------------------------------------------------

EcommerceYearlySales.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.object,
  chartLabels: PropTypes.arrayOf(PropTypes.string),
  label: PropTypes.any,
  onChangeLabel: PropTypes.func,
  options: PropTypes.array
};

export default function EcommerceYearlySales({ title, subheader, chartLabels, chartData, label, onChangeLabel, options, ...other }) {

  const chartOptions = merge(BaseOptionChart(), {
    legend: { position: 'top', horizontalAlign: 'right' },
    xaxis: {
      categories: chartLabels,
    },
  });

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <TextField
            select
            fullWidth
            value={label}
            SelectProps={{ native: true }}
            onChange={onChangeLabel}
            sx={{
              '& fieldset': { border: '0 !important' },
              '& select': { pl: 1, py: 0.5, pr: '24px !important', typography: 'subtitle2' },
              '& .MuiOutlinedInput-root': { borderRadius: 0.75, bgcolor: 'background.neutral' },
              '& .MuiNativeSelect-icon': { top: 4, right: 0, width: 20, height: 20 },
            }}
          >
            <option value="">
              -
            </option>
            {options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </TextField>
        }
      />

      {chartData && <Box key={chartData.label} sx={{ mt: 3, mx: 3 }} dir="ltr">
        <ReactApexChart type="area" series={chartData.data} options={chartOptions} height={364} />
      </Box>
      }
    </Card>
  );
}
