import type {
  DoctorPage,
  KnowledgePage,
  KnowledgeParams,
  FollowType,
  PageParams
} from '@/types/consult'
import { request } from '@/utils/request'
// 获取文章列表
export const getKnowledgePage = (params: KnowledgeParams) =>
  request<KnowledgePage>('patient/home/knowledge', 'GET', params)
// 获取展示关注医生
export const getDoctorPage = (params: PageParams) =>
  request<DoctorPage>('home/page/doc', 'GET', params)
// 关注 type 医生|文章|百科话题|疾病
export const followOrUnfollow = (id: string, type: FollowType) =>
  request('like', 'POST', { id, type })
