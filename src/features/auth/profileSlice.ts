/* eslint-disable @typescript-eslint/no-explicit-any */
// store/slices/profileSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProfile, getUserByUsername, editProfile, uploadProfileImage as uploadProfileImageApi } from '@/api/profile';
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

// 프로필 수정 (uuid)
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (
    {
      uuid,
      userNickname,
      intro,
      socialLinks,
    }: {
      uuid: string;
      userNickname?: string;
      intro?: string;
      socialLinks?: {
        githubUrl?: string;
        notionUrl?: string;
        linkedinUrl?: string;
        personalWebsiteUrl?: string;
      };
    },
    { rejectWithValue },
  ) => {
    try {
      const result = await editProfile(uuid, {
        ...(userNickname ? { nickname: userNickname } : {}),
        ...(intro !== undefined ? { intro } : {}),
        ...(socialLinks ?? {}),
      });
      return { ...result, userNickname, intro, socialLinks };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || '프로필 수정 실패');
    }
  },
);

export const uploadProfileImage = createAsyncThunk(
  'profile/uploadProfileImage',
  async ({ uuid, file }: { uuid: string; file: File }, { rejectWithValue }) => {
    try {
      return await uploadProfileImageApi(uuid, file);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || '프로필 이미지 업로드 실패');
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
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile = { ...state.profile, ...action.payload };
        } else {
          state.profile = action.payload;
        }
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.profileImage = action.payload;
        }
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
