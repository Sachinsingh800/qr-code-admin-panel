import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
  Paper,
  Avatar,
  Chip,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Refresh,
  Info,
  AdminPanelSettings,
  Download,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 0,
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#ffffff",
    color: theme.palette.text.primary,
    borderBottom: `2px solid ${theme.palette.divider}`,
    fontSize: "0.875rem",
  },
  "& .MuiDataGrid-columnHeader": {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: 700,
    fontSize: "0.875rem",
    color: theme.palette.text.primary,
  },
  "& .MuiDataGrid-cell": {
    borderBottom: `1px solid ${theme.palette.divider}`,
    "&:focus": { outline: "none" },
  },
  "& .MuiDataGrid-row": {
    transition: "background-color 0.2s ease",
    "&:nth-of-type(even)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.selected,
    },
  },
  "& .MuiDataGrid-toolbarContainer": {
    padding: theme.spacing(2),
    backgroundColor: "transparent",
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

const UsersTable = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const token = Cookies.get("adminToken");
    if (!token) {
      navigate("/auth");
      return;
    }

    try {
      const response = await fetch(
        "http://13.203.219.119:3001/admin/user/getAll",
        {
          method: "GET",
          headers: {
            "x-admin-token": token,
          },
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.message && Array.isArray(data.message)) {
        setUsers(data.message);
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleExportCSV = () => {
    if (users.length === 0) return;

    const csvContent = [
      ["Name", "Email", "Role", "Joined Date"],
      ...users.map((user) => [
        `"${user.name.replace(/"/g, '""')}"`,
        `"${user.email.replace(/"/g, '""')}"`,
        user.role,
        new Date(user.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "users.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.secondary.main,
              width: 34,
              height: 34,
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            {params.row.name[0].toUpperCase()}
          </Avatar>
          <Typography variant="body2" fontWeight="medium">
            {params.row.name}
          </Typography>
        </Box>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      renderCell: (params) => (
        <Tooltip title={params.value} placement="top">
          <Typography
            variant="body2"
            noWrap
            sx={{
              fontFamily: "monospace",
              color: "text.secondary",
              letterSpacing: 0.5,
            }}
          >
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "admin" ? "secondary" : "default"}
          size="small"
          icon={
            params.value === "admin" && <AdminPanelSettings fontSize="small" />
          }
          sx={{
            textTransform: "capitalize",
            borderRadius: "6px",
            fontWeight: 600,
            width: 80,
          }}
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Joined Date",
      width: 150,
      renderCell: (params) =>
        new Date(params.value).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      field: "_id",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <Tooltip title="View details">
          <IconButton
            size="small"
            onClick={() => handleViewDetails(params.value)}
            sx={{
              "&:hover": {
                backgroundColor: "action.hover",
                transform: "scale(1.1)",
              },
              transition: "transform 0.2s ease",
            }}
          >
            <Info fontSize="small" color="primary" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    fetchUsers();
  };

  const handleViewDetails = (userId) => {
    navigate(`/dashboard/qr-table/${userId}`)
  };

  if (error) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center" }}>
        <Alert
          severity="error"
          action={
            <IconButton color="inherit" size="small" onClick={handleRefresh}>
              <Refresh fontSize="inherit" />
            </IconButton>
          }
          sx={{
            borderRadius: 3,
            width: "100%",
            maxWidth: 600,
            boxShadow: theme.shadows[3],
          }}
          iconMapping={{
            error: <Info fontSize="inherit" sx={{ mt: 0.5 }} />,
          }}
        >
          <Typography variant="body2" fontWeight="medium">
            {error}
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 3,
        borderRadius: 4,
        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
        background: theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            User Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {users.length} registered users • Last updated{" "}
            {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
        <Box>
          <Tooltip title="Export to CSV">
            <IconButton
              onClick={handleExportCSV}
              sx={{
                backgroundColor: "action.selected",
                "&:hover": {
                  backgroundColor: "action.hover",
                  color: "primary.main",
                },
                mr: 1,
                borderRadius: 2,
              }}
            >
              <Download />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh data">
            <IconButton
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                backgroundColor: "action.selected",
                "&:hover": {
                  backgroundColor: "action.hover",
                  color: "primary.main",
                },
                borderRadius: 2,
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ flex: 1, position: "relative", minHeight: 400 }}>
        <StyledDataGrid
          rows={users}
          columns={columns}
          loading={loading}
          disableSelectionOnClick
          getRowId={(row) => row._id}
          components={{
            LoadingOverlay: LinearProgress,
            Toolbar: GridToolbar,
          }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 300 },
              sx: {
                "& .MuiTextField-root": {
                  borderColor: "divider",
                  borderRadius: 2,
                  background: theme.palette.background.default,
                },
              },
            },
          }}
          initialState={{
            pagination: {
              pageSize: 10,
            },
          }}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          sx={{
            height: "100%",
            "& .MuiDataGrid-virtualScroller": {
              overflow: "auto",
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default UsersTable;