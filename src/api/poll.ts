import axios from './axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string | null;
}

export interface PollVoter {
  voterUuid: string;
  voterName: string;
}

export interface PollOption {
  id: number;
  text: string;
  voteCount: number;
  voters: PollVoter[];
}

export interface PollDetail {
  id: number;
  postUuid: string;
  question: string;
  anonymous: boolean;
  endsAt: string;
  ended: boolean;
  totalVotes: number;
  myOptionId: number | null;
  options: PollOption[];
}

export const getPoll = async (postUuid: string): Promise<PollDetail> => {
  const res = await axios.get<ApiResponse<PollDetail>>(`/api/polls/posts/${postUuid}`);
  return res.data.data;
};

export const votePoll = async (postUuid: string, optionId: number): Promise<PollDetail> => {
  const res = await axios.post<ApiResponse<PollDetail>>(`/api/polls/posts/${postUuid}/votes`, {
    optionId,
  });
  return res.data.data;
};
