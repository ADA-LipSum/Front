/* eslint-disable @typescript-eslint/no-explicit-any */
// store/slices/profileSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProfile, getUserByUsername } from '@/api/profile';
import type { Profile } from '@/types/profile';

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

// 프로필 조회 (uuid)
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (uuid: string, { rejectWithValue }) => {
    try {
      const data = await getProfile(uuid);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || '프로필 조회 실패');
    }
  },
);

// 프로필 조회 (customId/username)
export const fetchProfileByUsername = createAsyncThunk(
  'profile/fetchProfileByUsername',
  async (username: string, { rejectWithValue }) => {
    try {
      const data = await getUserByUsername(username);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || '프로필 조회 실패');
    }
  },
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProfileByUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileByUsername.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfileByUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
