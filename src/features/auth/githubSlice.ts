import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserGitHubContributions } from '@/api/github';
import type { UserGithubContributions } from '@/types/github';

interface GithubState {
  contributions: UserGithubContributions | null;
  loading: boolean;
  error: string | null;
}

const initialState: GithubState = {
  contributions: null,
  loading: false,
  error: null,
};

// 깃허브 잔디 정보 조회
export const fetchGithubContributions = createAsyncThunk(
  'github/fetchContributions',
  async (year: number, { rejectWithValue }) => {
    try {
      const data = await getUserGitHubContributions(year);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || '깃허브 잔디 정보 조회 실패');
    }
  },
);

const githubSlice = createSlice({
  name: 'github',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGithubContributions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGithubContributions.fulfilled, (state, action) => {
        state.loading = false;
        state.contributions = action.payload;
      })
      .addCase(fetchGithubContributions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default githubSlice.reducer;
