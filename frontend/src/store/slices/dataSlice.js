import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../config';

// Helper function to handle network errors
const handleNetworkError = (error) => {
  if (!error.response) {
    return 'Unable to connect to the server. Please check your connection.';
  }
  if (error.response.status === 500) {
    window.location.href = '/500';
    return 'An unexpected server error occurred.';
  }
  return error.response?.data?.detail || 'An error occurred while processing your request.';
};

export const fetchCsvData = createAsyncThunk(
  'data/fetchCsvData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/csv`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleNetworkError(error));
    }
  }
);

export const createCsvEntry = createAsyncThunk(
  'data/createCsvEntry',
  async (entry, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/csv`, entry);
      return { entry, version: response.data.version };
    } catch (error) {
      return rejectWithValue(handleNetworkError(error));
    }
  }
);

export const updateCsvEntry = createAsyncThunk(
  'data/updateCsvEntry',
  async ({ apiKey, updates }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/api/csv/${apiKey}`, updates);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleNetworkError(error));
    }
  }
);

export const deleteCsvEntry = createAsyncThunk(
  'data/deleteCsvEntry',
  async (apiKey, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/csv/${apiKey}`);
      return apiKey;
    } catch (error) {
      return rejectWithValue(handleNetworkError(error));
    }
  }
);

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    csvData: [],
    performanceData: {
      timestamps: [],
      values: [],
      isConnected: false
    },
    loading: false,
    error: null,
    currentVersion: 1,
    networkError: false,
  },
  reducers: {
    initializePerformanceData: (state, action) => {
      const data = action.payload;
      state.performanceData.timestamps = data.map(d => d.timestamp);
      state.performanceData.values = data.map(d => d.value);
    },
    updatePerformanceData: (state, action) => {
      const { timestamp, value } = action.payload;
      state.performanceData.timestamps.push(timestamp);
      state.performanceData.values.push(value);
      
      // Keep only last 50 data points
      if (state.performanceData.timestamps.length > 50) {
        state.performanceData.timestamps.shift();
        state.performanceData.values.shift();
      }
    },
    setWebSocketConnected: (state, action) => {
      state.performanceData.isConnected = action.payload;
    },
    clearError: (state) => {
      state.error = null;
      state.networkError = false;
    },
    setNetworkError: (state, action) => {
      state.networkError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch CSV data
      .addCase(fetchCsvData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.networkError = false;
      })
      .addCase(fetchCsvData.fulfilled, (state, action) => {
        state.loading = false;
        state.csvData = action.payload;
        state.networkError = false;
      })
      .addCase(fetchCsvData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.networkError = !action.payload.includes('server');
      })
      // Create entry
      .addCase(createCsvEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCsvEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.csvData.push(action.payload.entry);
        state.currentVersion = action.payload.version;
        state.networkError = false;
      })
      .addCase(createCsvEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.networkError = !action.payload.includes('server');
      })
      // Update entry
      .addCase(updateCsvEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCsvEntry.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.csvData.findIndex(item => item['API key'] === action.payload['API key']);
        if (index !== -1) {
          state.csvData[index] = action.payload;
        }
        state.networkError = false;
      })
      .addCase(updateCsvEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.networkError = !action.payload.includes('server');
      })
      // Delete entry
      .addCase(deleteCsvEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCsvEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.csvData = state.csvData.filter(item => item['API key'] !== action.payload);
        state.networkError = false;
      })
      .addCase(deleteCsvEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.networkError = !action.payload.includes('server');
      });
  },
});

export const { initializePerformanceData, updatePerformanceData, setWebSocketConnected, clearError, setNetworkError } = dataSlice.actions;
export default dataSlice.reducer;
