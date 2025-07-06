import { alpha, Avatar, Box, Card, CardContent, Chip, Typography } from "@mui/material";

const StatCard = ({ title, value, change, icon, color }) => (
    <Card sx={{ borderRadius: '16px', border: `1px solid ${alpha(color, 0.1)}`, minWidth: "250px" }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: color }}>
              {value}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 0.5 }}>
              {title}
            </Typography>
            <Chip
              label={change}
              size="small"
              sx={{
                mt: 1,
                backgroundColor: alpha(color, 0.1),
                color: color,
                fontWeight: 600,
              }}
            />
          </Box>
          <Avatar sx={{ backgroundColor: alpha(color, 0.1), color: color, width: 48, height: 48 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

export default StatCard;