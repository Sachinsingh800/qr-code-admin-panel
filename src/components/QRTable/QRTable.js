import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Alert,
  IconButton,
  Tooltip,
  Paper,
  Chip,
  useTheme,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Refresh, Info, Download, Link, TextFields } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 0,
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: theme.palette.background.paper,
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

const QRTable = () => {
  const theme = useTheme();
  const [qrData, setQrData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contentTypeFilter, setContentTypeFilter] = useState("all");
  const navigate = useNavigate();
  const { id } = useParams();

  const constructApiUrl = () => {
    const baseUrl = `http://13.203.219.119:3001/admin/user/qr/textFilter/${id}`;
    return contentTypeFilter !== "all"
      ? `${baseUrl}?contentType=${contentTypeFilter}`
      : baseUrl;
  };

  const fetchQRData = async () => {
    const token = Cookies.get("adminToken");
    if (!token) {
      navigate("/auth");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(constructApiUrl(), {
        method: "GET",
        headers: {
          "x-admin-token": token,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.data && Array.isArray(data.data)) {
        setQrData(data.data);
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch QR data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRData();
  }, [contentTypeFilter]);

  const handleDownloadContent = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = url.split("/").pop();
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      setError("Failed to download file. Please try again.");
    }
  };

  const handleExportCSV = () => {
    if (qrData.length === 0) return;

    const csvContent = [
      ["Purpose", "Content Type", "Text/Link", "Created At"],
      ...qrData.map((item) => [
        `"${item.purpose.replace(/"/g, '""')}"`,
        item.contentType,
        item.contentType === "link"
          ? item.text
          : `"${item.text.replace(/"/g, '""')}"`,
        new Date(item.createdAt).toLocaleDateString("en-IN", {
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
    link.download = "qr_data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      field: "purpose",
      headerName: "Purpose",
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          {params.value || "N/A"}
        </Typography>
      ),
    },
    {
      field: "contentType",
      headerName: "Content Type",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "link" ? "primary" : "secondary"}
          size="small"
          icon={
            params.value === "link" ? (
              <Link fontSize="small" />
            ) : (
              <TextFields fontSize="small" />
            )
          }
          sx={{
            textTransform: "capitalize",
            borderRadius: "6px",
            fontWeight: 600,
            width: 90,
          }}
        />
      ),
    },
    {
      field: "text",
      headerName: "Content",
      flex: 2,
      renderCell: (params) => {
        const isDocument = /\.(docx|pdf|txt|doc)$/i.test(params.value);

        return (
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <Tooltip title={params.value} placement="top">
              <Typography
                variant="body2"
                noWrap
                sx={{
                  color: isDocument
                    ? theme.palette.secondary.main
                    : params.row.contentType === "link"
                    ? theme.palette.primary.main
                    : "text.secondary",
                  textDecoration: "none",
                  cursor:
                    isDocument || params.row.contentType === "link"
                      ? "pointer"
                      : "default",
                }}
                onClick={() => {
                  if (isDocument) {
                    handleDownloadContent(params.value);
                  } else if (params.row.contentType === "link") {
                    window.open(params.value, "_blank");
                  }
                }}
              >
                {isDocument
                  ? `Download ${params.value.split(".").pop().toUpperCase()}`
                  : params.value}
              </Typography>
            </Tooltip>
          </Box>
        );
      },
    },
    {
      field: "file.url",
      headerName: "QR Code",
      width: 120,
      renderCell: (params) => (
        <Tooltip title="Download QR Code">
          <IconButton
            size="small"
            onClick={() => handleDownloadContent(params.row.file.url)}
            sx={{
              "&:hover": {
                backgroundColor: "action.hover",
                transform: "scale(1.1)",
              },
              transition: "transform 0.2s ease",
            }}
          >
            <Download fontSize="small" color="primary" />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      width: 150,
      renderCell: (params) =>
        new Date(params.value).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
  ];

  const handleRefresh = () => {
    setError(null);
    fetchQRData();
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
            QR Code Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {qrData.length} QR entries • Last updated{" "}
            {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
        <Box style={{ display: "flex" }}>
          <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Content Type</InputLabel>
              <Select
                value={contentTypeFilter}
                label="Content Type"
                onChange={(e) => setContentTypeFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="link">Link</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Tooltip title="Export to CSV">
            <IconButton
              onClick={handleExportCSV}
              sx={{
                minWidth: 80,
                height: 50,
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
                minWidth: 80,
                height: 50,
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
          rows={qrData}
          columns={columns}
          loading={loading}
          disableSelectionOnClick
          getRowId={(row) => row._id}
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
          components={{
            LoadingOverlay: LinearProgress,
            Toolbar: GridToolbar,
          }}
        />
      </Box>
    </Paper>
  );
};

export default QRTable;
